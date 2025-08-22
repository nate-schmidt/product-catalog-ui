import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { ProductCatalog } from './ProductCatalog';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('ProductCatalog', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const mockProducts = [
    {
      id: 'product-1',
      title: 'Wireless Headphones',
      price: 99.99,
      description: 'High-quality wireless headphones with noise cancellation',
      imageUrl: 'https://example.com/headphones.jpg'
    },
    {
      id: 'product-2',
      title: 'Smart Watch',
      price: 249.99,
      description: 'Feature-rich smartwatch with health tracking',
      imageUrl: 'https://example.com/watch.jpg'
    },
    {
      id: 'product-3',
      title: 'Bluetooth Speaker',
      price: 79.99,
      description: 'Portable speaker with excellent sound quality'
    }
  ];

  test('renders without crashing', () => {
    render(<ProductCatalog />);
  });

  test('displays default title when no title prop is provided', () => {
    const { getByTestId } = render(<ProductCatalog />);
    
    expect(getByTestId('catalog-title').textContent).toBe('Product Catalog');
  });

  test('displays custom title when title prop is provided', () => {
    const { getByTestId } = render(<ProductCatalog title="My Custom Catalog" />);
    
    expect(getByTestId('catalog-title').textContent).toBe('My Custom Catalog');
  });

  test('renders search input', () => {
    const { getByTestId } = render(<ProductCatalog />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    expect(searchInput).toBeDefined();
    expect(searchInput.placeholder).toBe('Search products...');
  });

  test('displays no products message when products array is empty', () => {
    const { getByTestId } = render(<ProductCatalog products={[]} />);
    
    expect(getByTestId('no-products-message').textContent).toBe('No products available.');
  });

  test('displays no products message when no products prop is provided', () => {
    const { getByTestId } = render(<ProductCatalog />);
    
    expect(getByTestId('no-products-message').textContent).toBe('No products available.');
  });

  test('renders products grid when products are provided', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    expect(getByTestId('products-grid')).toBeDefined();
  });

  test('renders correct number of product cards', () => {
    const { container } = render(<ProductCatalog products={mockProducts} />);
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBe(3);
  });

  test('search input updates value when typed in', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  test('has correct grid layout classes', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const grid = getByTestId('products-grid');
    expect(grid.className).toContain('grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('md:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
    expect(grid.className).toContain('xl:grid-cols-4');
    expect(grid.className).toContain('gap-6');
  });

  test('has correct container styling', () => {
    const { container } = render(<ProductCatalog products={mockProducts} />);
    
    const mainContainer = container.firstElementChild;
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-6');
  });

  test('catalog title has correct styling', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const title = getByTestId('catalog-title');
    expect(title.className).toContain('text-3xl');
    expect(title.className).toContain('font-bold');
    expect(title.className).toContain('text-gray-900');
    expect(title.className).toContain('text-center');
  });

  test('search input has correct styling', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input');
    expect(searchInput.className).toContain('w-full');
    expect(searchInput.className).toContain('max-w-md');
    expect(searchInput.className).toContain('mx-auto');
    expect(searchInput.className).toContain('block');
    expect(searchInput.className).toContain('px-4');
    expect(searchInput.className).toContain('py-2');
  });
});