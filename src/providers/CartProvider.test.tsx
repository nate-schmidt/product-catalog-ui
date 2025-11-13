import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { CartProvider, useCart } from './CartProvider';
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

describe('CartProvider', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  test('provides cart context to children', () => {
    const TestComponent = () => {
      const { items, totalItems, subtotal } = useCart();
      return (
        <div>
          <span data-testid="items-count">{items.length}</span>
          <span data-testid="total-items">{totalItems}</span>
          <span data-testid="subtotal">{subtotal}</span>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('items-count').textContent).toBe('0');
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    expect(screen.getByTestId('subtotal').textContent).toBe('0');
  });

  test('useCart throws error when used outside provider', () => {
    const TestComponent = () => {
      try {
        useCart();
        return <div>No error</div>;
      } catch (error) {
        return <div data-testid="error">{(error as Error).message}</div>;
      }
    };

    render(<TestComponent />);
    expect(screen.getByTestId('error').textContent).toContain('useCart must be used within a CartProvider');
  });

  test('addItem adds item to cart', async () => {
    const TestComponent = () => {
      const { items, addItem } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
      }, []);
      return <div data-testid="items-count">{items.length}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('items-count').textContent).toBe('1');
    });
  });

  test('removeItem removes item from cart', async () => {
    const TestComponent = () => {
      const { items, addItem, removeItem } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
        setTimeout(() => removeItem('1'), 10);
      }, []);
      return <div data-testid="items-count">{items.length}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('items-count').textContent).toBe('0');
    }, { timeout: 2000 });
  });

  test('updateQty updates item quantity', async () => {
    const TestComponent = () => {
      const { items, addItem, updateQty } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
        setTimeout(() => updateQty('1', 5), 10);
      }, []);
      return <div data-testid="quantity">{items[0]?.quantity || 0}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('quantity').textContent).toBe('5');
    }, { timeout: 2000 });
  });

  test('clear removes all items from cart', async () => {
    const TestComponent = () => {
      const { items, addItem, clear } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
        addItem({ id: '2', name: 'Product 2', price: 20 });
        setTimeout(() => clear(), 10);
      }, []);
      return <div data-testid="items-count">{items.length}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('items-count').textContent).toBe('0');
    }, { timeout: 2000 });
  });

  test('totalItems calculates correctly', async () => {
    const TestComponent = () => {
      const { totalItems, addItem } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
        addItem({ id: '1', name: 'Product 1', price: 10 });
        addItem({ id: '2', name: 'Product 2', price: 20 });
      }, []);
      return <div data-testid="total-items">{totalItems}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('total-items').textContent).toBe('3');
    });
  });

  test('subtotal calculates correctly', async () => {
    const TestComponent = () => {
      const { subtotal, addItem } = useCart();
      useEffect(() => {
        addItem({ id: '1', name: 'Product 1', price: 10 });
        addItem({ id: '2', name: 'Product 2', price: 20 });
      }, []);
      return <div data-testid="subtotal">{subtotal}</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('subtotal').textContent).toBe('30');
    });
  });
});
