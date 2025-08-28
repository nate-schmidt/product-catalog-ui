/**
 * Test utilities and helpers for better test organization
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Window } from 'happy-dom';
import { ReactElement } from 'react';

// Global DOM setup function
export function setupDOM() {
  const window = new Window();
  const document = window.document;

  (global as any).window = window;
  (global as any).document = document;
  (global as any).navigator = window.navigator;
  (global as any).HTMLElement = window.HTMLElement;
  (global as any).Element = window.Element;
  (global as any).Node = window.Node;

  return { window, document };
}

// Custom render function with common setup
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  const { document } = setupDOM();
  
  // Ensure body has root element if needed
  if (!document.getElementById('root')) {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  }

  return render(ui, options);
}

// Mock API response helper
export function createMockApiResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Mock fetch helper
export function createMockFetch<T>(responseData: T, status = 200) {
  return jest.fn(() => 
    Promise.resolve(createMockApiResponse(responseData, status))
  );
}

// Test data factories
export const testDataFactories = {
  product: (overrides = {}) => ({
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    image: 'https://example.com/image.jpg',
    category: 'electronics',
    inStock: true,
    ...overrides,
  }),

  cartItem: (overrides = {}) => ({
    id: 1,
    productId: 1,
    quantity: 1,
    price: 99.99,
    name: 'Test Product',
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  }),
};

// Async test helpers
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function waitForElement(querySelector: string, timeout = 1000): Promise<Element | null> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    const element = document.querySelector(querySelector);
    if (element) return element;
    await waitFor(10);
  }
  
  return null;
}

// CSS class testing helpers
export function expectElementToHaveClasses(element: Element | null, classes: string[]) {
  expect(element).toBeDefined();
  classes.forEach(className => {
    expect(element?.className).toContain(className);
  });
}

// Error boundary test helper
export function createErrorBoundaryWrapper() {
  class TestErrorBoundary extends Error {
    constructor(public componentStack: string) {
      super('Test error boundary');
    }
  }

  return TestErrorBoundary;
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { setupDOM as default };