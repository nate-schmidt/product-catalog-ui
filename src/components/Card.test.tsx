import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Card } from './Card';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('Card', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const mockProduct = {
    id: 'test-product-1',
    title: 'Test Product',
    price: 29.99,
    description: 'A fantastic test product for all your testing needs',
    imageUrl: 'https://example.com/test-image.jpg'
  };

  test('renders without crashing', () => {
    render(<Card {...mockProduct} />);
  });

  test('displays product information correctly', () => {
    const { getByTestId } = render(<Card {...mockProduct} />);
    
    expect(getByTestId('product-title').textContent).toBe('Test Product');
    expect(getByTestId('product-description').textContent).toBe('A fantastic test product for all your testing needs');
    expect(getByTestId('product-price').textContent).toBe('$29.99');
  });

  test('renders product image when imageUrl is provided', () => {
    const { getByTestId } = render(<Card {...mockProduct} />);
    
    const image = getByTestId('product-image') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/test-image.jpg');
    expect(image.alt).toBe('Test Product');
  });

  test('does not render image when imageUrl is not provided', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: undefined };
    const { queryByTestId } = render(<Card {...productWithoutImage} />);
    
    expect(queryByTestId('product-image')).toBeNull();
  });

  test('formats price correctly with two decimal places', () => {
    const productWithIntPrice = { ...mockProduct, price: 25 };
    const { getByTestId } = render(<Card {...productWithIntPrice} />);
    
    expect(getByTestId('product-price').textContent).toBe('$25.00');
  });

  test('renders add to cart button when onAddToCart is provided', () => {
    const mockAddToCart = () => {};
    const { getByTestId } = render(<Card {...mockProduct} onAddToCart={mockAddToCart} />);
    
    const button = getByTestId('add-to-cart-button');
    expect(button).toBeDefined();
    expect(button.textContent).toBe('Add to Cart');
  });

  test('does not render add to cart button when onAddToCart is not provided', () => {
    const { queryByTestId } = render(<Card {...mockProduct} />);
    
    expect(queryByTestId('add-to-cart-button')).toBeNull();
  });

  test('calls onAddToCart with correct product id when button is clicked', () => {
    let capturedId = '';
    const mockAddToCart = (id: string) => {
      capturedId = id;
    };
    
    const { getByTestId } = render(<Card {...mockProduct} onAddToCart={mockAddToCart} />);
    
    fireEvent.click(getByTestId('add-to-cart-button'));
    expect(capturedId).toBe('test-product-1');
  });

  test('has correct CSS classes for styling', () => {
    const { getByTestId } = render(<Card {...mockProduct} />);
    
    const cardElement = getByTestId('product-card-test-product-1');
    expect(cardElement.className).toContain('bg-white');
    expect(cardElement.className).toContain('rounded-lg');
    expect(cardElement.className).toContain('shadow-md');
    expect(cardElement.className).toContain('hover:shadow-lg');
  });

  test('handles long product titles gracefully', () => {
    const longTitleProduct = {
      ...mockProduct,
      title: 'This is an extremely long product title that should still display correctly without breaking the layout'
    };
    
    const { getByTestId } = render(<Card {...longTitleProduct} />);
    expect(getByTestId('product-title').textContent).toBe(longTitleProduct.title);
  });

  test('handles very high prices correctly', () => {
    const expensiveProduct = { ...mockProduct, price: 9999.99 };
    const { getByTestId } = render(<Card {...expensiveProduct} />);
    
    expect(getByTestId('product-price').textContent).toBe('$9999.99');
  });

  test('handles zero price correctly', () => {
    const freeProduct = { ...mockProduct, price: 0 };
    const { getByTestId } = render(<Card {...freeProduct} />);
    
    expect(getByTestId('product-price').textContent).toBe('$0.00');
  });
});