import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, cleanup, userEvent, waitFor, renderHook, act } from '../test-utils/render';
import { createContext, useContext, useState, ReactNode } from 'react';
import { mockProducts } from '../test-utils/mocks';

// Example CartContext for reference
interface CartItem {
  productId: number;
  quantity: number;
  product: typeof mockProducts[0];
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: typeof mockProducts[0], quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const addItem = (product: typeof mockProducts[0], quantity = 1) => {
    setItems(current => {
      const existingItem = current.find(item => item.productId === product.id);
      
      if (existingItem) {
        return current.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...current, { productId: product.id, quantity, product }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(current =>
      current.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems(current => current.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: number) => {
    return items.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId: number) => {
    const item = items.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart,
      getItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Test component to use cart
const TestComponent = () => {
  const cart = useCart();
  
  return (
    <div>
      <span data-testid="total-items">{cart.totalItems}</span>
      <span data-testid="total-price">{cart.totalPrice.toFixed(2)}</span>
      <button onClick={() => cart.addItem(mockProducts[0])}>
        Add Product 1
      </button>
      <button onClick={() => cart.addItem(mockProducts[1], 2)}>
        Add Product 2 (x2)
      </button>
      <button onClick={() => cart.updateQuantity(1, 5)}>
        Update Product 1 to 5
      </button>
      <button onClick={() => cart.removeItem(1)}>
        Remove Product 1
      </button>
      <button onClick={() => cart.clearCart()}>
        Clear Cart
      </button>
      <span data-testid="product-1-in-cart">
        {cart.isInCart(1) ? 'Yes' : 'No'}
      </span>
      <span data-testid="product-1-quantity">
        {cart.getItemQuantity(1)}
      </span>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Initial State', () => {
    test('provides initial empty cart state', () => {
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
      expect(screen.getByTestId('product-1-in-cart')).toHaveTextContent('No');
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('0');
    });
  });

  describe('Adding Items', () => {
    test('adds new item to cart', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getByText('Add Product 1'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('total-price')).toHaveTextContent('29.99');
      expect(screen.getByTestId('product-1-in-cart')).toHaveTextContent('Yes');
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('1');
    });

    test('adds multiple quantity at once', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getByText('Add Product 2 (x2)'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('99.98');
    });

    test('increments quantity when adding existing item', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getByText('Add Product 1'));
      await user.click(screen.getByText('Add Product 1'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('2');
      expect(screen.getByTestId('total-price')).toHaveTextContent('59.98');
    });
  });

  describe('Updating Quantity', () => {
    test('updates item quantity', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getByText('Add Product 1'));
      await user.click(screen.getByText('Update Product 1 to 5'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('5');
      expect(screen.getByTestId('product-1-quantity')).toHaveTextContent('5');
      expect(screen.getByTestId('total-price')).toHaveTextContent('149.95');
    });

    test('removes item when quantity is set to 0', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProducts[0]);
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.totalItems).toBe(0);
    });

    test('removes item when quantity is negative', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProducts[0]);
      });

      act(() => {
        result.current.updateQuantity(1, -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('Removing Items', () => {
    test('removes item from cart', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      await user.click(screen.getByText('Add Product 1'));
      expect(screen.getByTestId('product-1-in-cart')).toHaveTextContent('Yes');

      await user.click(screen.getByText('Remove Product 1'));
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('product-1-in-cart')).toHaveTextContent('No');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
    });
  });

  describe('Clearing Cart', () => {
    test('clears all items from cart', async () => {
      const user = userEvent.setup();
      
      render(
        <CartProvider>
          <TestComponent />
        </CartProvider>
      );

      // Add multiple items
      await user.click(screen.getByText('Add Product 1'));
      await user.click(screen.getByText('Add Product 2 (x2)'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('3');

      await user.click(screen.getByText('Clear Cart'));

      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
      expect(screen.getByTestId('product-1-in-cart')).toHaveTextContent('No');
    });
  });

  describe('Cart Calculations', () => {
    test('calculates total price correctly with multiple items', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      act(() => {
        result.current.addItem(mockProducts[0], 2); // $29.99 x 2
        result.current.addItem(mockProducts[1], 1); // $49.99 x 1
      });

      expect(result.current.totalPrice).toBe(109.97);
      expect(result.current.totalItems).toBe(3);
    });

    test('maintains price precision', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      const product = { ...mockProducts[0], price: 19.99 };
      
      act(() => {
        result.current.addItem(product, 3);
      });

      expect(result.current.totalPrice).toBe(59.97);
    });
  });

  describe('useCart Hook', () => {
    test('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useCart());
      }).toThrow('useCart must be used within CartProvider');

      console.error = originalError;
    });
  });

  describe('Multiple Cart Operations', () => {
    test('handles complex cart operations', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: CartProvider,
      });

      // Add items
      act(() => {
        result.current.addItem(mockProducts[0], 2);
        result.current.addItem(mockProducts[1], 1);
      });

      expect(result.current.totalItems).toBe(3);

      // Update quantity
      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.totalItems).toBe(6);
      expect(result.current.getItemQuantity(1)).toBe(5);

      // Remove one item
      act(() => {
        result.current.removeItem(2);
      });

      expect(result.current.totalItems).toBe(5);
      expect(result.current.isInCart(2)).toBe(false);

      // Clear cart
      act(() => {
        result.current.clearCart();
      });

      expect(result.current.totalItems).toBe(0);
      expect(result.current.items).toHaveLength(0);
    });
  });
});