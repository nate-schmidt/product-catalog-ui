/**
 * Product types based on the backend API model
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number; // Converted from BigDecimal
  stock: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SearchFilters {
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductFilters {
  categories: string[];
  materials: string[];
  colors: string[];
}

// API Response types from backend
export interface ProductResponseDTO {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

export interface ProductRequestDTO {
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  width?: number;
  height?: number;
  depth?: number;
  material?: string;
  color?: string;
  imageUrl?: string;
}

export interface ApiError {
  error: string;
  message: string;
}