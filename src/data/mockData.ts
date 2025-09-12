import { Product, FlashSale } from '../types/flashSales';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    originalPrice: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockCount: 50
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor and GPS',
    originalPrice: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockCount: 25
  },
  {
    id: 'prod-3',
    name: 'Premium Coffee Beans',
    description: 'Single-origin Ethiopian coffee beans, freshly roasted',
    originalPrice: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    category: 'Food & Beverage',
    inStock: true,
    stockCount: 100
  },
  {
    id: 'prod-4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic chair with lumbar support and adjustable height',
    originalPrice: 449.99,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'Furniture',
    inStock: true,
    stockCount: 15
  },
  {
    id: 'prod-5',
    name: 'Organic Skincare Set',
    description: 'Complete organic skincare routine with cleanser, toner, and moisturizer',
    originalPrice: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    category: 'Beauty',
    inStock: true,
    stockCount: 75
  }
];

// Generate flash sales with some starting soon and some active
const now = new Date();
const oneHour = 60 * 60 * 1000;
const twoHours = 2 * 60 * 60 * 1000;
const fourHours = 4 * 60 * 60 * 1000;

export const mockFlashSales: FlashSale[] = [
  {
    id: 'flash-1',
    productId: 'prod-1',
    product: mockProducts[0],
    discountPercentage: 40,
    flashPrice: 179.99,
    startTime: new Date(now.getTime() - oneHour), // Started 1 hour ago
    endTime: new Date(now.getTime() + twoHours), // Ends in 2 hours
    maxQuantity: 20,
    soldQuantity: 8,
    isActive: true,
    title: '🎧 Flash Sale: Premium Headphones',
    description: 'Limited time offer - 40% off!'
  },
  {
    id: 'flash-2',
    productId: 'prod-2',
    product: mockProducts[1],
    discountPercentage: 35,
    flashPrice: 259.99,
    startTime: new Date(now.getTime() + 30 * 60 * 1000), // Starts in 30 minutes
    endTime: new Date(now.getTime() + fourHours), // Ends in 4 hours
    maxQuantity: 15,
    soldQuantity: 0,
    isActive: false,
    title: '⌚ Coming Soon: Smart Watch Deal',
    description: 'Get ready for 35% off!'
  },
  {
    id: 'flash-3',
    productId: 'prod-3',
    product: mockProducts[2],
    discountPercentage: 50,
    flashPrice: 12.49,
    startTime: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
    endTime: new Date(now.getTime() + oneHour), // Ends in 1 hour
    maxQuantity: 50,
    soldQuantity: 23,
    isActive: true,
    title: '☕ Coffee Flash Sale',
    description: 'Half price on premium beans!'
  },
  {
    id: 'flash-4',
    productId: 'prod-5',
    product: mockProducts[4],
    discountPercentage: 60,
    flashPrice: 35.99,
    startTime: new Date(now.getTime() - 15 * 60 * 1000), // Started 15 minutes ago
    endTime: new Date(now.getTime() + 45 * 60 * 1000), // Ends in 45 minutes
    maxQuantity: 30,
    soldQuantity: 18,
    isActive: true,
    title: '✨ Beauty Flash Sale',
    description: 'Massive 60% discount!'
  }
];