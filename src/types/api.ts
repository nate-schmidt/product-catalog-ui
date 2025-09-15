// API Response Types matching backend DTOs

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface ProductResponseDTO {
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

export interface CheckoutItemDTO {
  productId: number;
  quantity: number;
  price: number;
}

export interface CheckoutRequestDTO {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  sameAsShipping?: boolean;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL' | 'BANK_TRANSFER';
  items: CheckoutItemDTO[];
  specialInstructions?: string;
}

export interface CheckoutResponseDTO {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export interface ProductFilters {
  category?: string;
  material?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  maxDepth?: number;
}

export interface ApiError {
  error: string;
  message: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
