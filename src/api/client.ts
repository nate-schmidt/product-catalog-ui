import type { 
  Product, 
  CartItem, 
  CartSummary, 
  Coupon,
  CouponValidationRequest,
  CouponValidationResponse,
  Order,
  CreateOrderRequest
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function for API calls
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get or create a session ID for anonymous users
export function getSessionId(): string {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Product API
export const productAPI = {
  getAll: () => fetchAPI<Product[]>('/products'),
  getById: (id: number) => fetchAPI<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id' | 'created_at'>) => 
    fetchAPI<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),
};

// Cart API
export const cartAPI = {
  getItems: (sessionId: string) => fetchAPI<CartItem[]>(`/cart/${sessionId}`),
  
  addItem: (productId: number, quantity: number = 1) => 
    fetchAPI<CartItem>('/cart', {
      method: 'POST',
      body: JSON.stringify({
        session_id: getSessionId(),
        product_id: productId,
        quantity,
      }),
    }),
  
  updateItem: (cartItemId: number, quantity: number) =>
    fetchAPI<CartItem>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  
  removeItem: (cartItemId: number) =>
    fetchAPI<{ message: string }>(`/cart/${cartItemId}`, {
      method: 'DELETE',
    }),
  
  clear: (sessionId: string) =>
    fetchAPI<{ message: string }>(`/cart/clear/${sessionId}`, {
      method: 'DELETE',
    }),
  
  getSummary: (sessionId: string, couponCode?: string) => {
    const params = couponCode ? `?coupon_code=${encodeURIComponent(couponCode)}` : '';
    return fetchAPI<CartSummary>(`/cart/${sessionId}/summary${params}`);
  },
};

// Coupon API
export const couponAPI = {
  getAll: (activeOnly: boolean = true) => 
    fetchAPI<Coupon[]>(`/coupons?active_only=${activeOnly}`),
  
  getById: (id: number) => fetchAPI<Coupon>(`/coupons/${id}`),
  
  getByCode: (code: string) => fetchAPI<Coupon>(`/coupons/code/${code}`),
  
  validate: (code: string, cartItems: Array<{ product_id: number; quantity: number }>) =>
    fetchAPI<CouponValidationResponse>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({
        code,
        cart_items: cartItems,
      } as CouponValidationRequest),
    }),
  
  create: (coupon: Omit<Coupon, 'id' | 'times_used' | 'created_at' | 'applicable_products'> & { applicable_product_ids: number[] }) =>
    fetchAPI<Coupon>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    }),
};

// Order API
export const orderAPI = {
  create: (order: CreateOrderRequest) =>
    fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  getById: (id: number) => fetchAPI<Order>(`/orders/${id}`),
  
  getBySession: (sessionId: string) => 
    fetchAPI<Order[]>(`/orders/session/${sessionId}`),
};