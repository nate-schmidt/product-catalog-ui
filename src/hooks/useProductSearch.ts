import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic product type – replace/extend as needed.
 */
export interface Product {
  id: string;
  name: string;
  // ...other fields
}

/**
 * Options accepted by the hook.
 */
export interface UseProductSearchOptions {
  /**
   * Number of items to request per page (default 20)
   */
  limit?: number;
}

/**
 * Return type of the hook.
 */
export interface UseProductSearchResult {
  products: Product[];
  loading: boolean;
  error: unknown;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * A robust, pagination-aware product search hook that avoids the classic
 * `useEffect` ↔ `useCallback` circular-dependency trap that can lead to
 * infinite re-renders.
 *
 * How the bug is avoided:
 *   1. `offset` is stored in a `useRef`, *not* React state – changing it does
 *      not trigger a re-render, keeping `performSearch` stable.
 *   2. `performSearch` therefore no longer depends on `offset` and is only
 *      recreated when `query` or `limit` change.
 *   3. The `useEffect` that triggers an initial (or query-change) search
 *      depends on `query` and the *stable* `performSearch`, eliminating the
 *      circular dependency that previously existed.
 */
export function useProductSearch(
  query: string,
  { limit = 20 }: UseProductSearchOptions = {}
): UseProductSearchResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [hasMore, setHasMore] = useState(false);

  // Offset lives in a ref so updates don`t trigger renders
  const offsetRef = useRef(0);

  /**
   * Fetch a page of products and append/replace the local list.
   *
   * The callback does **not** include `offsetRef.current` in its dependency
   * array thanks to the functional update pattern. That keeps the identity
   * of `performSearch` stable across pagination, preventing the infinite
   * loop that previously occurred.
   */
  const performSearch = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);

        const currentOffset = reset ? 0 : offsetRef.current;
        const response = await fetch(
          `/api/products?query=${encodeURIComponent(query)}&offset=${currentOffset}&limit=${limit}`
        );
        if (!response.ok) throw new Error(`Failed to fetch products (${response.status})`);

        const data: Product[] = await response.json();

        setProducts(prev => (reset ? data : [...prev, ...data]));

        // Update the offset ref without re-rendering
        offsetRef.current = currentOffset + data.length;
        setHasMore(data.length === limit);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    // `offsetRef` is *not* a dependency because `.current` is mutable.
    [query, limit]
  );

  /**
   * (Re)run the search whenever the query changes.
   */
  useEffect(() => {
    // Reset local state on query change
    setProducts([]);
    offsetRef.current = 0;
    performSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, performSearch]);

  /**
   * Public helper to load the next page.
   */
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    performSearch();
  }, [loading, hasMore, performSearch]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
  };
}