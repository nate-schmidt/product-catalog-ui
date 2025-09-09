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

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing and loads products', async () => {
    const mockedProducts = [
      { id: 1, name: 'Test', priceCents: 1000, stock: 5 },
    ];
    // @ts-ignore
    global.fetch = mock(async (url: string) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify(mockedProducts), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { getByText } = render(<App />);
    await waitFor(() => getByText('Test'));
  });

  test('displays the main heading', async () => {
    // @ts-ignore
    global.fetch = mock(async (url: string) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent?.includes('Flash Sales')).toBeTrue();
  });

  test('shows sale price when activeFlashSale is present', async () => {
    const mockedProducts = [
      { id: 1, name: 'Thing', priceCents: 2000, stock: 3, activeFlashSale: { salePriceCents: 1000, startAtMs: Date.now()-1000, endAtMs: Date.now()+60000 } },
    ];
    // @ts-ignore
    global.fetch = mock(async (url: string) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify(mockedProducts), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { getByText } = render(<App />);
    await waitFor(() => getByText('Thing'));
    expect(getByText('$10.00')).toBeDefined();
  });

  test('has correct CSS classes for styling', async () => {
    // @ts-ignore
    global.fetch = mock(async (url: string) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
  });

  test('heading has correct text color classes', async () => {
    // @ts-ignore
    global.fetch = mock(async (url: string) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify([]), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.className).toContain('text-white');
  });

  test('checkout button exists', async () => {
    const mockedProducts = [
      { id: 1, name: 'Thing', priceCents: 2000, stock: 3 },
    ];
    // @ts-ignore
    global.fetch = mock(async (url: string, init?: any) => {
      if (url === '/api/products') {
        return new Response(JSON.stringify(mockedProducts), { status: 200 });
      }
      if (url === '/api/checkout') {
        return new Response(JSON.stringify({ success: true, unitPriceCents: 2000, quantity: 1, totalPriceCents: 2000, usedFlashSale: false }), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    });
    const { getByText } = render(<App />);
    await waitFor(() => getByText('Buy now'));
    expect(getByText('Buy now')).toBeDefined();
  });
}); 