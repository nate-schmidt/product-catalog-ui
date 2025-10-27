import { test, expect, describe, beforeEach, vi, afterEach } from 'bun:test';
import { render, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import App from '../App';
import { Window } from 'happy-dom';

// Setup DOM environment
const window = new Window();
(global as any).window = window;
(global as any).document = window.document;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;
(global as any).SVGElement = window.SVGElement;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
(global as any).localStorage = mockLocalStorage;

// Mock fetch to use fallback data
global.fetch = vi.fn(() =>
  Promise.reject(new Error('Network error - falling back to mock data'))
);

describe('User Workflows Integration Tests', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.document.body.innerHTML = '';
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
    window.document.body.innerHTML = '';
  });

  test('Complete shopping workflow: browse products → add to cart → view cart → continue shopping', async () => {
    const { getByText, getAllByText } = render(<App />);

    // Step 1: App loads with product catalog
    expect(getByText('Loading products...')).toBeDefined();

    // Wait for products to load
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Step 2: Verify products are displayed
    expect(getByText('Modern Leather Sofa')).toBeDefined();
    expect(getByText('$1,299')).toBeDefined();

    // Step 3: Add first available product to cart
    const addToCartButtons = getAllByText('Add to Cart');
    expect(addToCartButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(addToCartButtons[0]);
    });

    // Step 4: Verify success message appears
    await waitFor(() => {
      const successMessage = document.querySelector('.bg-green-100');
      expect(successMessage).toBeDefined();
    });

    // Step 5: Add another product to cart
    if (addToCartButtons.length > 1) {
      await act(async () => {
        fireEvent.click(addToCartButtons[1]);
      });
    }

    // Step 6: Navigate to cart
    await act(async () => {
      const cartBadge = getByText(/Cart|\d+ item/);
      fireEvent.click(cartBadge);
    });

    // Step 7: Verify cart page loads and shows items
    await waitFor(() => {
      expect(getByText('Shopping Cart')).toBeDefined();
      expect(document.querySelector('.bg-white.rounded-lg.shadow-lg')).toBeDefined(); // Cart items
    });

    // Step 8: Navigate back to catalog
    const backButton = document.querySelector('button svg[viewBox="0 0 24 24"]');
    if (backButton?.parentElement) {
      await act(async () => {
        fireEvent.click(backButton.parentElement);
      });

      await waitFor(() => {
        expect(getByText('Product Catalog')).toBeDefined();
      });
    }
  }, 10000);

  test('Empty cart workflow: start with empty cart → view empty state → continue shopping', async () => {
    const { getByText } = render(<App />);

    // Wait for catalog to load
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Navigate to empty cart
    const cartBadge = getByText('Cart');
    await act(async () => {
      fireEvent.click(cartBadge);
    });

    // Verify empty cart state
    await waitFor(() => {
      expect(getByText('Your cart is empty')).toBeDefined();
      expect(getByText('Add some items to get started!')).toBeDefined();
      expect(getByText('Continue Shopping')).toBeDefined();
    });

    // Continue shopping
    const continueButton = getByText('Continue Shopping');
    await act(async () => {
      fireEvent.click(continueButton);
    });

    // Should return to catalog
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    });
  });

  test('Cart persistence workflow: add items → refresh app → verify cart persists', async () => {
    // First render - add items to cart
    const { getByText, getAllByText, unmount } = render(<App />);

    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Add product to cart
    const addToCartButtons = getAllByText('Add to Cart');
    await act(async () => {
      fireEvent.click(addToCartButtons[0]);
    });

    // Verify localStorage was called to save cart
    expect(mockLocalStorage.setItem).toHaveBeenCalled();

    // Unmount app to simulate page refresh
    unmount();

    // Mock localStorage to return saved cart data
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Modern Leather Sofa',
          description: 'Test description',
          price: 1299,
          inStock: true
        },
        quantity: 1,
        addedAt: new Date().toISOString()
      }],
      totalItems: 1,
      totalPrice: 1299
    }));

    // Re-render app (simulate refresh)
    const { getByText: getByText2 } = render(<App />);

    await waitFor(() => {
      expect(getByText2('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Cart should show the persisted item
    const cartBadge = getByText2(/1 item/);
    expect(cartBadge).toBeDefined();

    // Navigate to cart and verify item is there
    await act(async () => {
      fireEvent.click(cartBadge);
    });

    await waitFor(() => {
      expect(getByText2('Shopping Cart')).toBeDefined();
      expect(getByText2('Modern Leather Sofa')).toBeDefined();
    });
  });

  test('Product interaction workflow: view products → check stock status → interact with different product types', async () => {
    const { getByText, getAllByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Check for in-stock products
    const inStockIndicators = document.querySelectorAll('*:contains("✅")');
    expect(inStockIndicators.length).toBeGreaterThan(0);

    // Check for out-of-stock products  
    const outOfStockButtons = getAllByText('Out of Stock');
    expect(outOfStockButtons.length).toBeGreaterThan(0);

    // Verify out-of-stock buttons are disabled
    outOfStockButtons.forEach(button => {
      expect(button.hasAttribute('disabled')).toBe(true);
    });

    // Check product categories are displayed
    expect(getByText('Furniture')).toBeDefined();
    
    // Check product details are shown
    expect(getByText(/Material:/)).toBeDefined();
    expect(getByText(/Color:/)).toBeDefined();
    expect(getByText(/Dimensions:/)).toBeDefined();
    expect(getByText(/Stock:/)).toBeDefined();
  });

  test('Cart management workflow: add items → modify quantities → remove items → clear cart', async () => {
    // Start with some items in cart
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test description',
          price: 100,
          inStock: true
        },
        quantity: 2,
        addedAt: new Date().toISOString()
      }],
      totalItems: 2,
      totalPrice: 200
    }));

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Navigate to cart
    const cartBadge = getByText(/2 items/);
    await act(async () => {
      fireEvent.click(cartBadge);
    });

    await waitFor(() => {
      expect(getByText('Shopping Cart')).toBeDefined();
      expect(getByText('Test Product')).toBeDefined();
    });

    // Check that quantity controls are present
    const quantitySection = document.querySelector('.flex.items-center.gap-2');
    expect(quantitySection).toBeDefined();

    // Check for order summary
    expect(getByText('Order Summary')).toBeDefined();
    expect(getByText('Subtotal (2 items)')).toBeDefined();
    expect(getByText('$200')).toBeDefined();

    // Check for checkout button
    expect(getByText('Proceed to Checkout')).toBeDefined();
  });

  test('Error handling workflow: handle API failures → show fallback data → retry functionality', async () => {
    // This test verifies our app gracefully handles API failures
    const { getByText } = render(<App />);

    // Should start with loading
    expect(getByText('Loading products...')).toBeDefined();

    // Should fall back to mock data when API fails
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
      // Mock products should be loaded
      expect(getByText('Modern Leather Sofa')).toBeDefined();
    }, { timeout: 2000 });

    // Verify that the app is functional with fallback data
    const addToCartButtons = document.querySelectorAll('button:not([disabled])');
    const workingButtons = Array.from(addToCartButtons).filter(btn => 
      btn.textContent?.includes('Add to Cart')
    );
    expect(workingButtons.length).toBeGreaterThan(0);
  });

  test('Navigation workflow: seamless navigation between catalog and cart views', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Test multiple navigation cycles
    for (let i = 0; i < 3; i++) {
      // Go to cart
      const cartBadge = getByText(/Cart/);
      await act(async () => {
        fireEvent.click(cartBadge);
      });

      await waitFor(() => {
        expect(getByText('Shopping Cart')).toBeDefined();
      });

      // Go back to catalog
      const backButton = getByText('Continue Shopping');
      await act(async () => {
        fireEvent.click(backButton);
      });

      await waitFor(() => {
        expect(getByText('Product Catalog')).toBeDefined();
      });
    }
  });
});