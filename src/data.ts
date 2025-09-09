import { Product, Coupon } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center',
    category: 'Electronics',
    stock: 25
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor and GPS.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center',
    category: 'Electronics',
    stock: 15
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with programmable timer and thermal carafe.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&crop=center',
    category: 'Appliances',
    stock: 30
  },
  {
    id: '4',
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat with extra cushioning for comfort.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1592432678016-e910d4d95b30?w=400&h=400&fit=crop&crop=center',
    category: 'Fitness',
    stock: 50
  },
  {
    id: '5',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for ergonomic workspace setup.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center',
    category: 'Accessories',
    stock: 40
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker with 360-degree sound.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&crop=center',
    category: 'Electronics',
    stock: 35
  }
];

export const coupons: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    description: '10% off your first order',
    minOrderAmount: 50,
    isActive: true,
    usageLimit: 100,
    usedCount: 25
  },
  {
    code: 'SAVE25',
    type: 'fixed',
    value: 25,
    description: '$25 off orders over $200',
    minOrderAmount: 200,
    isActive: true,
    usageLimit: 50,
    usedCount: 12
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 15,
    description: 'Free shipping (save $15)',
    minOrderAmount: 100,
    isActive: true,
    usageLimit: 200,
    usedCount: 89
  },
  {
    code: 'BIGDEAL',
    type: 'percentage',
    value: 20,
    description: '20% off everything',
    maxDiscount: 100,
    isActive: true,
    usageLimit: 25,
    usedCount: 18
  },
  {
    code: 'EXPIRED',
    type: 'percentage',
    value: 15,
    description: '15% off (expired)',
    expiryDate: new Date('2024-12-31'),
    isActive: false,
    usageLimit: 50,
    usedCount: 50
  }
];