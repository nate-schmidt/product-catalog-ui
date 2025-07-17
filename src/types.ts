export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_purchase: number;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string;
  applicable_products: Product[];
}

export interface CartItem {
  id: number;
  session_id: string;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount_amount: number;
  total: number;
  applied_coupon: Coupon | null;
}

export interface CouponValidationRequest {
  code: string;
  cart_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface CouponValidationResponse {
  valid: boolean;
  message: string;
  discount_amount: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
}

export interface Order {
  id: number;
  session_id: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  coupon_code: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface CreateOrderRequest {
  session_id: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  coupon_code?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
}