import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './config';
import { ProductResponseDTO, ProductFilters, PaginatedResponse } from '../types/api';
import { Product } from '../types/product';

export class ProductService {
  private baseEndpoint = API_ENDPOINTS.PRODUCTS;

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const response = await httpClient.get<ProductResponseDTO[]>(this.baseEndpoint);
    return response.map(this.mapToProduct);
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await httpClient.get<ProductResponseDTO>(`${this.baseEndpoint}/${id}`);
    return this.mapToProduct(response);
  }

  // Search products with filters
  async searchProducts(filters: ProductFilters): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.baseEndpoint}/search?${queryString}` : `${this.baseEndpoint}/search`;
    
    const response = await httpClient.get<ProductResponseDTO[]>(endpoint);
    return response.map(this.mapToProduct);
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await httpClient.get<ProductResponseDTO[]>(`${this.baseEndpoint}/category/${encodeURIComponent(category)}`);
    return response.map(this.mapToProduct);
  }

  // Search products by name
  async searchByName(query: string): Promise<Product[]> {
    const response = await httpClient.get<ProductResponseDTO[]>(`${this.baseEndpoint}/search/name?query=${encodeURIComponent(query)}`);
    return response.map(this.mapToProduct);
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (minPrice !== undefined) queryParams.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.baseEndpoint}/price-range?${queryString}` : `${this.baseEndpoint}/price-range`;
    
    const response = await httpClient.get<ProductResponseDTO[]>(endpoint);
    return response.map(this.mapToProduct);
  }

  // Get products by dimensions
  async getProductsByDimensions(maxWidth?: number, maxHeight?: number, maxDepth?: number): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    if (maxWidth !== undefined) queryParams.append('maxWidth', maxWidth.toString());
    if (maxHeight !== undefined) queryParams.append('maxHeight', maxHeight.toString());
    if (maxDepth !== undefined) queryParams.append('maxDepth', maxDepth.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `${this.baseEndpoint}/dimensions?${queryString}` : `${this.baseEndpoint}/dimensions`;
    
    const response = await httpClient.get<ProductResponseDTO[]>(endpoint);
    return response.map(this.mapToProduct);
  }

  // Get in-stock products
  async getInStockProducts(): Promise<Product[]> {
    const response = await httpClient.get<ProductResponseDTO[]>(`${this.baseEndpoint}/in-stock`);
    return response.map(this.mapToProduct);
  }

  // Get low stock products
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const response = await httpClient.get<ProductResponseDTO[]>(`${this.baseEndpoint}/low-stock?threshold=${threshold}`);
    return response.map(this.mapToProduct);
  }

  // Get available filters
  async getProductFilters(): Promise<Record<string, string[]>> {
    return await httpClient.get<Record<string, string[]>>(`${this.baseEndpoint}/filters`);
  }

  // Check if product name is unique
  async checkProductName(name: string, excludeId?: string): Promise<boolean> {
    const queryParams = new URLSearchParams({ name });
    if (excludeId) queryParams.append('excludeId', excludeId);
    
    const response = await httpClient.get<{ available: boolean }>(`${this.baseEndpoint}/check-name?${queryParams.toString()}`);
    return response.available;
  }

  // Update product stock
  async updateStock(id: string, quantity: number): Promise<Product> {
    const response = await httpClient.patch<ProductResponseDTO>(`${this.baseEndpoint}/${id}/stock?quantity=${quantity}`);
    return this.mapToProduct(response);
  }

  // Map backend ProductResponseDTO to frontend Product
  private mapToProduct(dto: ProductResponseDTO): Product {
    return {
      id: dto.id.toString(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      image: dto.imageUrl || '',
      category: dto.category,
      inStock: dto.inStock,
      stock: dto.stock,
      dimensions: dto.dimensions,
      material: dto.material,
      color: dto.color,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      // Keep UI-specific fields for backward compatibility
      rating: 4.5, // Default rating - could be fetched from a separate service
      reviews: Math.floor(Math.random() * 200), // Default reviews - could be fetched from a separate service
    };
  }
}

// Default product service instance
export const productService = new ProductService();
