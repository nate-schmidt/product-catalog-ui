import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { productApi } from './api';

// Mock fetch globally
const mockFetch = mock(() => Promise.resolve({
  ok: true,
  json: async () => [],
} as Response));

(global as any).fetch = mockFetch;

describe('productApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getAllProducts', () => {
    test('fetches products successfully', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 10,
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price: 20,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      const result = await productApi.getAllProducts();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
      });
      expect(result[1]).toEqual({
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
      });
    });

    test('maps backend DTO to frontend Product correctly', async () => {
      const mockDTO = {
        id: 123,
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Electronics',
        stock: 10,
        inStock: true,
        imageUrl: 'https://example.com/image.jpg',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockDTO],
      } as Response);

      const result = await productApi.getAllProducts();

      expect(result[0]).toEqual({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category: 'Electronics',
        stock: 10,
        inStock: true,
        imageUrl: 'https://example.com/image.jpg',
      });
    });

    test('handles inStock calculation when not provided', async () => {
      const mockDTO = {
        id: 1,
        name: 'Product',
        description: 'Description',
        price: 10,
        stock: 5,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockDTO],
      } as Response);

      const result = await productApi.getAllProducts();

      expect(result[0].inStock).toBe(true);
    });

    test('sets inStock to false when stock is 0', async () => {
      const mockDTO = {
        id: 1,
        name: 'Product',
        description: 'Description',
        price: 10,
        stock: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockDTO],
      } as Response);

      const result = await productApi.getAllProducts();

      expect(result[0].inStock).toBe(false);
    });

    test('throws error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(productApi.getAllProducts()).rejects.toThrow();
    });

    test('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(productApi.getAllProducts()).rejects.toThrow('Network error');
    });

    test('calls correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await productApi.getAllProducts();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('getProductById', () => {
    test('fetches single product successfully', async () => {
      const mockProduct = {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      } as Response);

      const result = await productApi.getProductById('1');

      expect(result).toEqual({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
      });
    });

    test('calls correct endpoint with product ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'Product', description: 'Desc', price: 10 }),
      } as Response);

      await productApi.getProductById('123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/products/123',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('throws error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(productApi.getProductById('999')).rejects.toThrow();
    });
  });

  describe('searchProducts', () => {
    test('searches products with category filter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await productApi.searchProducts({ category: 'Electronics' });

      const call = mockFetch.mock.calls[0][0] as string;
      expect(call).toContain('/api/products/search');
      expect(call).toContain('category=Electronics');
    });

    test('searches products with multiple filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await productApi.searchProducts({
        category: 'Electronics',
        minPrice: 10,
        maxPrice: 100,
        inStock: true,
      });

      const call = mockFetch.mock.calls[0][0] as string;
      expect(call).toContain('category=Electronics');
      expect(call).toContain('minPrice=10');
      expect(call).toContain('maxPrice=100');
      expect(call).toContain('inStock=true');
    });

    test('handles empty filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      await productApi.searchProducts({});

      expect(mockFetch).toHaveBeenCalled();
      const call = mockFetch.mock.calls[0][0] as string;
      expect(call).toContain('/api/products/search');
    });

    test('maps search results correctly', async () => {
      const mockResults = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 10,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      } as Response);

      const result = await productApi.searchProducts({ category: 'Electronics' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('throws error on search failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response);

      await expect(productApi.searchProducts({ category: 'Invalid' })).rejects.toThrow();
    });
  });
});
