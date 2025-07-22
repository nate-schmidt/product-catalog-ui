import { test, expect, describe } from 'bun:test';
import { products } from '../products';
import { Product } from '../../types/Product';

describe('Products Data', () => {
  test('products array is defined and not empty', () => {
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('all products have required fields', () => {
    products.forEach((product: Product) => {
      expect(typeof product.id).toBe('string');
      expect(product.id.length).toBeGreaterThan(0);
      
      expect(typeof product.name).toBe('string');
      expect(product.name.length).toBeGreaterThan(0);
      
      expect(typeof product.manufacturer).toBe('string');
      expect(product.manufacturer.length).toBeGreaterThan(0);
      
      expect(typeof product.description).toBe('string');
      expect(product.description.length).toBeGreaterThan(0);
      
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
      
      expect(typeof product.inStock).toBe('boolean');
    });
  });

  test('all products have unique IDs', () => {
    const ids = products.map(product => product.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(products.length);
  });

  test('products have valid image URLs when provided', () => {
    products.forEach((product: Product) => {
      if (product.imageUrl) {
        expect(typeof product.imageUrl).toBe('string');
        expect(product.imageUrl.startsWith('http')).toBe(true);
      }
    });
  });

  test('products have valid categories when provided', () => {
    products.forEach((product: Product) => {
      if (product.category) {
        expect(typeof product.category).toBe('string');
        expect(product.category.length).toBeGreaterThan(0);
      }
    });
  });

  test('includes expected manufacturers', () => {
    const manufacturers = products.map(product => product.manufacturer);
    const uniqueManufacturers = new Set(manufacturers);
    
    expect(uniqueManufacturers.has('Apple')).toBe(true);
    expect(uniqueManufacturers.has('Samsung')).toBe(true);
    expect(uniqueManufacturers.has('Sony')).toBe(true);
  });

  test('includes expected categories', () => {
    const categories = products
      .filter(product => product.category)
      .map(product => product.category);
    const uniqueCategories = new Set(categories);
    
    expect(uniqueCategories.has('Smartphones')).toBe(true);
    expect(uniqueCategories.has('Laptops')).toBe(true);
  });
}); 