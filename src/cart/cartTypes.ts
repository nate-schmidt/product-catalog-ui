export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  inStock: boolean;
  material?: string;
  color?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType {
  cart: Cart;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}