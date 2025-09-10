import { test, expect, describe, beforeEach, vi } from 'bun:test';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { App } from './App';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;
(global as any).SVGElement = window.SVGElement;
(global as any).localStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

// Mock fetch for API calls
global.fetch = vi.fn(() =>
  Promise.reject(new Error('Network error - falling back to mock data'))
);

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  test('renders without crashing', async () => {
    const { getByText } = render(<App />);
    
    // Should show loading state initially
    expect(getByText('Loading products...')).toBeDefined();
    
    // Should eventually show the product catalog
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });
  });

  test('displays product catalog by default', async () => {
    const { getByText } = render(<App />);
    
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });
  });

  test('can navigate to cart view', async () => {
    const { getByText } = render(<App />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Find and click cart badge
    const cartBadge = getByText('Cart');
    fireEvent.click(cartBadge);
    
    // Should show cart view
    await waitFor(() => {
      expect(getByText('Shopping Cart')).toBeDefined();
      expect(getByText('Your cart is empty')).toBeDefined();
    });
  });

  test('can navigate back from cart to catalog', async () => {
    const { getByText } = render(<App />);
    
    // Wait for catalog to load
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    }, { timeout: 2000 });

    // Navigate to cart
    const cartBadge = getByText('Cart');
    fireEvent.click(cartBadge);
    
    await waitFor(() => {
      expect(getByText('Shopping Cart')).toBeDefined();
    });
    
    // Navigate back
    const continueShoppingBtn = getByText('Continue Shopping');
    fireEvent.click(continueShoppingBtn);
    
    await waitFor(() => {
      expect(getByText('Product Catalog')).toBeDefined();
    });
  });

  test('has proper app structure and styling', () => {
    render(<App />);
    
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeDefined();
    expect(container?.className).toContain('bg-gray-900');
    
    const mainContainer = document.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
  });
}); 