export interface ProductDimensions {
  width?: number;
  height?: number;
  depth?: number;
  unit?: string;
}

export interface Product { 
  id: number; 
  name: string; 
  price: number; 
  description: string;
  category: string;
  stock: number;
  dimensions?: ProductDimensions;
  material?: string;
  color?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

export type CartItem = { 
  id: number; 
  name: string; 
  price: number; 
  quantity: number 
};

export type Cart = { 
  items: CartItem[]; 
  updatedAt: number 
};
