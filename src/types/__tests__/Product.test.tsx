import { test, expect, describe } from 'bun:test';
import { Product, SearchFilters } from '../Product';

describe('Product Types', () => {
  test('Product interface has correct structure', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      manufacturer: 'Test Manufacturer',
      description: 'Test Description',
      price: 99.99,
      inStock: true,
      imageUrl: 'https://example.com/image.jpg',
      category: 'Test Category'
    };

    expect(typeof mockProduct.id).toBe('string');
    expect(typeof mockProduct.name).toBe('string');
    expect(typeof mockProduct.manufacturer).toBe('string');
    expect(typeof mockProduct.description).toBe('string');
    expect(typeof mockProduct.price).toBe('number');
    expect(typeof mockProduct.inStock).toBe('boolean');
    expect(typeof mockProduct.imageUrl).toBe('string');
    expect(typeof mockProduct.category).toBe('string');
  });

  test('Product interface allows optional fields', () => {
    const minimalProduct: Product = {
      id: '1',
      name: 'Test Product',
      manufacturer: 'Test Manufacturer',
      description: 'Test Description',
      price: 99.99,
      inStock: true
    };

    expect(minimalProduct.imageUrl).toBeUndefined();
    expect(minimalProduct.category).toBeUndefined();
  });

  test('SearchFilters interface has correct structure', () => {
    const mockFilters: SearchFilters = {
      query: 'test query',
      manufacturer: 'Apple',
      category: 'Smartphones',
      minPrice: 100,
      maxPrice: 1000
    };

    expect(typeof mockFilters.query).toBe('string');
    expect(typeof mockFilters.manufacturer).toBe('string');
    expect(typeof mockFilters.category).toBe('string');
    expect(typeof mockFilters.minPrice).toBe('number');
    expect(typeof mockFilters.maxPrice).toBe('number');
  });

  test('SearchFilters allows minimal structure', () => {
    const minimalFilters: SearchFilters = {
      query: 'test'
    };

    expect(typeof minimalFilters.query).toBe('string');
    expect(minimalFilters.manufacturer).toBeUndefined();
    expect(minimalFilters.category).toBeUndefined();
    expect(minimalFilters.minPrice).toBeUndefined();
    expect(minimalFilters.maxPrice).toBeUndefined();
  });
}); 