import { test, expect, describe, beforeEach } from 'bun:test';
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

// Mock fetch for API calls
(global as any).fetch = async (url: string, options?: any) => {
  if (url === '/api/inventory' && (!options || options.method === 'GET')) {
    return {
      ok: true,
      json: async () => [],
    };
  }
  return {
    ok: true,
    json: async () => ({}),
  };
};

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the inventory management heading', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      const heading = getByText('Inventory Management');
      expect(heading).toBeDefined();
    });
  });

  test('displays the subtitle text', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      const subtitle = getByText('Manage your product inventory');
      expect(subtitle).toBeDefined();
    });
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('min-h-screen');
    expect(mainContainer?.className).toContain('bg-gradient-to-br');
  });

  test('displays add new item button', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      const addButton = getByText(/Add New Item/i);
      expect(addButton).toBeDefined();
    });
  });

  test('has proper gradient background', () => {
    const { container } = render(<App />);
    const bgContainer = container.querySelector('.bg-gradient-to-br');
    expect(bgContainer).toBeDefined();
    expect(bgContainer?.className).toContain('from-gray-900');
    expect(bgContainer?.className).toContain('via-gray-800');
    expect(bgContainer?.className).toContain('to-gray-900');
  });
}); 