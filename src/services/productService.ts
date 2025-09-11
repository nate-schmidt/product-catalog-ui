import { getJson } from "./api";
import type { Product } from "../types/product";

export async function fetchProducts(): Promise<Product[]> {
  return getJson<Product[]>("/api/products");
}

export interface ActiveFlashSaleSummary {
  productId: string;
  salePrice: number;
  endsAt: string; // ISO8601
}

export async function fetchActiveFlashSales(): Promise<ActiveFlashSaleSummary[]> {
  return getJson<ActiveFlashSaleSummary[]>("/api/flash-sales/active");
}