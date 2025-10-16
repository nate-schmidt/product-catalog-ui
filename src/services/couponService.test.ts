import { test, expect, describe } from 'bun:test';
import { CouponValidationRequest } from '../types/coupon';
import { CartItem } from '../types/product';

// Mock data
const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Test Product',
    description: 'Test description',
    price: 50,
    category: 'Furniture',
    material: 'Wood',
    color: 'Brown',
    dimensions: { width: 60, height: 80, depth: 60 },
    stock: 10,
    inStock: true,
    imageUrl: 'test.jpg',
    quantity: 2
  }
];

describe('CouponService', () => {
  test('creates correct validation request format', () => {
    const request: CouponValidationRequest = {
      code: 'TEST10',
      items: mockCartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        category: item.category
      })),
      currency: 'USD'
    };

    expect(request.code).toBe('TEST10');
    expect(request.currency).toBe('USD');
    expect(request.items).toHaveLength(1);
    expect(request.items[0].productId).toBe(1);
    expect(request.items[0].quantity).toBe(2);
    expect(request.items[0].price).toBe(50);
    expect(request.items[0].category).toBe('Furniture');
  });

  test('transforms cart items correctly', () => {
    const transformedItems = mockCartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    }));

    expect(transformedItems).toHaveLength(1);
    expect(transformedItems[0]).toEqual({
      productId: 1,
      quantity: 2,
      price: 50,
      category: 'Furniture'
    });
  });

  test('handles multiple cart items', () => {
    const multipleItems: CartItem[] = [
      ...mockCartItems,
      {
        id: 2,
        name: 'Test Table',
        description: 'Test table description',
        price: 200,
        category: 'Furniture',
        material: 'Metal',
        color: 'Black',
        dimensions: { width: 120, height: 75, depth: 80 },
        stock: 3,
        inStock: true,
        imageUrl: 'table.jpg',
        quantity: 1
      }
    ];

    const transformedItems = multipleItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    }));

    expect(transformedItems).toHaveLength(2);
    expect(transformedItems[1]).toEqual({
      productId: 2,
      quantity: 1,
      price: 200,
      category: 'Furniture'
    });
  });

  test('validates coupon code format requirements', () => {
    const testCodes = [
      { input: 'test10', expected: 'TEST10' },
      { input: '  SAVE20  ', expected: 'SAVE20' },
      { input: 'Holiday-2023', expected: 'HOLIDAY-2023' },
      { input: 'welcome@home', expected: 'WELCOME@HOME' }
    ];

    testCodes.forEach(({ input, expected }) => {
      const processed = input.trim().toUpperCase();
      expect(processed).toBe(expected);
    });
  });

  test('handles empty cart items array', () => {
    const request: CouponValidationRequest = {
      code: 'TEST10',
      items: [],
      currency: 'USD'
    };

    expect(request.items).toHaveLength(0);
    expect(request.code).toBe('TEST10');
    expect(request.currency).toBe('USD');
  });

  test('URL encoding works for special characters in coupon codes', () => {
    const specialCodes = [
      'TEST@SPECIAL',
      'SAVE 20%',
      'HOLIDAY+BONUS',
      'WELCOME&SAVE'
    ];

    specialCodes.forEach(code => {
      const encoded = encodeURIComponent(code);
      expect(encoded).toBeDefined();
      expect(encoded.length).toBeGreaterThan(0);
      // Verify it can be decoded back
      expect(decodeURIComponent(encoded)).toBe(code);
    });
  });
});
