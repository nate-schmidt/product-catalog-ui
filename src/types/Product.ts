export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  category?: string;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface OrderData {
  items: CartItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  orderSummary: OrderSummary;
}