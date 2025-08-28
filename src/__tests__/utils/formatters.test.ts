/**
 * Comprehensive test suite for formatter utilities
 * Note: These utilities don't exist yet, but this demonstrates testing patterns
 */

import { test, expect, describe } from 'bun:test';

// Mock formatter utilities
const MockFormatters = {
  formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatDate(date: Date | string, locale = 'en-US'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  },

  formatNumber(num: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(num);
  },

  formatPercentage(decimal: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(decimal);
  },

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },

  capitalizeFirst(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    test('formats USD currency by default', () => {
      expect(MockFormatters.formatCurrency(99.99)).toBe('$99.99');
      expect(MockFormatters.formatCurrency(1000)).toBe('$1,000.00');
      expect(MockFormatters.formatCurrency(0)).toBe('$0.00');
    });

    test('formats different currencies', () => {
      expect(MockFormatters.formatCurrency(99.99, 'EUR')).toBe('€99.99');
      expect(MockFormatters.formatCurrency(99.99, 'GBP')).toBe('£99.99');
    });

    test('formats with different locales', () => {
      expect(MockFormatters.formatCurrency(1234.56, 'USD', 'de-DE')).toBe('1.234,56 $');
    });

    test('handles negative amounts', () => {
      expect(MockFormatters.formatCurrency(-50.25)).toBe('-$50.25');
    });

    test('handles zero and decimal amounts', () => {
      expect(MockFormatters.formatCurrency(0.01)).toBe('$0.01');
      expect(MockFormatters.formatCurrency(0.99)).toBe('$0.99');
    });

    test('handles large amounts', () => {
      expect(MockFormatters.formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatDate', () => {
    test('formats Date objects', () => {
      const date = new Date('2024-01-15');
      const formatted = MockFormatters.formatDate(date);
      expect(formatted).toBe('January 15, 2024');
    });

    test('formats date strings', () => {
      const formatted = MockFormatters.formatDate('2024-01-15');
      expect(formatted).toBe('January 15, 2024');
    });

    test('formats with different locales', () => {
      const date = new Date('2024-01-15');
      const formatted = MockFormatters.formatDate(date, 'es-ES');
      expect(formatted).toBe('15 de enero de 2024');
    });

    test('handles invalid dates gracefully', () => {
      expect(() => MockFormatters.formatDate('invalid-date')).toThrow();
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with thousands separators', () => {
      expect(MockFormatters.formatNumber(1234)).toBe('1,234');
      expect(MockFormatters.formatNumber(1234567)).toBe('1,234,567');
    });

    test('formats decimal numbers', () => {
      expect(MockFormatters.formatNumber(1234.56)).toBe('1,234.56');
    });

    test('handles zero and negative numbers', () => {
      expect(MockFormatters.formatNumber(0)).toBe('0');
      expect(MockFormatters.formatNumber(-1234)).toBe('-1,234');
    });
  });

  describe('formatPercentage', () => {
    test('formats decimal as percentage', () => {
      expect(MockFormatters.formatPercentage(0.1234)).toBe('12.34%');
      expect(MockFormatters.formatPercentage(0.5)).toBe('50%');
      expect(MockFormatters.formatPercentage(1)).toBe('100%');
    });

    test('handles edge cases', () => {
      expect(MockFormatters.formatPercentage(0)).toBe('0%');
      expect(MockFormatters.formatPercentage(0.001)).toBe('0.1%');
    });
  });

  describe('truncateText', () => {
    test('truncates text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      expect(MockFormatters.truncateText(text, 20)).toBe('This is a very lo...');
    });

    test('returns original text if shorter than max length', () => {
      const text = 'Short text';
      expect(MockFormatters.truncateText(text, 20)).toBe('Short text');
    });

    test('handles exact length match', () => {
      const text = 'Exactly twenty chars';
      expect(MockFormatters.truncateText(text, 20)).toBe('Exactly twenty chars');
    });

    test('handles empty string', () => {
      expect(MockFormatters.truncateText('', 10)).toBe('');
    });

    test('handles very short max length', () => {
      expect(MockFormatters.truncateText('Hello World', 5)).toBe('He...');
    });
  });

  describe('capitalizeFirst', () => {
    test('capitalizes first letter of lowercase text', () => {
      expect(MockFormatters.capitalizeFirst('hello world')).toBe('Hello world');
    });

    test('handles already capitalized text', () => {
      expect(MockFormatters.capitalizeFirst('Hello World')).toBe('Hello world');
    });

    test('handles empty string', () => {
      expect(MockFormatters.capitalizeFirst('')).toBe('');
    });

    test('handles single character', () => {
      expect(MockFormatters.capitalizeFirst('a')).toBe('A');
      expect(MockFormatters.capitalizeFirst('A')).toBe('A');
    });

    test('handles mixed case', () => {
      expect(MockFormatters.capitalizeFirst('hELLO wORLD')).toBe('Hello world');
    });
  });

  describe('formatPhoneNumber', () => {
    test('formats 10-digit phone numbers', () => {
      expect(MockFormatters.formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    test('formats phone numbers with existing formatting', () => {
      expect(MockFormatters.formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
      expect(MockFormatters.formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    });

    test('returns original for invalid formats', () => {
      expect(MockFormatters.formatPhoneNumber('123')).toBe('123');
      expect(MockFormatters.formatPhoneNumber('12345678901')).toBe('12345678901');
    });

    test('handles phone numbers with country codes', () => {
      expect(MockFormatters.formatPhoneNumber('+1-123-456-7890')).toBe('11234567890');
    });
  });

  describe('slugify', () => {
    test('converts text to URL-friendly slug', () => {
      expect(MockFormatters.slugify('Hello World')).toBe('hello-world');
      expect(MockFormatters.slugify('Product Name Here')).toBe('product-name-here');
    });

    test('removes special characters', () => {
      expect(MockFormatters.slugify('Hello, World!')).toBe('hello-world');
      expect(MockFormatters.slugify('Product & Service')).toBe('product-service');
    });

    test('handles multiple spaces and hyphens', () => {
      expect(MockFormatters.slugify('Hello    World')).toBe('hello-world');
      expect(MockFormatters.slugify('Hello---World')).toBe('hello-world');
    });

    test('trims leading and trailing hyphens', () => {
      expect(MockFormatters.slugify('-Hello World-')).toBe('hello-world');
      expect(MockFormatters.slugify('---Hello World---')).toBe('hello-world');
    });

    test('handles empty string', () => {
      expect(MockFormatters.slugify('')).toBe('');
    });

    test('handles only special characters', () => {
      expect(MockFormatters.slugify('!@#$%^&*()')).toBe('');
    });
  });
});