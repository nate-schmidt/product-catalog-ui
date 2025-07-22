import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/ProductService';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

interface UseProductsOptions {
  limit?: number;
  autoLoad?: boolean;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { limit = 20, autoLoad = true } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const fetchProducts = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : offset;
      const result = await productService.getProducts(limit, currentOffset);

      if (reset) {
        setProducts(result.products);
        setOffset(limit);
      } else {
        setProducts(prev => [...prev, ...result.products]);
        setOffset(prev => prev + limit);
      }
      
      setTotal(result.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset]);

  const refetch = useCallback(async () => {
    setOffset(0);
    await fetchProducts(true);
  }, [fetchProducts]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchProducts(false);
    }
  }, [loading, fetchProducts]);

  const hasMore = products.length < total;

  useEffect(() => {
    if (autoLoad) {
      fetchProducts(true);
    }
  }, [autoLoad]); // Only run on mount or when autoLoad changes

  return {
    products,
    loading,
    error,
    total,
    hasMore,
    refetch,
    loadMore,
  };
} 