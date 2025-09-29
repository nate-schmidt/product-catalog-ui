import { test, expect, describe, beforeEach, vi } from 'bun:test';
import { productApi } from './productApi';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('productApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProducts', () => {
    test('returns data from API when available', async () => {
      const mockProducts = [
        { id: '1', name: 'API Product 1', price: 100, inStock: true },
        { id: '2', name: 'API Product 2', price: 200, inStock: false }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      });

      const result = await productApi.getAllProducts();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products');
      expect(result).toEqual(mockProducts);
    });

    test('falls back to mock data when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getAllProducts();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('price');
    });

    test('falls back to mock data when API returns non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500
      });

      const result = await productApi.getAllProducts();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('mock data includes expected furniture products', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getAllProducts();

      // Check for expected mock products
      expect(result.some(p => p.name === 'Modern Leather Sofa')).toBe(true);
      expect(result.some(p => p.name === 'Oak Dining Table')).toBe(true);
      expect(result.some(p => p.category === 'Furniture')).toBe(true);
      expect(result.some(p => p.material === 'Genuine Leather')).toBe(true);
    });
  });

  describe('getProductById', () => {
    test('returns product from API when available', async () => {
      const mockProduct = { id: '1', name: 'API Product', price: 100, inStock: true };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      });

      const result = await productApi.getProductById('1');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products/1');
      expect(result).toEqual(mockProduct);
    });

    test('returns mock product when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getProductById('1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Modern Leather Sofa');
    });

    test('returns null when product not found in mock data', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getProductById('999');

      expect(result).toBeNull();
    });
  });

  describe('getProductsByCategory', () => {
    test('returns filtered products from API when available', async () => {
      const mockProducts = [
        { id: '1', name: 'Furniture Item', category: 'Furniture', price: 100, inStock: true },
        { id: '2', name: 'Office Item', category: 'Office', price: 200, inStock: true }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      });

      const result = await productApi.getProductsByCategory('Furniture');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products?category=Furniture');
      expect(result).toEqual(mockProducts);
    });

    test('filters mock data by category when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getProductsByCategory('Office');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(p => p.category?.toLowerCase() === 'office')).toBe(true);
    });

    test('handles case insensitive category matching', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getProductsByCategory('furniture');

      expect(result.some(p => p.category === 'Furniture')).toBe(true);
    });

    test('returns empty array for non-existent category', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getProductsByCategory('NonExistent');

      expect(result).toEqual([]);
    });
  });

  describe('searchProducts', () => {
    test('returns search results from API when available', async () => {
      const mockResults = [
        { id: '1', name: 'Leather Sofa', description: 'Comfortable sofa', price: 100, inStock: true }
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResults)
      });

      const result = await productApi.searchProducts('leather');

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products/search?q=leather');
      expect(result).toEqual(mockResults);
    });

    test('searches mock data when API fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.searchProducts('sofa');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(p => p.name.toLowerCase().includes('sofa'))).toBe(true);
    });

    test('searches by name, description, and category', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Search by name
      const nameResults = await productApi.searchProducts('leather');
      expect(nameResults.some(p => p.name.toLowerCase().includes('leather'))).toBe(true);

      // Search by description
      const descResults = await productApi.searchProducts('adjustable');
      expect(descResults.some(p => p.description.toLowerCase().includes('adjustable'))).toBe(true);

      // Search by category
      const categoryResults = await productApi.searchProducts('office');
      expect(categoryResults.some(p => p.category?.toLowerCase().includes('office'))).toBe(true);
    });

    test('handles URL encoding of search query', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await productApi.searchProducts('test & query');

      // When it tries the API first, it should encode the query
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/api/products/search?q=test%20%26%20query');
    });

    test('returns empty array for no matches', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.searchProducts('nonexistentproduct');

      expect(result).toEqual([]);
    });

    test('search is case insensitive', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const lowerResult = await productApi.searchProducts('leather');
      const upperResult = await productApi.searchProducts('LEATHER');

      expect(lowerResult).toEqual(upperResult);
    });
  });

  describe('delay simulation', () => {
    test('includes delay when using mock data', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const startTime = Date.now();
      await productApi.getAllProducts();
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(500); // Default delay is 500ms
    });
  });

  describe('error handling', () => {
    test('handles network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await productApi.getAllProducts();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('handles API server errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await productApi.getAllProducts();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});