export interface Product {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  stockCount: number;
}

export interface FlashSale {
  id: string;
  productId: string;
  product: Product;
  discountPercentage: number; // 0-100
  flashPrice: number; // calculated price after discount
  startTime: Date;
  endTime: Date;
  maxQuantity?: number; // optional limit on total items that can be sold
  soldQuantity: number; // how many have been sold so far
  isActive: boolean;
  title: string;
  description?: string;
}

export interface FlashSaleStatus {
  isActive: boolean;
  timeRemaining: number; // milliseconds
  hasStarted: boolean;
  hasEnded: boolean;
  percentageComplete: number; // 0-100 based on time elapsed
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  isFlashSale: boolean;
  flashSaleId?: string;
  price: number; // current price (original or flash price)
}