export type CartItem = {
  productId: string;
  quantity: number;
};

export type LineItem = {
  productId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type CouponApplied = {
  code: string;
  type: "percent" | "fixed";
  discountCents: number;
};

export type PriceSummary = {
  items: LineItem[];
  subtotalCents: number;
  coupon?: CouponApplied;
  totalCents: number;
};

export type ValidateCouponRequest = {
  code: string;
  items: CartItem[];
};

export type ValidateCouponResponse = {
  valid: boolean;
  reason?: string;
  summary?: PriceSummary;
};

export type CheckoutRequest = {
  items: CartItem[];
  couponCode?: string | null;
  // In a real app: customer info, shipping, payment method, etc.
};

export type CheckoutResponse = {
  ok: boolean;
  orderId?: string;
  summary?: PriceSummary;
  error?: string;
};

