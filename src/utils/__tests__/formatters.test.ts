import { test, expect, describe } from 'bun:test';
import {
  formatCurrency,
  formatTimestamp,
  formatDimensions,
  formatWeight,
  truncateText,
  isInStock,
  getStockStatus
} from '../formatters';

describe('formatCurrency', () => {
  test('formats USD currency correctly', () => {
    expect(formatCurrency(99.99, 'USD')).toBe('$99.99');
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  test('formats EUR currency correctly', () => {
    expect(formatCurrency(99.99, 'EUR')).toBe('€99.99');
  });

  test('defaults to USD when no currency provided', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
  });

  test('handles negative values', () => {
    expect(formatCurrency(-10.50, 'USD')).toBe('-$10.50');
  });

  test('handles very large numbers', () => {
    expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
  });
});

describe('formatTimestamp', () => {
  test('formats timestamp to Pacific Time', () => {
    const timestamp = '2024-01-15T10:30:00Z';
    const formatted = formatTimestamp(timestamp);
    
    // Should contain expected components (exact format may vary by system)
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
    expect(formatted).toMatch(/\d{1,2}:\d{2}/); // Time format
  });

  test('handles different timestamp formats', () => {
    const timestamp1 = '2024-12-25T15:45:30.000Z';
    const timestamp2 = '2024-12-25T15:45:30Z';
    
    const formatted1 = formatTimestamp(timestamp1);
    const formatted2 = formatTimestamp(timestamp2);
    
    expect(formatted1).toBeDefined();
    expect(formatted2).toBeDefined();
    expect(typeof formatted1).toBe('string');
    expect(typeof formatted2).toBe('string');
  });
});

describe('formatDimensions', () => {
  test('formats dimensions correctly', () => {
    const dimensions = { width: 10, height: 20, depth: 5, unit: 'cm' };
    expect(formatDimensions(dimensions)).toBe('10 × 20 × 5 cm');
  });

  test('handles different units', () => {
    const dimensions = { width: 12, height: 24, depth: 6, unit: 'inches' };
    expect(formatDimensions(dimensions)).toBe('12 × 24 × 6 inches');
  });

  test('returns empty string for undefined dimensions', () => {
    expect(formatDimensions(undefined)).toBe('');
  });

  test('handles decimal values', () => {
    const dimensions = { width: 10.5, height: 20.25, depth: 5.75, unit: 'cm' };
    expect(formatDimensions(dimensions)).toBe('10.5 × 20.25 × 5.75 cm');
  });
});

describe('formatWeight', () => {
  test('formats weight correctly', () => {
    const weight = { value: 25.5, unit: 'kg' };
    expect(formatWeight(weight)).toBe('25.5 kg');
  });

  test('handles different units', () => {
    const weight = { value: 10, unit: 'lbs' };
    expect(formatWeight(weight)).toBe('10 lbs');
  });

  test('returns empty string for undefined weight', () => {
    expect(formatWeight(undefined)).toBe('');
  });

  test('handles whole numbers', () => {
    const weight = { value: 15, unit: 'kg' };
    expect(formatWeight(weight)).toBe('15 kg');
  });
});

describe('truncateText', () => {
  test('truncates text longer than maxLength', () => {
    const text = 'This is a very long text that should be truncated';
    expect(truncateText(text, 20)).toBe('This is a very lo...');
  });

  test('returns original text if shorter than maxLength', () => {
    const text = 'Short text';
    expect(truncateText(text, 20)).toBe('Short text');
  });

  test('returns original text if exactly maxLength', () => {
    const text = '12345';
    expect(truncateText(text, 5)).toBe('12345');
  });

  test('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  test('handles very short maxLength', () => {
    const text = 'Hello World';
    expect(truncateText(text, 3)).toBe('...');
  });

  test('handles maxLength of 0', () => {
    const text = 'Hello';
    expect(truncateText(text, 0)).toBe('...');
  });
});

describe('isInStock', () => {
  test('returns true for positive stock', () => {
    expect(isInStock(1)).toBe(true);
    expect(isInStock(10)).toBe(true);
    expect(isInStock(100)).toBe(true);
  });

  test('returns false for zero stock', () => {
    expect(isInStock(0)).toBe(false);
  });

  test('returns false for negative stock', () => {
    expect(isInStock(-1)).toBe(false);
    expect(isInStock(-10)).toBe(false);
  });
});

describe('getStockStatus', () => {
  test('returns "Out of stock" for zero stock', () => {
    expect(getStockStatus(0)).toBe('Out of stock');
  });

  test('returns "Low stock" for stock <= 5', () => {
    expect(getStockStatus(1)).toBe('Low stock');
    expect(getStockStatus(3)).toBe('Low stock');
    expect(getStockStatus(5)).toBe('Low stock');
  });

  test('returns "In stock" for stock > 5', () => {
    expect(getStockStatus(6)).toBe('In stock');
    expect(getStockStatus(10)).toBe('In stock');
    expect(getStockStatus(100)).toBe('In stock');
  });

  test('handles negative stock as out of stock', () => {
    expect(getStockStatus(-1)).toBe('Out of stock');
    expect(getStockStatus(-10)).toBe('Out of stock');
  });
});