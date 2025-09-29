import { test, expect, describe, beforeEach, vi } from 'bun:test';
import { cartStorage } from './cartStorage';
import { Cart, CartItem, Product } from './cartTypes';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

(global as any).localStorage = mockLocalStorage;

describe('cartStorage', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    price: 100,
    inStock: true
  };

  const mockCartItem: CartItem = {
    product: mockProduct,
    quantity: 2,
    addedAt: new Date('2023-01-01T00:00:00.000Z')
  };

  const mockCart: Cart = {
    items: [mockCartItem],
    totalItems: 2,
    totalPrice: 200
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('save', () => {
    test('saves cart to localStorage with serialized dates', () => {
      cartStorage.save(mockCart);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'ecommerce_cart',
        JSON.stringify({
          items: [{
            product: mockProduct,
            quantity: 2,
            addedAt: '2023-01-01T00:00:00.000Z'
          }],
          totalItems: 2,
          totalPrice: 200
        })
      );
    });

    test('handles errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw
      expect(() => cartStorage.save(mockCart)).not.toThrow();
    });
  });

  describe('load', () => {
    test('loads cart from localStorage and parses dates', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        items: [{
          product: mockProduct,
          quantity: 2,
          addedAt: '2023-01-01T00:00:00.000Z'
        }],
        totalItems: 2,
        totalPrice: 200
      }));

      const result = cartStorage.load();

      expect(result).toEqual(mockCart);
      expect(result.items[0].addedAt).toBeInstanceOf(Date);
    });

    test('returns empty cart when no data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = cartStorage.load();

      expect(result).toEqual({
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    });

    test('returns empty cart when data is invalid', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const result = cartStorage.load();

      expect(result).toEqual({
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    });

    test('handles localStorage errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = cartStorage.load();

      expect(result).toEqual({
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    });
  });

  describe('clear', () => {
    test('removes cart from localStorage', () => {
      cartStorage.clear();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ecommerce_cart');
    });

    test('handles errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => cartStorage.clear()).not.toThrow();
    });
  });

  describe('calculateTotals', () => {
    test('calculates correct totals for single item', () => {
      const result = cartStorage.calculateTotals([mockCartItem]);

      expect(result).toEqual({
        totalItems: 2,
        totalPrice: 200
      });
    });

    test('calculates correct totals for multiple items', () => {
      const items = [
        mockCartItem,
        {
          product: { ...mockProduct, id: '2', price: 50 },
          quantity: 1,
          addedAt: new Date()
        }
      ];

      const result = cartStorage.calculateTotals(items);

      expect(result).toEqual({
        totalItems: 3,
        totalPrice: 250
      });
    });

    test('returns zero totals for empty cart', () => {
      const result = cartStorage.calculateTotals([]);

      expect(result).toEqual({
        totalItems: 0,
        totalPrice: 0
      });
    });

    test('handles decimal prices correctly', () => {
      const items = [{
        product: { ...mockProduct, price: 99.99 },
        quantity: 3,
        addedAt: new Date()
      }];

      const result = cartStorage.calculateTotals(items);

      expect(result.totalItems).toBe(3);
      expect(Math.round(result.totalPrice * 100) / 100).toBe(299.97);
    });
  });
});