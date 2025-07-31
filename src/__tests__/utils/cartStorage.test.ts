import { describe, test, expect, beforeEach, jest } from 'bun:test';
import {
  saveCartToStorage,
  loadCartFromStorage,
  clearCartFromStorage,
  createEmptyCart,
  calculateCartTotals,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
} from '../../utils/cartStorage';
import { createMockCart, createMockCartItem, createMockProduct, cleanupAfterEach } from './test-helpers';

describe('cartStorage utils', () => {
  beforeEach(() => {
    cleanupAfterEach();
  });

  describe('saveCartToStorage', () => {
    test('saves cart to localStorage', () => {
      const cart = createMockCart();
      saveCartToStorage(cart);

      const saved = localStorage.getItem('ecommerce_cart');
      expect(saved).not.toBeNull();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.items).toEqual(cart.items);
      expect(parsed.timestamp).toBeTypeOf('number');
    });

    test('handles localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      const cart = createMockCart();
      expect(() => saveCartToStorage(cart)).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });

  describe('loadCartFromStorage', () => {
    test('loads cart from localStorage', () => {
      const originalCart = createMockCart();
      saveCartToStorage(originalCart);

      const loadedCart = loadCartFromStorage();
      expect(loadedCart.items).toEqual(originalCart.items);
      expect(loadedCart.total).toBe(originalCart.total);
      expect(loadedCart.itemCount).toBe(originalCart.itemCount);
    });

    test('returns empty cart when no data in storage', () => {
      const cart = loadCartFromStorage();
      expect(cart).toEqual(createEmptyCart());
    });

    test('returns empty cart for invalid JSON', () => {
      localStorage.setItem('ecommerce_cart', 'invalid json');
      const cart = loadCartFromStorage();
      expect(cart).toEqual(createEmptyCart());
    });

    test('clears stale cart data', () => {
      const staleTimestamp = Date.now() - (8 * 24 * 60 * 60 * 1000); // 8 days ago
      const staleData = {
        items: [createMockCartItem()],
        timestamp: staleTimestamp,
      };
      localStorage.setItem('ecommerce_cart', JSON.stringify(staleData));

      const cart = loadCartFromStorage();
      expect(cart).toEqual(createEmptyCart());
      expect(localStorage.getItem('ecommerce_cart')).toBeNull();
    });

    test('filters out invalid cart items', () => {
      const validItem = createMockCartItem();
      const invalidItem = { id: 'invalid', product: 'not a product', quantity: 'not a number' };
      const cartData = {
        items: [validItem, invalidItem],
        timestamp: Date.now(),
      };
      localStorage.setItem('ecommerce_cart', JSON.stringify(cartData));

      const cart = loadCartFromStorage();
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual(validItem);
    });

    test('handles localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      const cart = loadCartFromStorage();
      expect(cart).toEqual(createEmptyCart());

      localStorage.getItem = originalGetItem;
    });
  });

  describe('clearCartFromStorage', () => {
    test('removes cart from localStorage', () => {
      const cart = createMockCart();
      saveCartToStorage(cart);
      expect(localStorage.getItem('ecommerce_cart')).not.toBeNull();

      clearCartFromStorage();
      expect(localStorage.getItem('ecommerce_cart')).toBeNull();
    });

    test('handles localStorage errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage access denied');
      });

      expect(() => clearCartFromStorage()).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('createEmptyCart', () => {
    test('creates empty cart with correct structure', () => {
      const cart = createEmptyCart();
      expect(cart).toEqual({
        items: [],
        total: 0,
        itemCount: 0,
      });
    });
  });

  describe('calculateCartTotals', () => {
    test('calculates totals correctly for multiple items', () => {
      const items = [
        createMockCartItem({ product: createMockProduct({ price: 10 }), quantity: 2 }),
        createMockCartItem({ product: createMockProduct({ price: 20 }), quantity: 1 }),
      ];

      const cart = calculateCartTotals(items);
      expect(cart.total).toBe(40); // (10 * 2) + (20 * 1)
      expect(cart.itemCount).toBe(3); // 2 + 1
      expect(cart.items).toEqual(items);
    });

    test('calculates totals correctly for empty array', () => {
      const cart = calculateCartTotals([]);
      expect(cart.total).toBe(0);
      expect(cart.itemCount).toBe(0);
      expect(cart.items).toEqual([]);
    });
  });

  describe('addItemToCart', () => {
    test('adds new item to empty cart', () => {
      const emptyCart = createEmptyCart();
      const product = createMockProduct({ price: 25 });
      
      const updatedCart = addItemToCart(emptyCart, product.id, product, 2);
      
      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].product).toEqual(product);
      expect(updatedCart.items[0].quantity).toBe(2);
      expect(updatedCart.total).toBe(50);
      expect(updatedCart.itemCount).toBe(2);
    });

    test('increases quantity for existing item', () => {
      const product = createMockProduct({ id: 'existing', price: 15 });
      const existingItem = createMockCartItem({ product, quantity: 1 });
      const cart = createMockCart({ items: [existingItem] });

      const updatedCart = addItemToCart(cart, product.id, product, 2);
      
      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].quantity).toBe(3);
      expect(updatedCart.total).toBe(45); // 15 * 3
      expect(updatedCart.itemCount).toBe(3);
    });

    test('adds new item to cart with existing items', () => {
      const existingProduct = createMockProduct({ id: 'existing', price: 10 });
      const existingItem = createMockCartItem({ product: existingProduct, quantity: 1 });
      const cart = createMockCart({ items: [existingItem] });

      const newProduct = createMockProduct({ id: 'new', price: 20 });
      const updatedCart = addItemToCart(cart, newProduct.id, newProduct, 1);
      
      expect(updatedCart.items).toHaveLength(2);
      expect(updatedCart.total).toBe(30); // 10 + 20
      expect(updatedCart.itemCount).toBe(2);
    });
  });

  describe('removeItemFromCart', () => {
    test('removes item from cart', () => {
      const product1 = createMockProduct({ id: 'product1', price: 10 });
      const product2 = createMockProduct({ id: 'product2', price: 20 });
      const items = [
        createMockCartItem({ product: product1, quantity: 1 }),
        createMockCartItem({ product: product2, quantity: 2 }),
      ];
      const cart = createMockCart({ items });

      const updatedCart = removeItemFromCart(cart, 'product1');
      
      expect(updatedCart.items).toHaveLength(1);
      expect(updatedCart.items[0].product.id).toBe('product2');
      expect(updatedCart.total).toBe(40); // 20 * 2
      expect(updatedCart.itemCount).toBe(2);
    });

    test('returns empty cart when removing last item', () => {
      const product = createMockProduct({ id: 'only', price: 15 });
      const item = createMockCartItem({ product, quantity: 1 });
      const cart = createMockCart({ items: [item] });

      const updatedCart = removeItemFromCart(cart, 'only');
      
      expect(updatedCart.items).toHaveLength(0);
      expect(updatedCart.total).toBe(0);
      expect(updatedCart.itemCount).toBe(0);
    });

    test('does nothing when product not found', () => {
      const cart = createMockCart();
      const originalCart = { ...cart, items: [...cart.items] };

      const updatedCart = removeItemFromCart(cart, 'nonexistent');
      
      expect(updatedCart.items).toEqual(originalCart.items);
      expect(updatedCart.total).toBe(originalCart.total);
      expect(updatedCart.itemCount).toBe(originalCart.itemCount);
    });
  });

  describe('updateItemQuantity', () => {
    test('updates quantity for existing item', () => {
      const product = createMockProduct({ id: 'test', price: 10 });
      const item = createMockCartItem({ product, quantity: 2 });
      const cart = createMockCart({ items: [item] });

      const updatedCart = updateItemQuantity(cart, 'test', 5);
      
      expect(updatedCart.items[0].quantity).toBe(5);
      expect(updatedCart.total).toBe(50);
      expect(updatedCart.itemCount).toBe(5);
    });

    test('removes item when quantity is 0', () => {
      const product = createMockProduct({ id: 'test', price: 10 });
      const item = createMockCartItem({ product, quantity: 2 });
      const cart = createMockCart({ items: [item] });

      const updatedCart = updateItemQuantity(cart, 'test', 0);
      
      expect(updatedCart.items).toHaveLength(0);
      expect(updatedCart.total).toBe(0);
      expect(updatedCart.itemCount).toBe(0);
    });

    test('removes item when quantity is negative', () => {
      const product = createMockProduct({ id: 'test', price: 10 });
      const item = createMockCartItem({ product, quantity: 2 });
      const cart = createMockCart({ items: [item] });

      const updatedCart = updateItemQuantity(cart, 'test', -1);
      
      expect(updatedCart.items).toHaveLength(0);
      expect(updatedCart.total).toBe(0);
      expect(updatedCart.itemCount).toBe(0);
    });

    test('does nothing when product not found', () => {
      const cart = createMockCart();
      const originalCart = { ...cart, items: [...cart.items] };

      const updatedCart = updateItemQuantity(cart, 'nonexistent', 5);
      
      expect(updatedCart.items).toEqual(originalCart.items);
      expect(updatedCart.total).toBe(originalCart.total);
      expect(updatedCart.itemCount).toBe(originalCart.itemCount);
    });
  });
});