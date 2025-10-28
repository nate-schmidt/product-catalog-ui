// src/services/ProductService.ts
import { Product } from '../types/catalog';

/**
 * Product Service - Currently returns stubbed data
 * TODO: Replace with actual API calls when backend is ready
 */

/**
 * Helper function to dynamically load products data
 * This avoids top-level await issues and ensures the module is always initialized
 */
async function loadProductsData(): Promise<Product[]> {
  const data = await import('../data/products.json');
  return data.default as Product[];
}

/**
 * Get all products
 */
async function listProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return await loadProductsData();
}

/**
 * Get a single product by ID
 */
async function getProduct(id: string): Promise<Product | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const productsData = await loadProductsData();
  const product = productsData.find(p => p.id === id);
  return product || null;
}

/**
 * Search products by query string
 */
async function searchProducts(query: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const productsData = await loadProductsData();
  const lowerQuery = query.toLowerCase();
  const filtered = productsData.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    (p.description && p.description.toLowerCase().includes(lowerQuery))
  );
  
  return filtered;
}

/**
 * Filter products by various criteria
 */
async function filterProducts(filters: {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  badges?: Array<'sale' | 'new' | 'limited'>;
}): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const productsData = await loadProductsData();
  let filtered = [...productsData];
  
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
}

/**
 * Get products sorted by criteria
 */
async function getSortedProducts(
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'title'
): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const productsData = await loadProductsData();
  const products = [...productsData];
  
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
}

/**
 * ProductService object with all service methods
 * This ensures the module is always properly initialized when imported
 */
export const ProductService = {
  listProducts,
  getProduct,
  searchProducts,
  filterProducts,
  getSortedProducts,
};

// Also export individual functions for backward compatibility
export const getAllProducts = listProducts;
export const getProductById = getProduct;
export { searchProducts, filterProducts, getSortedProducts };
