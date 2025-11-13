import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { type Product } from '../state/products';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders product name', () => {
    const onAddToCart = () => {};
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText('Test Product')).toBeDefined();
  });

  test('renders product description', () => {
    const onAddToCart = () => {};
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText('This is a test product description')).toBeDefined();
  });

  test('renders formatted price', () => {
    const onAddToCart = () => {};
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText(/\$99\.99/)).toBeDefined();
  });

  test('renders Add to Cart button', () => {
    const onAddToCart = () => {};
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText('Add to Cart')).toBeDefined();
  });

  test('calls onAddToCart when button is clicked', () => {
    const onAddToCart = () => {};
    let calledWith: Product | null = null;
    const handleAddToCart = (product: Product) => {
      calledWith = product;
    };

    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);

    expect(calledWith).toEqual(mockProduct);
  });

  test('handles different price formats correctly', () => {
    const onAddToCart = () => {};
    const expensiveProduct: Product = {
      ...mockProduct,
      price: 1299.99,
    };
    render(<ProductCard product={expensiveProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText(/\$1,299\.99/)).toBeDefined();
  });

  test('handles zero price', () => {
    const onAddToCart = () => {};
    const freeProduct: Product = {
      ...mockProduct,
      price: 0,
    };
    render(<ProductCard product={freeProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByText(/\$0\.00/)).toBeDefined();
  });

  test('renders with optional category', () => {
    const onAddToCart = () => {};
    const productWithCategory: Product = {
      ...mockProduct,
      category: 'Electronics',
    };
    render(<ProductCard product={productWithCategory} onAddToCart={onAddToCart} />);
    // Component should still render even with category (though it may not display it)
    expect(screen.getByText('Test Product')).toBeDefined();
  });
});
