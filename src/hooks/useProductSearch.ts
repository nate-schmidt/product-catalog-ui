import { useState, useEffect, useCallback, useRef } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

interface ProductSearchState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

interface UseProductSearchOptions {
  initialQuery?: string;
  pageSize?: number;
  debounceMs?: number;
}

interface UseProductSearchReturn extends ProductSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
  reset: () => void;
  performSearch: (query: string, reset?: boolean) => Promise<void>;
}

// Mock API function - replace with actual API call
const searchProducts = async (
  query: string, 
  offset: number, 
  limit: number
): Promise<{ products: Product[]; total: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data
  const mockProducts: Product[] = Array.from({ length: limit }, (_, i) => ({
    id: `${offset + i + 1}`,
    name: `Product ${offset + i + 1} - ${query}`,
    price: Math.floor(Math.random() * 100) + 10,
    description: `Description for product matching "${query}"`,
  }));

  return {
    products: mockProducts,
    total: Math.min(100, Math.floor(Math.random() * 200) + 50), // Mock total
  };
};

export const useProductSearch = (options: UseProductSearchOptions = {}): UseProductSearchReturn => {
  const {
    initialQuery = '',
    pageSize = 20,
    debounceMs = 300,
  } = options;

  // State management
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [state, setState] = useState<ProductSearchState>({
    products: [],
    loading: false,
    error: null,
    hasMore: true,
    total: 0,
  });

  // Use refs to track current values without causing re-renders
  const offsetRef = useRef(0);
  const currentQueryRef = useRef(searchQuery);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Update current query ref when searchQuery changes
  useEffect(() => {
    currentQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Stable performSearch function that doesn't depend on offset state
  const performSearch = useCallback(async (query: string, reset = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Reset offset if this is a new search
      const currentOffset = reset ? 0 : offsetRef.current;
      if (reset) {
        offsetRef.current = 0;
      }

      const { products, total } = await searchProducts(query, currentOffset, pageSize);
      
      setState(prev => ({
        ...prev,
        products: reset ? products : [...prev.products, ...products],
        total,
        hasMore: currentOffset + products.length < total,
        loading: false,
      }));

      // Update offset after successful search
      offsetRef.current = currentOffset + products.length;
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
    }
  }, [pageSize]); // Only depends on pageSize, not on offset

  // Load more function
  const loadMore = useCallback(() => {
    if (state.loading || !state.hasMore) return;
    performSearch(currentQueryRef.current, false);
  }, [state.loading, state.hasMore, performSearch]);

  // Reset function
  const reset = useCallback(() => {
    offsetRef.current = 0;
    setState({
      products: [],
      loading: false,
      error: null,
      hasMore: true,
      total: 0,
    });
  }, []);

  // Debounced search effect - only triggers on searchQuery changes
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Don't search for empty queries
    if (!searchQuery.trim()) {
      reset();
      return;
    }

    // Set up debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery, true);
    }, debounceMs);

    // Cleanup timeout on unmount or when searchQuery changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery, debounceMs, performSearch, reset]);

  return {
    ...state,
    searchQuery,
    setSearchQuery,
    loadMore,
    reset,
    performSearch,
  };
};