import { describe, test, expect } from 'bun:test';
import {
  validateProduct,
  validateCartItem,
  validateQuantity,
  validatePrice,
  formatPrice,
  sanitizeSearchQuery,
  validateEmail,
} from '../../utils/validation';
import { createMockProduct, createMockCartItem } from './test-helpers';

describe('validation utils', () => {
  describe('validateProduct', () => {
    test('returns true for valid product', () => {
      const product = createMockProduct();
      expect(validateProduct(product)).toBe(true);
    });

    test('returns false for null or undefined', () => {
      expect(validateProduct(null)).toBe(false);
      expect(validateProduct(undefined)).toBe(false);
    });

    test('returns false for non-object', () => {
      expect(validateProduct('string')).toBe(false);
      expect(validateProduct(123)).toBe(false);
      expect(validateProduct([])).toBe(false);
    });

    test('returns false when required fields are missing', () => {
      const invalidProducts = [
        { name: 'Test', price: 10 }, // missing id, description, image, category, inStock
        { id: '1', name: 'Test' }, // missing other fields
        { id: '1', name: 'Test', price: 10, description: 'desc', image: 'img.jpg' }, // missing category and inStock
      ];

      invalidProducts.forEach(product => {
        expect(validateProduct(product)).toBe(false);
      });
    });

    test('returns false when field types are incorrect', () => {
      const invalidProducts = [
        createMockProduct({ id: 123 as any }), // id should be string
        createMockProduct({ name: 123 as any }), // name should be string
        createMockProduct({ price: 'expensive' as any }), // price should be number
        createMockProduct({ description: 123 as any }), // description should be string
        createMockProduct({ image: 123 as any }), // image should be string
        createMockProduct({ category: 123 as any }), // category should be string
        createMockProduct({ inStock: 'yes' as any }), // inStock should be boolean
      ];

      invalidProducts.forEach(product => {
        expect(validateProduct(product)).toBe(false);
      });
    });

    test('returns false for negative price', () => {
      const product = createMockProduct({ price: -10 });
      expect(validateProduct(product)).toBe(false);
    });

    test('allows optional fields to be undefined', () => {
      const product = createMockProduct();
      delete (product as any).rating;
      delete (product as any).reviewCount;
      expect(validateProduct(product)).toBe(true);
    });
  });

  describe('validateCartItem', () => {
    test('returns true for valid cart item', () => {
      const cartItem = createMockCartItem();
      expect(validateCartItem(cartItem)).toBe(true);
    });

    test('returns false for null or undefined', () => {
      expect(validateCartItem(null)).toBe(false);
      expect(validateCartItem(undefined)).toBe(false);
    });

    test('returns false for non-object', () => {
      expect(validateCartItem('string')).toBe(false);
      expect(validateCartItem(123)).toBe(false);
    });

    test('returns false when fields are missing or invalid', () => {
      const invalidItems = [
        { product: createMockProduct(), quantity: 1 }, // missing id
        { id: '1', quantity: 1 }, // missing product
        { id: '1', product: createMockProduct() }, // missing quantity
        { id: 123, product: createMockProduct(), quantity: 1 }, // invalid id type
        { id: '1', product: 'invalid', quantity: 1 }, // invalid product
        { id: '1', product: createMockProduct(), quantity: 'one' }, // invalid quantity type
        { id: '1', product: createMockProduct(), quantity: 0 }, // invalid quantity value
        { id: '1', product: createMockProduct(), quantity: 1.5 }, // non-integer quantity
      ];

      invalidItems.forEach(item => {
        expect(validateCartItem(item)).toBe(false);
      });
    });
  });

  describe('validateQuantity', () => {
    test('returns true for valid quantities', () => {
      expect(validateQuantity(1)).toBe(true);
      expect(validateQuantity(50)).toBe(true);
      expect(validateQuantity(99)).toBe(true);
    });

    test('returns false for invalid quantities', () => {
      expect(validateQuantity(0)).toBe(false);
      expect(validateQuantity(-1)).toBe(false);
      expect(validateQuantity(100)).toBe(false);
      expect(validateQuantity(1.5)).toBe(false);
      expect(validateQuantity('5' as any)).toBe(false);
      expect(validateQuantity(NaN)).toBe(false);
      expect(validateQuantity(Infinity)).toBe(false);
    });
  });

  describe('validatePrice', () => {
    test('returns true for valid prices', () => {
      expect(validatePrice(0)).toBe(true);
      expect(validatePrice(0.01)).toBe(true);
      expect(validatePrice(29.99)).toBe(true);
      expect(validatePrice(1000)).toBe(true);
    });

    test('returns false for invalid prices', () => {
      expect(validatePrice(-1)).toBe(false);
      expect(validatePrice('29.99' as any)).toBe(false);
      expect(validatePrice(NaN)).toBe(false);
      expect(validatePrice(Infinity)).toBe(false);
      expect(validatePrice(-Infinity)).toBe(false);
    });
  });

  describe('formatPrice', () => {
    test('formats valid prices correctly', () => {
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(1)).toBe('$1.00');
      expect(formatPrice(29.99)).toBe('$29.99');
      expect(formatPrice(1000)).toBe('$1,000.00');
      expect(formatPrice(0.5)).toBe('$0.50');
    });

    test('returns $0.00 for invalid prices', () => {
      expect(formatPrice(-1)).toBe('$0.00');
      expect(formatPrice(NaN)).toBe('$0.00');
      expect(formatPrice(Infinity)).toBe('$0.00');
      expect(formatPrice('invalid' as any)).toBe('$0.00');
    });
  });

  describe('sanitizeSearchQuery', () => {
    test('sanitizes search queries correctly', () => {
      expect(sanitizeSearchQuery('  Hello World  ')).toBe('hello world');
      expect(sanitizeSearchQuery('iPhone-12')).toBe('iphone-12');
      expect(sanitizeSearchQuery('Search term with spaces')).toBe('search term with spaces');
      expect(sanitizeSearchQuery('T-shirt & jeans')).toBe('t-shirt  jeans');
      expect(sanitizeSearchQuery('Product@#$%^&*()')).toBe('product');
    });

    test('handles edge cases', () => {
      expect(sanitizeSearchQuery('')).toBe('');
      expect(sanitizeSearchQuery('   ')).toBe('');
      expect(sanitizeSearchQuery('123')).toBe('123');
      expect(sanitizeSearchQuery('!@#$%^&*()')).toBe('');
      expect(sanitizeSearchQuery(null as any)).toBe('');
      expect(sanitizeSearchQuery(undefined as any)).toBe('');
      expect(sanitizeSearchQuery(123 as any)).toBe('');
    });
  });

  describe('validateEmail', () => {
    test('returns true for valid emails', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@example.com',
        'user123@example123.com',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    test('returns false for invalid emails', () => {
      const invalidEmails = [
        '',
        'user',
        'user@',
        '@example.com',
        'user..email@example.com',
        'user@example',
        'user @example.com',
        'user@example .com',
        null as any,
        undefined as any,
        123 as any,
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
});