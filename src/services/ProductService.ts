// src/services/ProductService.ts
import { Product } from '../types/catalog';
import productsData from '../data/products.json';

/**
 * Product Service - Currently returns stubbed data
 * TODO: Replace with actual API calls when backend is ready
 */

/**
 * Get all products
 */
export const getAllProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return productsData as Product[];
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = productsData.find(p => p.id === id);
  return product ? (product as Product) : null;
};

/**
 * Search products by query string
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const lowerQuery = query.toLowerCase();
  const filtered = productsData.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    (p.description && p.description.toLowerCase().includes(lowerQuery))
  );
  
  return filtered as Product[];
};

/**
 * Filter products by various criteria
 */
export const filterProducts = async (filters: {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  badges?: Array<'sale' | 'new' | 'limited'>;
}): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...productsData] as Product[];
  
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.priceCents >= filters.minPrice!);
  }
  
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.priceCents <= filters.maxPrice!);
  }
  
  if (filters.inStock) {
    filtered = filtered.filter(p => p.inventory > 0);
  }
  
  if (filters.badges && filters.badges.length > 0) {
    filtered = filtered.filter(p => 
      p.badges && p.badges.some(badge => filters.badges!.includes(badge))
    );
  }
  
  return filtered;
};

/**
 * Get products sorted by criteria
 */
export const getSortedProducts = async (
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'title'
): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const products = [...productsData] as Product[];
  
  switch (sortBy) {
    case 'price-asc':
      return products.sort((a, b) => a.priceCents - b.priceCents);
    case 'price-desc':
      return products.sort((a, b) => b.priceCents - a.priceCents);
    case 'rating':
      return products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'title':
      return products.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return products;
  }
};

// Provide a named export expected by UI code
export const ProductService = {
  listProducts: getAllProducts,
};
