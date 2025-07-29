/**
 * Sample product data for demonstrating the product catalog components
 * 
 * This file contains mock data that can be used to test and showcase
 * the ProductCard, ProductGrid, and other product-related components.
 */

import { Product } from '../types/Product';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 19999, // $199.99 in cents
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    tags: ['new', 'premium'],
    slug: 'premium-wireless-headphones',
    variants: [
      { id: '1-black', name: 'Black', type: 'color', priceModifier: 0, inStock: true },
      { id: '1-white', name: 'White', type: 'color', priceModifier: 0, inStock: true },
      { id: '1-blue', name: 'Blue', type: 'color', priceModifier: 500, inStock: false }
    ]
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
    price: 29999, // $299.99 in cents
    category: 'Furniture',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    ],
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
    tags: ['ergonomic', 'office'],
    slug: 'ergonomic-office-chair'
  },
  {
    id: '3',
    name: 'Smartphone Pro Max',
    description: 'Latest smartphone with advanced camera system and lightning-fast performance.',
    price: 99999, // $999.99 in cents
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1512499617640-c2f999943bfb?w=500'
    ],
    inStock: false,
    rating: 4.8,
    reviewCount: 342,
    tags: ['premium', 'bestseller'],
    slug: 'smartphone-pro-max',
    variants: [
      { id: '3-128gb', name: '128GB', type: 'storage', priceModifier: 0, inStock: false },
      { id: '3-256gb', name: '256GB', type: 'storage', priceModifier: 10000, inStock: false },
      { id: '3-512gb', name: '512GB', type: 'storage', priceModifier: 20000, inStock: false }
    ]
  },
  {
    id: '4',
    name: 'Coffee Maker Deluxe',
    description: 'Professional-grade coffee maker with programmable brewing and thermal carafe.',
    price: 15999, // $159.99 in cents
    category: 'Kitchen',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
    ],
    inStock: true,
    rating: 4.0,
    reviewCount: 67,
    tags: ['kitchen', 'coffee'],
    slug: 'coffee-maker-deluxe'
  },
  {
    id: '5',
    name: 'Running Shoes Ultra',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh upper.',
    price: 12999, // $129.99 in cents
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 156,
    tags: ['sports', 'running'],
    slug: 'running-shoes-ultra',
    variants: [
      { id: '5-us8', name: 'US 8', type: 'size', priceModifier: 0, inStock: true },
      { id: '5-us9', name: 'US 9', type: 'size', priceModifier: 0, inStock: true },
      { id: '5-us10', name: 'US 10', type: 'size', priceModifier: 0, inStock: true },
      { id: '5-us11', name: 'US 11', type: 'size', priceModifier: 0, inStock: false }
    ]
  },
  {
    id: '6',
    name: 'Laptop Stand Aluminum',
    description: 'Adjustable aluminum laptop stand for improved ergonomics and heat dissipation.',
    price: 4999, // $49.99 in cents
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 203,
    tags: ['accessories', 'ergonomic', 'sale'],
    slug: 'laptop-stand-aluminum'
  },
  {
    id: '7',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 3999, // $39.99 in cents
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500'
    ],
    inStock: true,
    rating: 4.1,
    reviewCount: 94,
    tags: ['wireless', 'charging'],
    slug: 'wireless-charging-pad'
  },
  {
    id: '8',
    name: 'Desk Organizer Bamboo',
    description: 'Sustainable bamboo desk organizer with multiple compartments for office supplies.',
    price: 2999, // $29.99 in cents
    category: 'Office',
    images: [
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500'
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 78,
    tags: ['office', 'sustainable', 'bamboo'],
    slug: 'desk-organizer-bamboo'
  }
];

/**
 * Sample product categories for navigation and filtering
 */
export const productCategories = [
  'All Products',
  'Electronics',
  'Furniture', 
  'Kitchen',
  'Sports',
  'Accessories',
  'Office'
];

/**
 * Helper function to get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'All Products') {
    return sampleProducts;
  }
  return sampleProducts.filter(product => product.category === category);
};

/**
 * Helper function to search products by name or description
 */
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return sampleProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};