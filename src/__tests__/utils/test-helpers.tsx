import React, { ReactElement } from 'react';
import { render, RenderOptions, cleanup } from '@testing-library/react';
import { CartProvider } from '../../contexts/CartContext';
import { Product, Cart, CartItem } from '../../types';

// Setup DOM environment for tests
import { Window } from 'happy-dom';

const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).HTMLInputElement = window.HTMLInputElement;
(global as any).HTMLButtonElement = window.HTMLButtonElement;

// Mock localStorage
const createMockStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
};

(global as any).localStorage = createMockStorage();

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialCartState?: Cart;
}

const AllTheProviders = ({ children, initialCartState }: { children: React.ReactNode; initialCartState?: Cart }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialCartState, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => <AllTheProviders initialCartState={initialCartState}>{children}</AllTheProviders>,
    ...renderOptions,
  });
};

// Test data factories
export const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'test-product-1',
  name: 'Test Product',
  price: 29.99,
  description: 'A test product for unit testing',
  image: 'https://example.com/test-image.jpg',
  category: 'electronics',
  inStock: true,
  rating: 4.5,
  reviewCount: 25,
  ...overrides,
});

export const createMockProducts = (count: number = 5): Product[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockProduct({
      id: `test-product-${index + 1}`,
      name: `Test Product ${index + 1}`,
      price: 19.99 + (index * 10),
      category: index % 2 === 0 ? 'electronics' : 'clothing',
      rating: 3 + (index * 0.3),
      reviewCount: 10 + (index * 5),
    })
  );
};

export const createMockCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'test-cart-item-1',
  product: createMockProduct(),
  quantity: 1,
  ...overrides,
});

export const createMockCart = (overrides: Partial<Cart> = {}): Cart => {
  const items = overrides.items || [createMockCartItem()];
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return {
    items,
    total,
    itemCount,
    ...overrides,
  };
};

export const createEmptyCart = (): Cart => ({
  items: [],
  total: 0,
  itemCount: 0,
});

// Mock functions
export const createMockFunctions = () => ({
  onQuickView: jest.fn(),
  onCheckout: jest.fn(),
  onQuantityChange: jest.fn(),
  onDismiss: jest.fn(),
  onProductQuickView: jest.fn(),
});

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Cleanup helper
export const cleanupAfterEach = () => {
  cleanup();
  document.body.innerHTML = '';
  document.body.style.overflow = 'unset';
  localStorage.clear();
  jest.clearAllMocks();
};

// Event helpers
export const createMockEvent = (overrides: any = {}) => ({
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    value: '',
    checked: false,
    ...overrides.target,
  },
  ...overrides,
});

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';