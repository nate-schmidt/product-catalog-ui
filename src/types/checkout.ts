export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  billingAddress: ShippingAddress;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentInfo: PaymentInfo;
  useShippingAsBilling: boolean;
  shippingMethod: ShippingMethod;
  couponCode?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentInfo: Omit<PaymentInfo, 'cardNumber' | 'cvv'>; // Don't store sensitive data
  shippingMethod: ShippingMethod;
  subtotal: number;
  tax: number;
  shipping: number;
  couponDiscount?: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'processing' 
  | 'shipped'
  | 'delivered'
  | 'cancelled';

import { CartItem } from './cart';