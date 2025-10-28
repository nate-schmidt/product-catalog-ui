// src/utils/money.test.ts
import { describe, test, expect } from 'bun:test';
import { formatMoney } from './money';

describe('formatMoney', () => {
  test('formats USD correctly', () => {
    expect(formatMoney(1999, 'USD')).toBe('$19.99');
    expect(formatMoney(10000, 'USD')).toBe('$100.00');
    expect(formatMoney(1, 'USD')).toBe('$0.01');
    expect(formatMoney(999999, 'USD')).toBe('$9999.99');
  });
  
  test('formats EUR correctly', () => {
    expect(formatMoney(2499, 'EUR')).toBe('€24.99');
    expect(formatMoney(5000, 'EUR')).toBe('€50.00');
  });
  
  test('handles zero', () => {
    expect(formatMoney(0, 'USD')).toBe('$0.00');
  });
  
  test('pads cents correctly', () => {
    expect(formatMoney(105, 'USD')).toBe('$1.05');
    expect(formatMoney(1001, 'USD')).toBe('$10.01');
  });
  
  test('defaults to USD', () => {
    expect(formatMoney(2999)).toBe('$29.99');
  });
});

