import { apiClient } from './ApiClient';
import { ProductMapper } from './ProductMapper';
import { ENDPOINTS } from '../config/api';
import { 
  Product, 
  ProductApiResponse, 
  ProductSearchParams, 
  Category 
} from '../types/Product';

export class ProductService {
  async getProducts(limit: number = 20, offset: number = 0): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await apiClient.get<ProductApiResponse>(`${ENDPOINTS.PRODUCTS}?${params}`);
    
    return {
      products: ProductMapper.apiToProducts(response),
      total: response.meta.total,
    };
  }

  async searchProducts(searchParams: ProductSearchParams): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams();
    
    if (searchParams.query) params.append('q', searchParams.query);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.manufacturer) params.append('manufacturer', searchParams.manufacturer);
    if (searchParams.minPrice !== undefined) params.append('min_price', searchParams.minPrice.toString());
    if (searchParams.maxPrice !== undefined) params.append('max_price', searchParams.maxPrice.toString());
    if (searchParams.featured !== undefined) params.append('featured', searchParams.featured.toString());
    if (searchParams.inStock !== undefined) params.append('in_stock', searchParams.inStock.toString());
    if (searchParams.limit !== undefined) params.append('limit', searchParams.limit.toString());
    if (searchParams.offset !== undefined) params.append('offset', searchParams.offset.toString());

    const response = await apiClient.get<ProductApiResponse>(`${ENDPOINTS.PRODUCT_SEARCH}?${params}`);
    
    return {
      products: ProductMapper.apiToProducts(response),
      total: response.meta.total,
    };
  }

  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<{ data: import('../types/Product').ProductApiData }>(`${ENDPOINTS.PRODUCT_DETAIL}/${id}`);
    return ProductMapper.apiToProduct(response.data);
  }

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<{ data: Category[] }>(ENDPOINTS.CATEGORIES);
    return response.data;
  }

  // Utility method to get unique manufacturers from current products
  async getManufacturers(): Promise<string[]> {
    try {
      const { products } = await this.getProducts(1000, 0); // Get a large set to extract manufacturers
      return ProductMapper.extractManufacturers(products);
    } catch (error) {
      console.warn('Failed to fetch manufacturers:', error);
      return [];
    }
  }

  // Utility method to get unique categories as strings
  async getCategoryNames(): Promise<string[]> {
    try {
      const categories = await this.getCategories();
      return categories.map(cat => cat.name).sort();
    } catch (error) {
      console.warn('Failed to fetch category names:', error);
      return [];
    }
  }
}

// Create a singleton instance
export const productService = new ProductService(); 