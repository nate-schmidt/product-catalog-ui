import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, cleanup, waitFor } from '@testing-library/react';
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

// Mock fetch for tests
const mockFetch = mock();
(global as any).fetch = mockFetch;

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    mockFetch.mockReset();
  });

  test('renders without crashing', () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    render(<App />);
  });

  test('displays the main heading', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { getByRole } = render(<App />);
    await waitFor(() => {
      const heading = getByRole('heading', { level: 1 });
      expect(heading).toBeDefined();
      expect(heading.textContent).toBe('Furniture Catalog');
    });
  });

  test('displays loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { getByText } = render(<App />);
    expect(getByText('Loading products...')).toBeDefined();
  });

  test('displays products when fetch succeeds', async () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Test Chair',
        description: 'A comfortable test chair',
        category: 'Seating',
        price: 299.99,
        stock: 5,
        dimensions: { width: 50, height: 100, depth: 50, unit: 'cm' },
        material: 'Wood',
        color: 'Brown',
        imageUrl: null,
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00',
        inStock: true,
      },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockProducts,
    });

    const { getByText } = render(<App />);
    
    await waitFor(() => {
      expect(getByText('Test Chair')).toBeDefined();
    });
  });

  test('displays error state when fetch fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Server Error',
    });

    const { getByText } = render(<App />);
    
    await waitFor(() => {
      expect(getByText('Failed to Load Products')).toBeDefined();
    });
  });

  test('displays empty state when no products', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { getByText } = render(<App />);
    
    await waitFor(() => {
      expect(getByText('No Products Available')).toBeDefined();
    });
  });

  test('has correct layout structure', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
  });
}); 