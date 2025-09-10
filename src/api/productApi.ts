// API client for communicating with the Java backend service

const API_BASE_URL = 'http://localhost:8080/api';

export interface ProductDimensions {
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  dimensions?: ProductDimensions;
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

export interface ProductFilters {
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

class ProductApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products');
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  // Search products with filters
  async searchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/products/search?${queryString}` : '/products';
    
    return this.request<Product[]>(endpoint);
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/category/${encodeURIComponent(category)}`);
  }

  // Search products by name
  async searchByName(query: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/search/name?query=${encodeURIComponent(query)}`);
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const params = new URLSearchParams();
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    
    return this.request<Product[]>(`/products/price-range?${params.toString()}`);
  }

  // Get in-stock products
  async getInStockProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products/in-stock');
  }

  // Get available filters
  async getProductFilters(): Promise<Record<string, string[]>> {
    return this.request<Record<string, string[]>>('/products/filters');
  }

  // Check if product name is unique
  async checkProductName(name: string, excludeId?: number): Promise<{ available: boolean }> {
    const params = new URLSearchParams({ name });
    if (excludeId !== undefined) {
      params.append('excludeId', excludeId.toString());
    }
    
    return this.request<{ available: boolean }>(`/products/check-name?${params.toString()}`);
  }
}

// Create and export a singleton instance
export const productApi = new ProductApiClient();

// Export the class for testing or custom instances
export { ProductApiClient };
