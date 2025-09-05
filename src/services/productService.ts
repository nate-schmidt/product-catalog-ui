import { api } from './api';
import { Product, ProductFilter } from '../types/product';

// Mock data for development - replace with real API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    description: 'Comfortable modern sofa perfect for any living room',
    price: 899.99,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    category: 'furniture',
    inStock: true,
    stockQuantity: 5,
  },
  {
    id: '2',
    name: 'Dining Table',
    description: 'Elegant wooden dining table that seats 6 people',
    price: 1299.99,
    imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=500',
    category: 'furniture',
    inStock: true,
    stockQuantity: 3,
  },
  {
    id: '3',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
    category: 'furniture',
    inStock: true,
    stockQuantity: 10,
  },
  {
    id: '4',
    name: 'Coffee Table',
    description: 'Stylish glass coffee table with metal frame',
    price: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    category: 'furniture',
    inStock: false,
    stockQuantity: 0,
  },
  {
    id: '5',
    name: 'Bookshelf',
    description: 'Large wooden bookshelf with 5 shelves',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0f755d13db8?w=500',
    category: 'furniture',
    inStock: true,
    stockQuantity: 7,
  },
  {
    id: '6',
    name: 'Bed Frame',
    description: 'Queen size wooden bed frame with headboard',
    price: 549.99,
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
    category: 'furniture',
    inStock: true,
    stockQuantity: 4,
  },
];

export const productService = {
  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    try {
      // In a real app, this would be: return api.get('/products');
      // For now, return mock data with simulated filtering
      let products = [...mockProducts];
      
      if (filters) {
        if (filters.category) {
          products = products.filter(p => p.category === filters.category);
        }
        if (filters.minPrice !== undefined) {
          products = products.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          products = products.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.inStock !== undefined) {
          products = products.filter(p => p.inStock === filters.inStock);
        }
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      // In a real app: return api.get(`/products/${id}`);
      const product = mockProducts.find(p => p.id === id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return product || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      // In a real app: return api.get('/products/categories');
      const categories = [...new Set(mockProducts.map(p => p.category))];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },
};