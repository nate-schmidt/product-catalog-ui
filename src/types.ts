export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  salePrice?: number;
  saleEndsAt?: number; // Unix timestamp in milliseconds
}