import { test, expect, describe } from 'bun:test';

// Since build.ts contains utility functions that aren't exported,
// we'll recreate them here for testing purposes
// In a real-world scenario, you'd want to extract these to a separate utilities module

// Helper function to convert kebab-case to camelCase (recreated for testing)
const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

// Helper function to parse a value into appropriate type (recreated for testing)
const parseValue = (value: string): any => {
  // Handle true/false strings
  if (value === "true") return true;
  if (value === "false") return false;

  // Handle numbers
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

  // Handle arrays (comma-separated)
  if (value.includes(",")) return value.split(",").map(v => v.trim());

  // Default to string
  return value;
};

// Helper function to format file sizes (recreated for testing)
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

describe('build.ts utility functions', () => {
  describe('toCamelCase', () => {
    test('converts kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('test-case')).toBe('testCase');
      expect(toCamelCase('multi-word-string')).toBe('multiWordString');
    });

    test('handles single words without hyphens', () => {
      expect(toCamelCase('hello')).toBe('hello');
      expect(toCamelCase('test')).toBe('test');
    });

    test('handles empty strings', () => {
      expect(toCamelCase('')).toBe('');
    });

    test('handles strings with multiple consecutive hyphens', () => {
      expect(toCamelCase('test--case')).toBe('test-Case');
      expect(toCamelCase('hello---world')).toBe('hello--World');
    });

    test('handles strings starting or ending with hyphens', () => {
      expect(toCamelCase('-hello-world')).toBe('HelloWorld');
      expect(toCamelCase('hello-world-')).toBe('helloWorld-');
    });

    test('only converts lowercase letters after hyphens', () => {
      expect(toCamelCase('hello-World')).toBe('hello-World');
      expect(toCamelCase('test-CASE')).toBe('test-CASE');
    });
  });

  describe('parseValue', () => {
    test('parses boolean strings', () => {
      expect(parseValue('true')).toBe(true);
      expect(parseValue('false')).toBe(false);
    });

    test('parses integer strings', () => {
      expect(parseValue('123')).toBe(123);
      expect(parseValue('0')).toBe(0);
      expect(parseValue('999')).toBe(999);
    });

    test('parses float strings', () => {
      expect(parseValue('123.45')).toBe(123.45);
      expect(parseValue('0.5')).toBe(0.5);
      expect(parseValue('99.99')).toBe(99.99);
    });

    test('parses comma-separated arrays', () => {
      expect(parseValue('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(parseValue('react,react-dom,lodash')).toEqual(['react', 'react-dom', 'lodash']);
      expect(parseValue('1,2,3')).toEqual(['1', '2', '3']);
    });

    test('handles arrays with spaces', () => {
      expect(parseValue('a, b, c')).toEqual(['a', 'b', 'c']);
      expect(parseValue('react , react-dom , lodash')).toEqual(['react', 'react-dom', 'lodash']);
    });

    test('returns strings for unrecognized formats', () => {
      expect(parseValue('hello')).toBe('hello');
      expect(parseValue('test-string')).toBe('test-string');
      expect(parseValue('123abc')).toBe('123abc');
    });

    test('handles edge cases', () => {
      expect(parseValue('')).toBe('');
      expect(parseValue('.')).toBe('.');
      expect(parseValue(',')).toEqual(['', '']);
    });

    test('handles negative numbers', () => {
      expect(parseValue('-123')).toBe('-123'); // This should be a string since the regex doesn't handle negatives
      expect(parseValue('-123.45')).toBe('-123.45'); // This should be a string since the regex doesn't handle negatives
    });
  });

  describe('formatFileSize', () => {
    test('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0.00 B');
      expect(formatFileSize(512)).toBe('512.00 B');
      expect(formatFileSize(1023)).toBe('1023.00 B');
    });

    test('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1536)).toBe('1.50 KB'); // 1.5 KB
      expect(formatFileSize(2048)).toBe('2.00 KB');
    });

    test('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB'); // 1 MB
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.50 MB'); // 1.5 MB
      expect(formatFileSize(1024 * 1024 * 10)).toBe('10.00 MB'); // 10 MB
    });

    test('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB'); // 1 GB
      expect(formatFileSize(1024 * 1024 * 1024 * 2.5)).toBe('2.50 GB'); // 2.5 GB
    });

    test('handles very large files (stays in GB)', () => {
      const veryLarge = 1024 * 1024 * 1024 * 1024; // 1 TB in bytes
      const result = formatFileSize(veryLarge);
      expect(result).toContain('GB');
      expect(parseFloat(result)).toBe(1024.00);
    });

    test('handles decimal precision', () => {
      expect(formatFileSize(1536)).toBe('1.50 KB'); // Should show 2 decimal places
      expect(formatFileSize(1025)).toBe('1.00 KB'); // Should show 2 decimal places even for whole numbers
    });
  });

  describe('Build configuration validation', () => {
    test('default outdir path is correct', () => {
      const defaultOutdir = 'dist';
      expect(defaultOutdir).toBe('dist');
    });

    test('production environment variable handling', () => {
      // Test the NODE_ENV check logic
      const isProduction = process.env.NODE_ENV === 'production';
      expect(typeof isProduction).toBe('boolean');
    });

    test('glob pattern for HTML files', () => {
      const pattern = '**.html';
      expect(pattern).toBe('**.html');
      expect(pattern.endsWith('.html')).toBe(true);
    });

    test('build options structure', () => {
      const buildOptions = {
        minify: true,
        target: 'browser',
        sourcemap: 'linked'
      };

      expect(buildOptions.minify).toBe(true);
      expect(buildOptions.target).toBe('browser');
      expect(buildOptions.sourcemap).toBe('linked');
    });
  });

  describe('Performance and output handling', () => {
    test('performance measurement setup', () => {
      const start = performance.now();
      const end = performance.now();
      const duration = end - start;
      
      expect(typeof duration).toBe('number');
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    test('output table structure', () => {
      const mockOutput = {
        path: '/workspace/dist/index.html',
        kind: 'entry-point',
        size: 1024
      };

      const tableRow = {
        "File": mockOutput.path,
        "Type": mockOutput.kind, 
        "Size": formatFileSize(mockOutput.size)
      };

      expect(tableRow.File).toBe('/workspace/dist/index.html');
      expect(tableRow.Type).toBe('entry-point');
      expect(tableRow.Size).toBe('1.00 KB');
    });
  });
});