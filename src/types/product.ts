import { ProductDimensions } from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  stock: number;
  dimensions?: ProductDimensions;
  material?: string;
  color?: string;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}