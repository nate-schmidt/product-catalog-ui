import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { App } from './App';
import { Window } from 'happy-dom';
import { apiClient } from './api/client';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Mock the API client
mock.module('./api/client', () => ({
  apiClient: {
    getProducts: mock(),
  },
}));

describe('App', () => {
  const mockGetProducts = apiClient.getProducts as ReturnType<typeof mock>;

  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    mockGetProducts.mockClear();
  });

  test('renders without crashing', () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);
  });

  test('displays the header with correct title', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    expect(screen.getByText('Product Catalog')).toBeDefined();
    expect(screen.getByText('Browse our furniture collection')).toBeDefined();
  });

  test('displays cart button in header', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    const cartButton = screen.getByText('Cart');
    expect(cartButton).toBeDefined();
    
    // Should show cart icon
    const cartIcon = cartButton.closest('button')?.querySelector('svg');
    expect(cartIcon).toBeDefined();
  });

  test('shows cart badge when items are added', async () => {
    const sampleProduct = {
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 100,
      currency: 'USD',
      stockQuantity: 5,
      category: 'Test',
      createdDate: '2024-01-01T00:00:00Z',
      lastModifiedDate: '2024-01-01T00:00:00Z'
    };

    mockGetProducts.mockResolvedValueOnce([sampleProduct]);
    render(<App />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeDefined();
    });

    // Add item to cart
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Check that cart badge appears
    await waitFor(() => {
      const cartBadge = document.querySelector('.bg-red-500');
      expect(cartBadge).toBeDefined();
      expect(cartBadge?.textContent).toBe('1');
    });
  });

  test('opens cart modal when cart button is clicked', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    const cartButton = screen.getByText('Cart');
    fireEvent.click(cartButton);

    // Should open cart modal
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeDefined();
      expect(screen.getByLabelText('Close cart')).toBeDefined();
    });
  });

  test('closes cart modal when close button is clicked', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    // Open cart modal
    const cartButton = screen.getByText('Cart');
    fireEvent.click(cartButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Close cart')).toBeDefined();
    });

    // Close cart modal
    const closeButton = screen.getByLabelText('Close cart');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByLabelText('Close cart')).toBeNull();
    });
  });

  test('displays product catalog component', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    // Should show the product catalog
    await waitFor(() => {
      expect(screen.getByText('Product Catalog')).toBeDefined();
      expect(screen.getByPlaceholderText('Search products...')).toBeDefined();
    });
  });

  test('has proper layout structure', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    const { container } = render(<App />);

    // Check for main container
    const main = container.querySelector('main');
    expect(main).toBeDefined();
    expect(main?.className).toContain('min-h-screen');
    expect(main?.className).toContain('bg-gray-950');

    // Check for header
    const header = container.querySelector('header');
    expect(header).toBeDefined();
    expect(header?.className).toContain('bg-gray-900');
  });

  test('integrates with CartProvider correctly', async () => {
    const sampleProduct = {
      id: 1,
      name: 'Test Product',
      description: 'A test product',
      price: 100,
      currency: 'USD',
      stockQuantity: 5,
      category: 'Test',
      createdDate: '2024-01-01T00:00:00Z',
      lastModifiedDate: '2024-01-01T00:00:00Z'
    };

    mockGetProducts.mockResolvedValueOnce([sampleProduct]);
    render(<App />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeDefined();
    });

    // Add item to cart
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Open cart to verify item was added
    const cartButton = screen.getByText('Cart');
    fireEvent.click(cartButton);

    await waitFor(() => {
      expect(screen.getByText('Shopping Cart (1)')).toBeDefined();
      expect(screen.getByText('Test Product')).toBeDefined();
    });
  });

  test('handles API errors gracefully', async () => {
    mockGetProducts.mockRejectedValueOnce(new Error('API Error'));
    render(<App />);

    // Should show error state in ProductCatalog
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeDefined();
      expect(screen.getByText('API Error')).toBeDefined();
    });
  });

  test('cart button remains accessible when no items in cart', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    render(<App />);

    const cartButton = screen.getByText('Cart');
    expect(cartButton).toBeDefined();

    // Should not show badge when cart is empty
    const cartBadge = document.querySelector('.bg-red-500');
    expect(cartBadge).toBeNull();
  });

  test('displays loading state initially', () => {
    mockGetProducts.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<App />);

    // Should show loading state from ProductCatalog
    expect(screen.getByText('Loading products...')).toBeDefined();
  });

  test('responsive design classes are applied', async () => {
    mockGetProducts.mockResolvedValueOnce([]);
    const { container } = render(<App />);

    // Check for responsive max-width container
    const maxWidthContainer = container.querySelector('.max-w-7xl');
    expect(maxWidthContainer).toBeDefined();
    expect(maxWidthContainer?.className).toContain('mx-auto');
  });

  describe('Cart Integration', () => {
    test('cart state persists across component interactions', async () => {
      const sampleProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'First product',
          price: 100,
          currency: 'USD',
          stockQuantity: 5,
          category: 'Test',
          createdDate: '2024-01-01T00:00:00Z',
          lastModifiedDate: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Second product',
          price: 200,
          currency: 'USD',
          stockQuantity: 3,
          category: 'Test',
          createdDate: '2024-01-01T00:00:00Z',
          lastModifiedDate: '2024-01-01T00:00:00Z'
        }
      ];

      mockGetProducts.mockResolvedValueOnce(sampleProducts);
      render(<App />);

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeDefined();
      });

      // Add both products to cart
      const addToCartButtons = screen.getAllByText('Add to Cart');
      fireEvent.click(addToCartButtons[0]);
      fireEvent.click(addToCartButtons[1]);

      // Verify cart badge shows correct count
      await waitFor(() => {
        const cartBadge = document.querySelector('.bg-red-500');
        expect(cartBadge?.textContent).toBe('2');
      });

      // Open cart and verify both items are there
      const cartButton = screen.getByText('Cart');
      fireEvent.click(cartButton);

      await waitFor(() => {
        expect(screen.getByText('Shopping Cart (2)')).toBeDefined();
        expect(screen.getByText('Product 1')).toBeDefined();
        expect(screen.getByText('Product 2')).toBeDefined();
      });
    });
  });
}); 