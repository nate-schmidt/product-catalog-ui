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
(global as any).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the header with Product Catalog title', () => {
    const { getByText } = render(<App />);
    const title = getByText('Product Catalog');
    expect(title).toBeDefined();
  });

  test('displays the main heading', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      const heading = getByText('Shop Our Collection');
      expect(heading).toBeDefined();
    });
  });

  test('has a cart button in header', () => {
    const { getByRole } = render(<App />);
    const cartButtons = document.querySelectorAll('button');
    expect(cartButtons.length).toBeGreaterThan(0);
  });
});
