import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import ProductCatalog from './ProductCatalog';
import { CartProvider } from '../providers/CartProvider';
import { productApi } from '../services/api';
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

// Mock fetch
const mockFetch = mock(() => Promise.resolve({
  ok: true,
  json: async () => [],
} as Response));

(global as any).fetch = mockFetch;

describe('ProductCatalog Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
    mockFetch.mockClear();
  });

  test('displays loading state initially', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    expect(screen.getByText('Loading products...')).toBeDefined();
  });

  test('displays products after successful fetch', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeDefined();
    });

    expect(screen.getByText('Product 2')).toBeDefined();
  });

  test('displays error message on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading products/)).toBeDefined();
    });
  });

  test('displays error message on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error loading products/)).toBeDefined();
    });
  });

  test('displays empty state when no products are returned', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No products available')).toBeDefined();
    });
  });

  test('displays Product Catalog heading', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    expect(screen.getByText('Product Catalog')).toBeDefined();
  });

  test('calls API with correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(
      <CartProvider>
        <ProductCatalog />
      </CartProvider>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const calls = mockFetch.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0][0]).toContain('/api/products');
  });
});
