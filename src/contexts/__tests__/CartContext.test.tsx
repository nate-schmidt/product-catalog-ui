import { test, expect, describe, beforeEach } from 'bun:test';
import { render, act, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '../../types/Product';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Sample products for testing
const sampleProduct1: Product = {
  id: 1,
  name: 'Test Chair',
  description: 'A comfortable test chair',
  price: 299.99,
  currency: 'USD',
  stockQuantity: 10,
  category: 'Furniture',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

const sampleProduct2: Product = {
  id: 2,
  name: 'Test Table',
  description: 'A sturdy test table',
  price: 599.99,
  currency: 'USD',
  stockQuantity: 5,
  category: 'Furniture',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

const outOfStockProduct: Product = {
  id: 3,
  name: 'Out of Stock Item',
  description: 'This item is out of stock',
  price: 199.99,
  currency: 'USD',
  stockQuantity: 0,
  category: 'Furniture',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

describe('CartContext', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('throws error when useCart is used outside CartProvider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });

  describe('CartProvider', () => {
    test('provides initial empty cart state', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      expect(result.current.cart.items).toEqual([]);
      expect(result.current.cart.total).toBe(0);
      expect(result.current.getItemCount()).toBe(0);
      expect(result.current.getCartTotal()).toBe(0);
    });

    test('adds item to cart successfully', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product).toEqual(sampleProduct1);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.cart.total).toBe(599.98); // 299.99 * 2
      expect(result.current.getItemCount()).toBe(2);
      expect(result.current.isInCart(1)).toBe(true);
      expect(result.current.getItemQuantity(1)).toBe(2);
    });

    test('adds item with default quantity of 1', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1);
      });

      expect(result.current.cart.items[0].quantity).toBe(1);
      expect(result.current.getItemCount()).toBe(1);
    });

    test('increases quantity when adding existing item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 3);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.getItemCount()).toBe(5);
    });

    test('throws error when adding more than available stock', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      expect(() => {
        act(() => {
          result.current.addToCart(sampleProduct1, 15); // More than stock quantity of 10
        });
      }).toThrow('Not enough stock available');
    });

    test('adds multiple different items to cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
        result.current.addToCart(sampleProduct2, 1);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.getItemCount()).toBe(3);
      expect(result.current.cart.total).toBe(1199.97); // (299.99 * 2) + 599.99
      expect(result.current.isInCart(1)).toBe(true);
      expect(result.current.isInCart(2)).toBe(true);
      expect(result.current.isInCart(3)).toBe(false);
    });

    test('removes item from cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
        result.current.addToCart(sampleProduct2, 1);
      });

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(2);
      expect(result.current.cart.total).toBe(599.99);
      expect(result.current.isInCart(1)).toBe(false);
      expect(result.current.isInCart(2)).toBe(true);
    });

    test('updates item quantity', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.total).toBe(1499.95); // 299.99 * 5
      expect(result.current.getItemCount()).toBe(5);
    });

    test('removes item when updating quantity to 0', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(1, 0);
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.total).toBe(0);
      expect(result.current.isInCart(1)).toBe(false);
    });

    test('removes item when updating quantity to negative', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(1, -1);
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.total).toBe(0);
    });

    test('throws error when updating quantity exceeds stock', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
      });

      expect(() => {
        act(() => {
          result.current.updateQuantity(1, 15); // More than stock quantity of 10
        });
      }).toThrow('Not enough stock available');
    });

    test('clears entire cart', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 2);
        result.current.addToCart(sampleProduct2, 1);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.total).toBe(0);
      expect(result.current.getItemCount()).toBe(0);
      expect(result.current.isInCart(1)).toBe(false);
      expect(result.current.isInCart(2)).toBe(false);
    });

    test('correctly calculates total with different currencies (assumes same currency)', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct1, 1); // $299.99
        result.current.addToCart(sampleProduct2, 2); // $599.99 * 2 = $1199.98
      });

      expect(result.current.cart.total).toBeCloseTo(1499.97, 2); // 299.99 + 1199.98 = 1499.97
    });

    test('getItemQuantity returns 0 for non-existent item', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      expect(result.current.getItemQuantity(999)).toBe(0);
    });

    test('handles edge case with zero-priced items', () => {
      const freeProduct: Product = {
        ...sampleProduct1,
        id: 4,
        name: 'Free Sample',
        price: 0
      };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(freeProduct, 3);
      });

      expect(result.current.cart.total).toBe(0);
      expect(result.current.getItemCount()).toBe(3);
    });

    test('handles precision correctly with decimal prices', () => {
      const decimalProduct: Product = {
        ...sampleProduct1,
        id: 5,
        price: 10.99
      };

      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(decimalProduct, 3);
      });

      expect(result.current.cart.total).toBeCloseTo(32.97, 2);
    });
  });

  describe('stock validation', () => {
    test('allows adding item within stock limits', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct2, 5); // Exactly the stock quantity
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
    });

    test('prevents adding item when out of stock', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      expect(() => {
        act(() => {
          result.current.addToCart(outOfStockProduct, 1);
        });
      }).toThrow('Not enough stock available');
    });

    test('prevents updating to quantity that exceeds stock', () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: ({ children }) => <CartProvider>{children}</CartProvider>
      });

      act(() => {
        result.current.addToCart(sampleProduct2, 2);
      });

      expect(() => {
        act(() => {
          result.current.updateQuantity(2, 6); // Stock is 5
        });
      }).toThrow('Not enough stock available');
    });
  });
});