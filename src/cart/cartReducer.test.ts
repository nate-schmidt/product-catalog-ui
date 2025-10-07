// src/cart/cartReducer.test.ts
import { describe, test, expect } from 'bun:test';
import { cartReducer, getCartTotals } from './cartReducer';
import type { CartState } from '../types/catalog';

const initialState: CartState = {
  items: [],
  version: 'v1',
};

describe('cartReducer', () => {
  test('adds new item to cart', () => {
    const state = cartReducer(initialState, {
      type: 'addItem',
      item: { productId: 'prod-1', quantity: 2, unitPriceCents: 1000 },
    });
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('prod-1');
    expect(state.items[0].quantity).toBe(2);
    expect(state.items[0].unitPriceCents).toBe(1000);
  });
  
  test('increments quantity when adding existing item', () => {
    const stateWithItem: CartState = {
      items: [{ productId: 'prod-1', quantity: 2, unitPriceCents: 1000 }],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItem, {
      type: 'addItem',
      item: { productId: 'prod-1', quantity: 3, unitPriceCents: 1000 },
    });
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5); // 2 + 3
  });
  
  test('handles variants separately', () => {
    const stateWithItem: CartState = {
      items: [{ productId: 'prod-1', quantity: 2, unitPriceCents: 1000 }],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItem, {
      type: 'addItem',
      item: { productId: 'prod-1', variantId: 'var-1', quantity: 1, unitPriceCents: 1200 },
    });
    
    expect(state.items).toHaveLength(2);
    expect(state.items[0].variantId).toBeUndefined();
    expect(state.items[1].variantId).toBe('var-1');
  });
  
  test('removes item from cart', () => {
    const stateWithItems: CartState = {
      items: [
        { productId: 'prod-1', quantity: 2, unitPriceCents: 1000 },
        { productId: 'prod-2', quantity: 1, unitPriceCents: 2000 },
      ],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItems, {
      type: 'removeItem',
      productId: 'prod-1',
    });
    
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('prod-2');
  });
  
  test('sets quantity directly', () => {
    const stateWithItem: CartState = {
      items: [{ productId: 'prod-1', quantity: 2, unitPriceCents: 1000 }],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItem, {
      type: 'setQuantity',
      productId: 'prod-1',
      quantity: 5,
    });
    
    expect(state.items[0].quantity).toBe(5);
  });
  
  test('removes item when quantity set to 0', () => {
    const stateWithItem: CartState = {
      items: [{ productId: 'prod-1', quantity: 2, unitPriceCents: 1000 }],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItem, {
      type: 'setQuantity',
      productId: 'prod-1',
      quantity: 0,
    });
    
    expect(state.items).toHaveLength(0);
  });
  
  test('clears all items', () => {
    const stateWithItems: CartState = {
      items: [
        { productId: 'prod-1', quantity: 2, unitPriceCents: 1000 },
        { productId: 'prod-2', quantity: 1, unitPriceCents: 2000 },
      ],
      version: 'v1',
    };
    
    const state = cartReducer(stateWithItems, {
      type: 'clear',
    });
    
    expect(state.items).toHaveLength(0);
  });
});

describe('getCartTotals', () => {
  test('calculates subtotal correctly', () => {
    const state: CartState = {
      items: [
        { productId: 'prod-1', quantity: 2, unitPriceCents: 1000 },
        { productId: 'prod-2', quantity: 3, unitPriceCents: 1500 },
      ],
      version: 'v1',
    };
    
    const totals = getCartTotals(state);
    
    expect(totals.subtotalCents).toBe(6500); // (2 * 1000) + (3 * 1500)
    expect(totals.itemCount).toBe(5); // 2 + 3
  });
  
  test('returns zero for empty cart', () => {
    const totals = getCartTotals(initialState);
    
    expect(totals.subtotalCents).toBe(0);
    expect(totals.itemCount).toBe(0);
  });
});

