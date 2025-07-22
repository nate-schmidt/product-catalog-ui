import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface SearchParams {
  query: string;
  limit?: number;
}

interface SearchResult {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}

const useProductSearch = (params: SearchParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { query, limit = 20 } = params;

  // Fixed: Separate function for fetching data that doesn't depend on offset
  const fetchProducts = useCallback(async (searchOffset: number) => {
    if (!query) {
      setProducts([]);
      setOffset(0);
      setTotalCount(0);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${searchOffset}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: SearchResult = await response.json();

      if (searchOffset === 0) {
        setProducts(data.products);
      } else {
        setProducts(prev => [...prev, ...data.products]);
      }

      setTotalCount(data.totalCount);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [query, limit]);

  // Fixed: Initial search effect that only runs when query or limit changes
  useEffect(() => {
    // Reset offset to 0 for new searches
    setOffset(0);
    fetchProducts(0);
  }, [query, limit, fetchProducts]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchProducts(nextOffset);
    }
  }, [loading, hasMore, offset, limit, fetchProducts]);

  const reset = useCallback(() => {
    setProducts([]);
    setOffset(0);
    setTotalCount(0);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    reset,
  };
};

export default useProductSearch;