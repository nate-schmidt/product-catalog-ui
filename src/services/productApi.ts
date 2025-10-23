import { Product } from "../types/Product";

export class ProductApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductApiError";
  }
}

export const productApi = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new ProductApiError(`Failed to fetch products: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ProductApiError) {
        throw error;
      }
      throw new ProductApiError("Network error while fetching products");
    }
  },
};
