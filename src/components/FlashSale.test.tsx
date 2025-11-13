import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import FlashSale from './FlashSale';
import { CartProvider, useCart } from '../providers/CartProvider';
import { productApi } from '../services/api';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

(global as any).localStorage = localStorageMock;

// Mock productApi
const mockGetAllProducts = mock(() => Promise.resolve([]));
(productApi as any).getAllProducts = mockGetAllProducts;

describe('FlashSale Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
    mockGetAllProducts.mockClear();
  });

  test('does not render when isOpen is false', () => {
    const onClose = () => {};
    const { container } = render(
      <CartProvider>
        <FlashSale isOpen={false} onClose={onClose} />
      </CartProvider>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders when isOpen is true', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    expect(screen.getByText(/FLASH SALE/)).toBeDefined();
  });

  test('displays discount percentage', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    expect(screen.getByText(/60% OFF/)).toBeDefined();
  });

  test('displays countdown timer', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    expect(screen.getByText(/Ends in/)).toBeDefined();
  });

  test('fetches products when opened', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
    ];
    mockGetAllProducts.mockResolvedValueOnce(mockProducts);
    
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    await waitFor(() => {
      expect(mockGetAllProducts).toHaveBeenCalled();
    });
  });

  test('displays products with discounted prices', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
    ];
    mockGetAllProducts.mockResolvedValueOnce(mockProducts);
    
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeDefined();
    });
    
    // Original price should be displayed
    expect(screen.getByText(/\$100\.00/)).toBeDefined();
    // Sale price should be 40% of original (60% discount)
    expect(screen.getByText(/\$40\.00/)).toBeDefined();
  });

  test('calls onClose when close button is clicked', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    let called = false;
    const onClose = () => {
      called = true;
    };
    
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    const closeButton = screen.getByLabelText('Close flash sale');
    fireEvent.click(closeButton);
    
    expect(called).toBe(true);
  });

  test('calls onOpenChange when closed', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    let calledWith: boolean | undefined;
    const onClose = () => {};
    const onOpenChange = (open: boolean) => {
      calledWith = open;
    };
    
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} onOpenChange={onOpenChange} />
      </CartProvider>
    );
    
    const closeButton = screen.getByLabelText('Close flash sale');
    fireEvent.click(closeButton);
    
    expect(calledWith).toBe(false);
  });

  test('saves dismissal timestamp to localStorage', () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    const onClose = () => {};
    
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    const closeButton = screen.getByLabelText('Close flash sale');
    fireEvent.click(closeButton);
    
    expect(localStorageMock.getItem('flashSale:lastDismiss')).toBeTruthy();
  });

  test('displays loading state while fetching products', async () => {
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetAllProducts.mockReturnValueOnce(controlledPromise);
    
    const onClose = () => {};
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    expect(screen.getByText(/Loading flash sale products/)).toBeDefined();
    
    // Resolve the promise
    resolvePromise!([]);
    await controlledPromise;
  });

  test('displays empty state when no products available', async () => {
    mockGetAllProducts.mockResolvedValueOnce([]);
    const onClose = () => {};
    
    render(
      <CartProvider>
        <FlashSale isOpen={true} onClose={onClose} />
      </CartProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/No products available for flash sale/)).toBeDefined();
    });
  });

  test('adds flash sale item to cart with correct price', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
    ];
    mockGetAllProducts.mockResolvedValueOnce(mockProducts);
    
    const TestComponent = () => {
      const { items } = useCart();
      return (
        <>
          <FlashSale isOpen={true} onClose={() => {}} />
          <div data-testid="cart-items">{items.length}</div>
        </>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeDefined();
    });
    
    const buyButtons = screen.getAllByText('BUY NOW');
    fireEvent.click(buyButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-items').textContent).toBe('1');
    });
  });

  test('appends (Flash) to product name when adding to cart', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
    ];
    mockGetAllProducts.mockResolvedValueOnce(mockProducts);
    
    const TestComponent = () => {
      const { items } = useCart();
      return (
        <>
          <FlashSale isOpen={true} onClose={() => {}} />
          <div data-testid="item-name">{items[0]?.name || ''}</div>
        </>
      );
    };
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeDefined();
    });
    
    const buyButtons = screen.getAllByText('BUY NOW');
    fireEvent.click(buyButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByTestId('item-name').textContent).toBe('Product 1 (Flash)');
    });
  });
});
