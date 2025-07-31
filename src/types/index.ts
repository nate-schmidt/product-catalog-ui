export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  inventory: number;
}

export interface FlashSale {
  id: string;
  productId: string;
  discountPercentage: number;
  salePrice: number;
  startTime: Date;
  endTime: Date;
  maxQuantity: number;
  soldQuantity: number;
  isActive: boolean;
  title: string;
  badge?: string;
}

export interface FlashSaleProduct extends Product {
  flashSale: FlashSale;
  timeRemaining?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  isFlashSale?: boolean;
  flashSalePrice?: number;
}

export interface FlashSalesContextType {
  flashSales: FlashSale[];
  flashSaleProducts: FlashSaleProduct[];
  activeFlashSales: FlashSale[];
  getFlashSaleByProductId: (productId: string) => FlashSale | null;
  isProductOnFlashSale: (productId: string) => boolean;
  calculateTimeRemaining: (endTime: Date) => { hours: number; minutes: number; seconds: number } | null;
}