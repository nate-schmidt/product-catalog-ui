import { FlashSale } from '../types/product';

// Set flash sale to end 2 hours from now
const endTime = new Date();
endTime.setHours(endTime.getHours() + 2);

// Set flash sale to start 1 hour ago
const startTime = new Date();
startTime.setHours(startTime.getHours() - 1);

export const currentFlashSale: FlashSale = {
  id: 'flash-sale-1',
  title: '⚡ MEGA FLASH SALE',
  startTime,
  endTime,
  isActive: true,
  products: [
    {
      id: 'prod-1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality sound with active noise cancellation and 40-hour battery life',
      originalPrice: 299.99,
      currentPrice: 149.99,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      stock: 15,
      rating: 4.8,
    },
    {
      id: 'prod-2',
      name: 'Smart Watch Pro',
      description: 'Track your fitness goals with GPS, heart rate monitor, and sleep tracking',
      originalPrice: 399.99,
      currentPrice: 199.99,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Wearables',
      stock: 8,
      rating: 4.6,
    },
    {
      id: 'prod-3',
      name: 'Ultra HD 4K Camera',
      description: 'Professional photography with 24MP sensor and 4K video recording',
      originalPrice: 799.99,
      currentPrice: 479.99,
      discount: 40,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
      category: 'Photography',
      stock: 12,
      rating: 4.9,
    },
    {
      id: 'prod-4',
      name: 'Gaming Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with tactile switches for gaming',
      originalPrice: 159.99,
      currentPrice: 79.99,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop',
      category: 'Gaming',
      stock: 25,
      rating: 4.7,
    },
    {
      id: 'prod-5',
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof speaker with 360° sound and 20-hour battery',
      originalPrice: 129.99,
      currentPrice: 64.99,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
      category: 'Audio',
      stock: 18,
      rating: 4.5,
    },
    {
      id: 'prod-6',
      name: 'Laptop Stand Pro',
      description: 'Ergonomic aluminum stand for better posture and airflow',
      originalPrice: 79.99,
      currentPrice: 39.99,
      discount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
      category: 'Accessories',
      stock: 30,
      rating: 4.4,
    },
  ],
};
