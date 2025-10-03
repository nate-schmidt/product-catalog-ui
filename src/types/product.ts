export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating?: number;
}

export interface FlashSale {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  products: Product[];
  isActive: boolean;
}
