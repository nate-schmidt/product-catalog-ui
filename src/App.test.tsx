import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
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

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

(global as any).localStorage = localStorageMock;

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the main heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Product Catalog');
  });

  test('displays cart component', () => {
    const { getByText } = render(<App />);
    const cartHeading = getByText('Cart');
    expect(cartHeading).toBeDefined();
  });

  test('displays product catalog section', () => {
    const { getAllByText } = render(<App />);
    const catalogHeadings = getAllByText('Product Catalog');
    expect(catalogHeadings.length).toBeGreaterThan(0);
  });

  test('displays cart item count in header', () => {
    const { getByText } = render(<App />);
    const cartCount = getByText(/Cart \(0\)/);
    expect(cartCount).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
  });
});

describe('Cart functionality', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  test('cart starts empty', () => {
    const { getByText } = render(<App />);
    const emptyMessage = getByText('Your cart is empty');
    expect(emptyMessage).toBeDefined();
  });

  test('adding item to cart increments count', () => {
    const { getAllByText } = render(<App />);
    const addButtons = getAllByText('Add to Cart');
    
    fireEvent.click(addButtons[0]);
    
    const cartCount = screen.getByText(/Cart \(1\)/);
    expect(cartCount).toBeDefined();
  });

  test('adding same item twice increments quantity', () => {
    const { getAllByText } = render(<App />);
    const addButtons = getAllByText('Add to Cart');
    
    fireEvent.click(addButtons[0]);
    fireEvent.click(addButtons[0]);
    
    const cartCount = screen.getByText(/Cart \(2\)/);
    expect(cartCount).toBeDefined();
    
    const quantityDisplay = screen.getByText('2');
    expect(quantityDisplay).toBeDefined();
  });

  test('cart displays item details after adding', () => {
    const { getAllByText } = render(<App />);
    const addButtons = getAllByText('Add to Cart');
    
    fireEvent.click(addButtons[0]);
    
    const itemName = screen.getByText('iPhone 17');
    expect(itemName).toBeDefined();
  });

  test('cart shows subtotal', () => {
    const { getAllByText } = render(<App />);
    const addButtons = getAllByText('Add to Cart');
    
    fireEvent.click(addButtons[0]);
    
    const subtotal = screen.getByText(/Subtotal:/);
    expect(subtotal).toBeDefined();
  });
}); 