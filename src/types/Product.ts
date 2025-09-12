export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  material?: string;
  color?: string;
  brand?: string;
  sku?: string;
  createdDate: string;
  lastModifiedDate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}