import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { renderHook, waitFor, cleanup } from '../test-utils/render';
import { mockProducts, mockFetch, restoreFetch, createMockResponse } from '../test-utils/mocks';
import { useState, useEffect } from 'react';

// Example useProducts hook for reference
const useProducts = (category?: string) => {
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = category 
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
          
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error, refetch: () => {} };
};

describe('useProducts Hook', () => {
  beforeEach(() => {
    cleanup();
    mockFetch();
  });

  afterEach(() => {
    restoreFetch();
  });

  describe('Initial State', () => {
    test('starts with loading state', () => {
      const { result } = renderHook(() => useProducts());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Fetching Products', () => {
    test('fetches products successfully', async () => {
      const { result } = renderHook(() => useProducts());

      // Wait for the fetch to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
    });

    test('fetches products with category filter', async () => {
      const filteredProducts = [mockProducts[0]];
      mockFetch({
        '/api/products?category=Electronics': () => createMockResponse(filteredProducts),
      });

      const { result } = renderHook(() => useProducts('Electronics'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual(filteredProducts);
    });

    test('handles fetch errors gracefully', async () => {
      mockFetch({
        '/api/products': () => new Response('Server Error', { status: 500 }),
      });

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toContain('Failed to fetch products: 500');
    });

    test('handles network errors', async () => {
      mockFetch({
        '/api/products': () => {
          throw new Error('Network error');
        },
      });

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBe('Network error');
    });
  });

  describe('Re-fetching', () => {
    test('refetches when category changes', async () => {
      const electronics = [mockProducts[0]];
      const clothing = [mockProducts[1]];
      
      let callCount = 0;
      mockFetch({
        '/api/products': () => {
          callCount++;
          return createMockResponse(mockProducts);
        },
        '/api/products?category=Electronics': () => {
          callCount++;
          return createMockResponse(electronics);
        },
        '/api/products?category=Clothing': () => {
          callCount++;
          return createMockResponse(clothing);
        },
      });

      const { result, rerender } = renderHook(
        ({ category }) => useProducts(category),
        { initialProps: { category: undefined } }
      );

      // Initial fetch
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.products).toEqual(mockProducts);
      expect(callCount).toBe(1);

      // Change category to Electronics
      rerender({ category: 'Electronics' });
      
      await waitFor(() => {
        expect(result.current.products).toEqual(electronics);
      });
      expect(callCount).toBe(2);

      // Change category to Clothing
      rerender({ category: 'Clothing' });
      
      await waitFor(() => {
        expect(result.current.products).toEqual(clothing);
      });
      expect(callCount).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty product list', async () => {
      mockFetch({
        '/api/products': () => createMockResponse([]),
      });

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    test('handles malformed JSON response', async () => {
      mockFetch({
        '/api/products': () => new Response('Invalid JSON', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      });

      const { result } = renderHook(() => useProducts());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toContain('Unexpected');
    });
  });
});