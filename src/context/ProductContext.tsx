import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types/product';
import { ProductFilters } from '../types/api';
import { productService } from '../api';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
  selectedCategory: string | null;
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  filterProducts: (filters: ProductFilters) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  clearFilters: () => void;
  setSelectedCategory: (category: string | null) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: ProductFilters }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'CLEAR_FILTERS' };

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
  selectedCategory: string | null;
}

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {},
        searchQuery: '',
        selectedCategory: null,
      };
    
    default:
      return state;
  }
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    loading: false,
    error: null,
    filters: {},
    searchQuery: '',
    selectedCategory: null,
  });

  const fetchProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const products = await productService.getAllProducts();
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const searchProducts = async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      
      if (query.trim() === '') {
        await fetchProducts();
        return;
      }
      
      const products = await productService.searchByName(query);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const filterProducts = async (filters: ProductFilters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_FILTERS', payload: filters });
      
      const products = await productService.searchProducts(filters);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to filter products';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const product = await productService.getProductById(id);
      return product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
    fetchProducts();
  };

  const setSelectedCategory = (category: string | null) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    if (category) {
      filterProducts({ ...state.filters, category });
    } else {
      filterProducts({ ...state.filters, category: undefined });
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products: state.products,
      loading: state.loading,
      error: state.error,
      filters: state.filters,
      searchQuery: state.searchQuery,
      selectedCategory: state.selectedCategory,
      fetchProducts,
      searchProducts,
      filterProducts,
      getProductById,
      clearFilters,
      setSelectedCategory,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
