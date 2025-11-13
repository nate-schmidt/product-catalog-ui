import { test, expect, describe, beforeEach } from 'bun:test';
import {
  cartReducer,
  loadCart,
  saveCart,
  getTotalItems,
  getSubtotal,
  type CartState,
  type CartItem,
} from './cart';

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

describe('cartReducer', () => {
  const initialState: CartState = { items: [] };

  beforeEach(() => {
    localStorageMock.clear();
  });

  test('returns initial state for unknown action', () => {
    const result = cartReducer(initialState, { type: 'UNKNOWN' } as any);
    expect(result).toEqual(initialState);
  });

  describe('ADD_ITEM', () => {
    test('adds new item to empty cart', () => {
      const action = {
        type: 'ADD_ITEM' as const,
        payload: { id: '1', name: 'Product 1', price: 10 },
      };
      const result = cartReducer(initialState, action);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({
        id: '1',
        name: 'Product 1',
        price: 10,
        quantity: 1,
      });
    });

    test('increments quantity when adding existing item', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 2 }],
      };
      const action = {
        type: 'ADD_ITEM' as const,
        payload: { id: '1', name: 'Product 1', price: 10 },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(3);
    });

    test('adds different item without affecting existing items', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'ADD_ITEM' as const,
        payload: { id: '2', name: 'Product 2', price: 20 },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(2);
      expect(result.items[1]).toEqual({
        id: '2',
        name: 'Product 2',
        price: 20,
        quantity: 1,
      });
    });
  });

  describe('REMOVE_ITEM', () => {
    test('removes item from cart', () => {
      const state: CartState = {
        items: [
          { id: '1', name: 'Product 1', price: 10, quantity: 1 },
          { id: '2', name: 'Product 2', price: 20, quantity: 2 },
        ],
      };
      const action = {
        type: 'REMOVE_ITEM' as const,
        payload: { id: '1' },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('2');
    });

    test('handles removing non-existent item', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'REMOVE_ITEM' as const,
        payload: { id: '999' },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(1);
    });

    test('removes last item from cart', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'REMOVE_ITEM' as const,
        payload: { id: '1' },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(0);
    });
  });

  describe('UPDATE_QTY', () => {
    test('updates quantity of existing item', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'UPDATE_QTY' as const,
        payload: { id: '1', quantity: 5 },
      };
      const result = cartReducer(state, action);
      expect(result.items[0].quantity).toBe(5);
    });

    test('removes item when quantity is set to 0', () => {
      const state: CartState = {
        items: [
          { id: '1', name: 'Product 1', price: 10, quantity: 1 },
          { id: '2', name: 'Product 2', price: 20, quantity: 2 },
        ],
      };
      const action = {
        type: 'UPDATE_QTY' as const,
        payload: { id: '1', quantity: 0 },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('2');
    });

    test('removes item when quantity is negative', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'UPDATE_QTY' as const,
        payload: { id: '1', quantity: -1 },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(0);
    });

    test('handles updating non-existent item', () => {
      const state: CartState = {
        items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
      };
      const action = {
        type: 'UPDATE_QTY' as const,
        payload: { id: '999', quantity: 5 },
      };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(1);
    });
  });

  describe('CLEAR', () => {
    test('clears all items from cart', () => {
      const state: CartState = {
        items: [
          { id: '1', name: 'Product 1', price: 10, quantity: 1 },
          { id: '2', name: 'Product 2', price: 20, quantity: 2 },
        ],
      };
      const action = { type: 'CLEAR' as const };
      const result = cartReducer(state, action);
      expect(result.items).toHaveLength(0);
    });

    test('clears empty cart', () => {
      const result = cartReducer(initialState, { type: 'CLEAR' as const });
      expect(result.items).toHaveLength(0);
    });
  });
});

describe('loadCart', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('returns empty cart when localStorage is empty', () => {
    const result = loadCart();
    expect(result).toEqual({ items: [] });
  });

  test('loads cart from localStorage', () => {
    const cart: CartState = {
      items: [
        { id: '1', name: 'Product 1', price: 10, quantity: 2 },
        { id: '2', name: 'Product 2', price: 20, quantity: 1 },
      ],
    };
    localStorageMock.setItem('cart:v1', JSON.stringify(cart));
    const result = loadCart();
    expect(result).toEqual(cart);
  });

  test('returns empty cart when localStorage has invalid JSON', () => {
    localStorageMock.setItem('cart:v1', 'invalid json');
    const result = loadCart();
    expect(result).toEqual({ items: [] });
  });

  test('returns empty cart when localStorage has invalid structure', () => {
    localStorageMock.setItem('cart:v1', JSON.stringify({ wrong: 'structure' }));
    const result = loadCart();
    expect(result).toEqual({ items: [] });
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = () => {
      throw new Error('Storage error');
    };
    const result = loadCart();
    expect(result).toEqual({ items: [] });
    localStorageMock.getItem = originalGetItem;
  });
});

describe('saveCart', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  test('saves cart to localStorage', () => {
    const cart: CartState = {
      items: [
        { id: '1', name: 'Product 1', price: 10, quantity: 2 },
      ],
    };
    saveCart(cart);
    const saved = localStorageMock.getItem('cart:v1');
    expect(saved).toBe(JSON.stringify(cart));
  });

  test('saves empty cart', () => {
    const cart: CartState = { items: [] };
    saveCart(cart);
    const saved = localStorageMock.getItem('cart:v1');
    expect(saved).toBe(JSON.stringify(cart));
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('Storage error');
    };
    const cart: CartState = {
      items: [{ id: '1', name: 'Product 1', price: 10, quantity: 1 }],
    };
    // Should not throw
    expect(() => saveCart(cart)).not.toThrow();
    localStorageMock.setItem = originalSetItem;
  });
});

describe('getTotalItems', () => {
  test('returns 0 for empty cart', () => {
    const state: CartState = { items: [] };
    expect(getTotalItems(state)).toBe(0);
  });

  test('returns correct total for single item', () => {
    const state: CartState = {
      items: [{ id: '1', name: 'Product 1', price: 10, quantity: 3 }],
    };
    expect(getTotalItems(state)).toBe(3);
  });

  test('returns correct total for multiple items', () => {
    const state: CartState = {
      items: [
        { id: '1', name: 'Product 1', price: 10, quantity: 2 },
        { id: '2', name: 'Product 2', price: 20, quantity: 3 },
        { id: '3', name: 'Product 3', price: 30, quantity: 1 },
      ],
    };
    expect(getTotalItems(state)).toBe(6);
  });
});

describe('getSubtotal', () => {
  test('returns 0 for empty cart', () => {
    const state: CartState = { items: [] };
    expect(getSubtotal(state)).toBe(0);
  });

  test('returns correct subtotal for single item', () => {
    const state: CartState = {
      items: [{ id: '1', name: 'Product 1', price: 10, quantity: 3 }],
    };
    expect(getSubtotal(state)).toBe(30);
  });

  test('returns correct subtotal for multiple items', () => {
    const state: CartState = {
      items: [
        { id: '1', name: 'Product 1', price: 10, quantity: 2 }, // 20
        { id: '2', name: 'Product 2', price: 20, quantity: 3 }, // 60
        { id: '3', name: 'Product 3', price: 30, quantity: 1 }, // 30
      ],
    };
    expect(getSubtotal(state)).toBe(110);
  });

  test('handles decimal prices correctly', () => {
    const state: CartState = {
      items: [
        { id: '1', name: 'Product 1', price: 9.99, quantity: 2 },
        { id: '2', name: 'Product 2', price: 19.99, quantity: 1 },
      ],
    };
    expect(getSubtotal(state)).toBeCloseTo(39.97, 2);
  });
});
