// API configuration
// For browser code, we can't use process.env directly
// Use a constant that defaults to the Java backend service URL
// To override, you can modify this value or use build-time replacement
const API_BASE_URL = "http://localhost:8080/api";

// Backend ProductResponseDTO structure
export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  category?: string;
  price: number;
  stock?: number;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit?: string;
  };
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  inStock?: boolean;
}

// Frontend Product type (compatible with existing UI)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  inStock?: boolean;
  imageUrl?: string;
}

// Convert backend DTO to frontend Product
function mapProductFromDTO(dto: ProductResponseDTO): Product {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    price: dto.price,
    category: dto.category,
    stock: dto.stock,
    inStock: dto.inStock ?? (dto.stock !== undefined && dto.stock > 0),
    imageUrl: dto.imageUrl,
  };
}

// API service functions
export const productApi = {
  /**
   * Fetch all products from the backend
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data: ProductResponseDTO[] = await response.json();
      return data.map(mapProductFromDTO);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
      }

      const data: ProductResponseDTO = await response.json();
      return mapProductFromDTO(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  /**
   * Search products with filters
   */
  async searchProducts(filters: {
    category?: string;
    material?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.material) params.append("material", filters.material);
      if (filters.color) params.append("color", filters.color);
      if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
      if (filters.inStock !== undefined) params.append("inStock", String(filters.inStock));

      const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.status} ${response.statusText}`);
      }

      const data: ProductResponseDTO[] = await response.json();
      return data.map(mapProductFromDTO);
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};

