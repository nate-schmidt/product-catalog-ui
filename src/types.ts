export type Product = {
  id: number;
  name: string;
  priceCents: number;
  stock: number;
};

export type FlashSale = {
  id: number;
  productId: number;
  salePriceCents: number;
  startAtMs: number;
  endAtMs: number;
  maxUnits?: number | null;
};

export type ProductWithPricing = Product & {
  activeFlashSale?: {
    salePriceCents: number;
    startAtMs: number;
    endAtMs: number;
  };
};

export type CreateFlashSaleInput = {
  productId: number;
  salePriceCents: number;
  startAtMs: number;
  endAtMs: number;
  maxUnits?: number | null;
};

export type CheckoutRequest = {
  productId: number;
  quantity: number;
};

export type CheckoutResult = {
  success: boolean;
  unitPriceCents: number;
  quantity: number;
  totalPriceCents: number;
  usedFlashSale: boolean;
};

