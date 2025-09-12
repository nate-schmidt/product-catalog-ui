import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { apiClient } from '../client';
import { Product } from '../../types/Product';

// Mock fetch globally
const mockFetch = mock();
global.fetch = mockFetch;

// Sample product data for tests
const sampleProduct: Product = {
  id: 1,
  name: 'Test Chair',
  description: 'A comfortable test chair',
  price: 299.99,
  currency: 'USD',
  stockQuantity: 10,
  category: 'Furniture',
  imageUrl: 'https://example.com/chair.jpg',
  dimensions: { width: 60, height: 90, depth: 60, unit: 'cm' },
  weight: { value: 15, unit: 'kg' },
  material: 'Wood',
  color: 'Brown',
  brand: 'TestBrand',
  sku: 'TC001',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

const sampleProducts: Product[] = [sampleProduct, { ...sampleProduct, id: 2, name: 'Test Table' }];

describe('ApiClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('getProducts', () => {
    test('fetches products successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => sampleProducts,
      });

      const products = await apiClient.getProducts();

      expect(mockFetch).toHaveBeenCalledWith('/api/products', expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
      expect(products).toEqual(sampleProducts);
    });

    test('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
      });

      await expect(apiClient.getProducts()).rejects.toThrow('Server error');
    });

    test('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.getProducts()).rejects.toThrow('Network error');
    });

    test('handles invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => { throw new Error('Invalid JSON'); },
      });

      await expect(apiClient.getProducts()).rejects.toThrow('HTTP 400: Bad Request');
    });
  });

  describe('getProduct', () => {
    test('fetches single product successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => sampleProduct,
      });

      const product = await apiClient.getProduct(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
      expect(product).toEqual(sampleProduct);
    });

    test('throws error for non-existent product', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Product not found' }),
      });

      await expect(apiClient.getProduct(999)).rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    test('creates product successfully', async () => {
      const newProduct = {
        name: 'New Chair',
        description: 'A new test chair',
        price: 199.99,
        currency: 'USD',
        stockQuantity: 5,
        category: 'Furniture',
      };

      const createdProduct = { ...sampleProduct, ...newProduct };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdProduct,
      });

      const result = await apiClient.createProduct(newProduct);

      expect(mockFetch).toHaveBeenCalledWith('/api/products', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(newProduct),
      }));
      expect(result).toEqual(createdProduct);
    });

    test('throws error when creation fails', async () => {
      const newProduct = {
        name: '',  // Invalid data
        description: 'Test',
        price: -1,  // Invalid price
        currency: 'USD',
        stockQuantity: 5,
        category: 'Furniture',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid product data' }),
      });

      await expect(apiClient.createProduct(newProduct)).rejects.toThrow('Invalid product data');
    });
  });

  describe('updateProduct', () => {
    test('updates product successfully', async () => {
      const updates = { name: 'Updated Chair', price: 349.99 };
      const updatedProduct = { ...sampleProduct, ...updates };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedProduct,
      });

      const result = await apiClient.updateProduct(1, updates);

      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(updates),
      }));
      expect(result).toEqual(updatedProduct);
    });

    test('throws error when update fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Product not found' }),
      });

      await expect(apiClient.updateProduct(999, { name: 'Updated' })).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    test('deletes product successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.deleteProduct(1);

      expect(mockFetch).toHaveBeenCalledWith('/api/products/1', expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }));
    });

    test('throws error when deletion fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Product not found' }),
      });

      await expect(apiClient.deleteProduct(999)).rejects.toThrow('Product not found');
    });
  });

  describe('error handling', () => {
    test('handles unexpected errors', async () => {
      mockFetch.mockRejectedValueOnce('Unexpected error type');

      await expect(apiClient.getProducts()).rejects.toThrow('An unexpected error occurred');
    });

    test('handles response without error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}), // No message field
      });

      await expect(apiClient.getProducts()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });
});