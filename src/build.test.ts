import { test, expect, describe } from 'bun:test';

// Import utility functions from build.ts for testing
// Note: We'll need to extract these functions to make them testable

describe('Build Script Utilities', () => {
  describe('toCamelCase function', () => {
    // We need to extract this function from build.ts to test it
    const toCamelCase = (str: string): string => {
      return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
    };

    test('converts kebab-case to camelCase', () => {
      expect(toCamelCase('source-map')).toBe('sourceMap');
      expect(toCamelCase('public-path')).toBe('publicPath');
      expect(toCamelCase('minify-syntax')).toBe('minifySyntax');
    });

    test('handles single words without hyphens', () => {
      expect(toCamelCase('minify')).toBe('minify');
      expect(toCamelCase('target')).toBe('target');
    });

    test('handles multiple hyphens', () => {
      expect(toCamelCase('very-long-option-name')).toBe('veryLongOptionName');
    });

    test('handles empty string', () => {
      expect(toCamelCase('')).toBe('');
    });
  });

  describe('parseValue function', () => {
    // We need to extract this function from build.ts to test it
    const parseValue = (value: string): any => {
      if (value === "true") return true;
      if (value === "false") return false;
      if (/^\d+$/.test(value)) return parseInt(value, 10);
      if (/^\d*\.\d+$/.test(value)) return parseFloat(value);
      if (value.includes(",")) return value.split(",").map(v => v.trim());
      return value;
    };

    test('parses boolean strings correctly', () => {
      expect(parseValue('true')).toBe(true);
      expect(parseValue('false')).toBe(false);
    });

    test('parses integer strings correctly', () => {
      expect(parseValue('123')).toBe(123);
      expect(parseValue('0')).toBe(0);
    });

    test('parses float strings correctly', () => {
      expect(parseValue('123.45')).toBe(123.45);
      expect(parseValue('0.5')).toBe(0.5);
      expect(parseValue('.5')).toBe(0.5);
    });

    test('parses comma-separated arrays correctly', () => {
      expect(parseValue('react,react-dom')).toEqual(['react', 'react-dom']);
      expect(parseValue('a, b, c')).toEqual(['a', 'b', 'c']);
    });

    test('returns string for other values', () => {
      expect(parseValue('hello')).toBe('hello');
      expect(parseValue('some-string')).toBe('some-string');
    });

    test('handles edge cases', () => {
      expect(parseValue('')).toBe('');
      expect(parseValue('not-a-number')).toBe('not-a-number');
    });
  });

  describe('formatFileSize function', () => {
    // We need to extract this function from build.ts to test it
    const formatFileSize = (bytes: number): string => {
      const units = ["B", "KB", "MB", "GB"];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(2)} ${units[unitIndex]}`;
    };

    test('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500.00 B');
      expect(formatFileSize(1023)).toBe('1023.00 B');
    });

    test('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(2048)).toBe('2.00 KB');
      expect(formatFileSize(1536)).toBe('1.50 KB');
    });

    test('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.50 MB');
    });

    test('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 1.5)).toBe('1.50 GB');
    });

    test('handles zero bytes', () => {
      expect(formatFileSize(0)).toBe('0.00 B');
    });

    test('handles very large files', () => {
      const veryLarge = 1024 * 1024 * 1024 * 1024; // 1TB
      expect(formatFileSize(veryLarge)).toBe('1024.00 GB');
    });
  });

  describe('parseArgs function simulation', () => {
    test('should handle boolean flags', () => {
      // This tests the logic for parsing CLI arguments
      const mockArgs = ['--minify', '--splitting'];
      const config: Record<string, any> = {};
      
      // Simulate the parsing logic
      for (const arg of mockArgs) {
        if (arg.startsWith('--') && !arg.includes('=')) {
          const key = arg.slice(2);
          config[key] = true;
        }
      }
      
      expect(config.minify).toBe(true);
      expect(config.splitting).toBe(true);
    });

    test('should handle key-value pairs', () => {
      const mockArgs = ['--outdir=dist', '--target=browser'];
      const config: Record<string, any> = {};
      
      for (const arg of mockArgs) {
        if (arg.includes('=')) {
          const [key, value] = arg.slice(2).split('=', 2);
          config[key] = value;
        }
      }
      
      expect(config.outdir).toBe('dist');
      expect(config.target).toBe('browser');
    });

    test('should handle no-* flags', () => {
      const mockArgs = ['--no-minify', '--no-splitting'];
      const config: Record<string, any> = {};
      
      for (const arg of mockArgs) {
        if (arg.startsWith('--no-')) {
          const key = arg.slice(5);
          config[key] = false;
        }
      }
      
      expect(config.minify).toBe(false);
      expect(config.splitting).toBe(false);
    });
  });
});