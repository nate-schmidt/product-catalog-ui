/**
 * Product service for API operations
 */

import {
  Product,
  ProductResponseDTO,
  ProductRequestDTO,
  SearchFilters,
  ProductFilters,
} from '../types/product';
import { apiService } from './api';
import { transformProduct } from '../utils/formatters';

export class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    const products = await apiService.get<ProductResponseDTO[]>('/products');
    return products.map(transformProduct);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const product = await apiService.get<ProductResponseDTO>(`/products/${id}`);
    return transformProduct(product);
  }

  /**
   * Search products with filters
   */
  async searchProducts(filters: SearchFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.material) params.append('material', filters.material);
    if (filters.color) params.append('color', filters.color);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products/search?${queryString}` : '/products/search';
    
    const products = await apiService.get<ProductResponseDTO[]>(endpoint);
    return products.map(transformProduct);
  }

  /**
   * Search products by name
   */
  async searchByName(query: string): Promise<Product[]> {
    const params = new URLSearchParams({ query });
    const products = await apiService.get<ProductResponseDTO[]>(`/products/search/name?${params}`);
    return products.map(transformProduct);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await apiService.get<ProductResponseDTO[]>(`/products/category/${encodeURIComponent(category)}`);
    return products.map(transformProduct);
  }

  /**
   * Get products by price range
   */
  async getProductsByPriceRange(minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products/price-range?${queryString}` : '/products/price-range';
    
    const products = await apiService.get<ProductResponseDTO[]>(endpoint);
    return products.map(transformProduct);
  }

  /**
   * Get products by dimensions
   */
  async getProductsByDimensions(maxWidth?: number, maxHeight?: number, maxDepth?: number): Promise<Product[]> {
    const params = new URLSearchParams();
    if (maxWidth !== undefined) params.append('maxWidth', maxWidth.toString());
    if (maxHeight !== undefined) params.append('maxHeight', maxHeight.toString());
    if (maxDepth !== undefined) params.append('maxDepth', maxDepth.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/products/dimensions?${queryString}` : '/products/dimensions';
    
    const products = await apiService.get<ProductResponseDTO[]>(endpoint);
    return products.map(transformProduct);
  }

  /**
   * Get in-stock products
   */
  async getInStockProducts(): Promise<Product[]> {
    const products = await apiService.get<ProductResponseDTO[]>('/products/in-stock');
    return products.map(transformProduct);
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const params = new URLSearchParams({ threshold: threshold.toString() });
    const products = await apiService.get<ProductResponseDTO[]>(`/products/low-stock?${params}`);
    return products.map(transformProduct);
  }

  /**
   * Get available filters (categories, materials, colors)
   */
  async getProductFilters(): Promise<ProductFilters> {
    return await apiService.get<ProductFilters>('/products/filters');
  }

  /**
   * Check if product name is available
   */
  async checkProductName(name: string, excludeId?: number): Promise<boolean> {
    const params = new URLSearchParams({ name });
    if (excludeId !== undefined) params.append('excludeId', excludeId.toString());
    
    const response = await apiService.get<{ available: boolean }>(`/products/check-name?${params}`);
    return response.available;
  }

  /**
   * Create a new product
   */
  async createProduct(product: ProductRequestDTO): Promise<Product> {
    const createdProduct = await apiService.post<ProductResponseDTO>('/products', product);
    return transformProduct(createdProduct);
  }

  /**
   * Update a product
   */
  async updateProduct(id: number, product: ProductRequestDTO): Promise<Product> {
    const updatedProduct = await apiService.put<ProductResponseDTO>(`/products/${id}`, product);
    return transformProduct(updatedProduct);
  }

  /**
   * Update product stock
   */
  async updateStock(id: number, quantity: number): Promise<Product> {
    const params = new URLSearchParams({ quantity: quantity.toString() });
    const updatedProduct = await apiService.patch<ProductResponseDTO>(`/products/${id}/stock?${params}`);
    return transformProduct(updatedProduct);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<{ message: string; id: string }> {
    return await apiService.delete(`/products/${id}`);
  }

  /**
   * Batch create products
   */
  async createProducts(products: ProductRequestDTO[]): Promise<Product[]> {
    const createdProducts = await apiService.post<ProductResponseDTO[]>('/products/batch', products);
    return createdProducts.map(transformProduct);
  }
}

// Singleton instance
export const productService = new ProductService();