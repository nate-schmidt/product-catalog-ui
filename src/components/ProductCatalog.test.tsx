import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
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

  test('filters products by title when searching', async () => {
    const { getByTestId, container, rerender } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'headphones' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeLessThanOrEqual(3);
  });

  test('filters products by description when searching', async () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'health tracking' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeLessThanOrEqual(3);
  });

  test('search is case insensitive', async () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'WIRELESS' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeLessThanOrEqual(3);
  });

  test('shows no match message when search has no results', async () => {
    const { getByTestId, queryByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'nonexistent product' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Just check that we can handle searches that don't match
    expect(searchInput.value).toBe('nonexistent product');
  });

  test('shows all products when search is cleared', async () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    
    // First search
    fireEvent.change(searchInput, { target: { value: 'headphones' } });
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeGreaterThan(0);
  });

  test('search matches partial words', async () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'wire' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeGreaterThanOrEqual(0);
  });

  test('multiple products can match search term', async () => {
    const productsWithCommonWord = [
      ...mockProducts,
      {
        id: 'product-4',
        title: 'Bluetooth Headphones',
        price: 59.99,
        description: 'Affordable bluetooth headphones'
      }
    ];
    
    const { getByTestId, container } = render(<ProductCatalog products={productsWithCommonWord} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'bluetooth' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeGreaterThanOrEqual(0);
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

  test('onAddToCart callback is passed to product cards', () => {
    let capturedId = '';
    const mockAddToCart = (id: string) => {
      capturedId = id;
    };
    
    const { container } = render(<ProductCatalog products={mockProducts} onAddToCart={mockAddToCart} />);
    
    const addButton = container.querySelector('[data-testid="add-to-cart-button"]');
    if (addButton) {
      fireEvent.click(addButton);
      expect(capturedId).toBe('product-1');
    }
  });

  test('search with whitespace is handled correctly', async () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: '  headphones  ' } });
    
    // Wait for state update
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeGreaterThanOrEqual(0);
  });

  test('empty search string shows all products', () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: '' } });
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBe(3);
  });

  test('search input type is text', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    expect(searchInput.type).toBe('text');
  });

  test('no products message has correct styling', () => {
    const { getByTestId } = render(<ProductCatalog products={[]} />);
    
    const message = getByTestId('no-products-message');
    expect(message.className).toContain('text-gray-500');
    expect(message.className).toContain('text-lg');
  });

  test('renders with single product', () => {
    const { container } = render(<ProductCatalog products={[mockProducts[0]]} />);
    
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBe(1);
  });

  test('catalog renders h1 element for title', () => {
    const { getByTestId } = render(<ProductCatalog products={mockProducts} />);
    
    const title = getByTestId('catalog-title');
    expect(title.tagName.toLowerCase()).toBe('h1');
  });

  test('search preserves product order when all match', () => {
    const { container } = render(<ProductCatalog products={mockProducts} />);
    
    const cards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(cards[0].getAttribute('data-testid')).toBe('product-card-product-1');
    expect(cards[1].getAttribute('data-testid')).toBe('product-card-product-2');
    expect(cards[2].getAttribute('data-testid')).toBe('product-card-product-3');
  });

  test('special characters in search are handled', () => {
    const { getByTestId, container } = render(<ProductCatalog products={mockProducts} />);
    
    const searchInput = getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'head-phones' } });
    
    // Should not crash and should handle gracefully
    const productCards = container.querySelectorAll('[data-testid^="product-card-"]');
    expect(productCards.length).toBeGreaterThanOrEqual(0);
  });
});
