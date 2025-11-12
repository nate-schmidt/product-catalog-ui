// API base URL - defaults to localhost:8080
// Can be overridden by setting BUN_PUBLIC_API_BASE_URL environment variable
// Bun automatically exposes BUN_PUBLIC_* variables to client code at build time
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
  category?: string;
  price: number;
  stock?: number;
  dimensions?: ProductDimensions;
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  inStock?: boolean;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

