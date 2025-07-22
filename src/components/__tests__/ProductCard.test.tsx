import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Window } from 'happy-dom';
import ProductCard from '../ProductCard';
import { Product } from '../../types/Product';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('ProductCard', () => {
  const mockOnViewDetails = () => {};
  
  const mockProduct: Product = {
    id: '1',
    name: 'iPhone 16 Pro Max',
    manufacturer: 'Apple',
    description: 'The latest iPhone with advanced features',
    price: 1199,
    category: 'Smartphones',
    inStock: true,
    imageUrl: 'https://example.com/iphone.jpg'
  };

  const outOfStockProduct: Product = {
    ...mockProduct,
    id: '2',
    name: 'Out of Stock Product',
    inStock: false
  };

  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders product information correctly', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    expect(getByText('iPhone 16 Pro Max')).toBeDefined();
    expect(getByText('Apple')).toBeDefined();
    expect(getByText('The latest iPhone with advanced features')).toBeDefined();
    expect(getByText('$1,199.00')).toBeDefined();
  });

  test('displays correct stock status for in-stock product', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    const stockStatus = getByText('In Stock');
    expect(stockStatus).toBeDefined();
    expect(stockStatus.className).toContain('bg-green-100');
    expect(stockStatus.className).toContain('text-green-800');
  });

  test('displays correct stock status for out-of-stock product', () => {
    const { getByText } = render(
      <ProductCard product={outOfStockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    const stockStatus = getByText('Out of Stock');
    expect(stockStatus).toBeDefined();
    expect(stockStatus.className).toContain('bg-red-100');
    expect(stockStatus.className).toContain('text-red-800');
  });

  test('renders product image with correct attributes', () => {
    const { container } = render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    const img = container.querySelector('img');
    expect(img).toBeDefined();
    expect(img?.getAttribute('src')).toBe('https://example.com/iphone.jpg');
    expect(img?.getAttribute('alt')).toBe('iPhone 16 Pro Max');
    expect(img?.getAttribute('loading')).toBe('lazy');
  });

  test('uses fallback image when imageUrl is not provided', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: undefined };
    const { container } = render(
      <ProductCard product={productWithoutImage} onViewDetails={mockOnViewDetails} />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('unsplash.com');
  });

  test('calls onViewDetails when View Details button is clicked', () => {
    let capturedId = '';
    const mockHandler = (id: string) => { capturedId = id; };
    
    const { getByText } = render(
      <ProductCard product={mockProduct} onViewDetails={mockHandler} />
    );
    
    const button = getByText('View Details');
    fireEvent.click(button);
    
    expect(capturedId).toBe('1');
  });

  test('formats price correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 2499.99 };
    const { getByText } = render(
      <ProductCard product={expensiveProduct} onViewDetails={mockOnViewDetails} />
    );
    
    expect(getByText('$2,499.99')).toBeDefined();
  });

  test('has correct CSS classes for card styling', () => {
    const { container } = render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card?.className).toContain('bg-white');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('shadow-md');
    expect(card?.className).toContain('hover:shadow-lg');
  });

  test('button has correct hover and focus styles', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onViewDetails={mockOnViewDetails} />
    );
    
    const button = getByText('View Details');
    expect(button.className).toContain('bg-blue-600');
    expect(button.className).toContain('hover:bg-blue-700');
    expect(button.className).toContain('focus:ring-2');
    expect(button.className).toContain('focus:ring-blue-500');
  });
}); 