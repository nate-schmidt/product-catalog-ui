import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, ProductSearchParams } from '../types/Product';
import { productService } from '../services/ProductService';

interface UseProductSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchParams: ProductSearchParams;
  setSearchParams: (params: ProductSearchParams) => void;
  filteredProducts: Product[];
  loading: boolean;
  pendingSearch: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
}

interface UseProductSearchOptions {
  limit?: number;
  debounceMs?: number;
  autoSearch?: boolean;
}

export function useProductSearch(
  initialQuery: string = '', 
  options: UseProductSearchOptions = {}
): UseProductSearchResult {
  const { limit = 20, debounceMs = 300, autoSearch = true } = options;
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({
    query: initialQuery,
    limit,
    offset: 0,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  // Debounced search effect
  useEffect(() => {
    if (!autoSearch) return;

    // Show pending state immediately when query changes
    if (searchQuery.trim()) {
      setPendingSearch(true);
    } else {
      setPendingSearch(false);
    }

    const timeoutId = setTimeout(() => {
      setPendingSearch(false);
      setSearchParams(prev => ({
        ...prev,
        query: searchQuery,
        offset: 0, // Reset offset when search changes
      }));
      setOffset(0);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceMs, autoSearch]);

  const performSearch = useCallback(async (params: ProductSearchParams, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : params.offset || 0;
      const searchParamsWithOffset = {
        ...params,
        offset: currentOffset,
        limit: params.limit || limit,
      };

      const result = await productService.searchProducts(searchParamsWithOffset);

      if (reset) {
        setFilteredProducts(result.products);
        setOffset(searchParamsWithOffset.limit || limit);
      } else {
        setFilteredProducts(prev => [...prev, ...result.products]);
        setOffset(prev => prev + (searchParamsWithOffset.limit || limit));
      }
      
      setTotal(result.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
      setError(errorMessage);
      console.error('Error searching products:', err);
      
      // Clear results on error
      if (reset) {
        setFilteredProducts([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Trigger search when searchParams change
  useEffect(() => {
    if (autoSearch && (searchParams.query || hasActiveFilters(searchParams))) {
      performSearch(searchParams, true);
    } else if (autoSearch && !searchParams.query && !hasActiveFilters(searchParams)) {
      // Clear results when no search query or filters
      setFilteredProducts([]);
      setTotal(0);
      setError(null);
    }
  }, [searchParams, autoSearch, performSearch]);

  const refetch = useCallback(async () => {
    setOffset(0);
    await performSearch(searchParams, true);
  }, [performSearch, searchParams]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await performSearch({ ...searchParams, offset }, false);
    }
  }, [loading, hasMore, performSearch, searchParams, offset]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchParams({
      query: '',
      limit,
      offset: 0,
    });
    setFilteredProducts([]);
    setTotal(0);
    setError(null);
    setOffset(0);
    setPendingSearch(false);
  }, [limit]);

  const hasMore = filteredProducts.length < total;

  // Enhanced setSearchParams that resets offset
  const setSearchParamsWithReset = useCallback((params: ProductSearchParams) => {
    setSearchParams({
      ...params,
      offset: 0,
    });
    setOffset(0);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchParams,
    setSearchParams: setSearchParamsWithReset,
    filteredProducts,
    loading,
    pendingSearch,
    error,
    total,
    hasMore,
    refetch,
    loadMore,
    clearSearch,
  };
}

// Helper function to check if there are active filters
function hasActiveFilters(params: ProductSearchParams): boolean {
  return !!(
    params.category ||
    params.manufacturer ||
    params.minPrice !== undefined ||
    params.maxPrice !== undefined ||
    params.featured !== undefined ||
    params.inStock !== undefined
  );
} 