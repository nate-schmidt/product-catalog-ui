import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
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

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the main heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Product Catalog');
  });

  test('shows a cart badge with 0 items initially', () => {
    const { getByText } = render(<App />);
    const badge = getByText(/Cart \(0\)/);
    expect(badge).toBeDefined();
  });

  test('adds item to cart when button clicked', () => {
    const { getAllByRole, getByText } = render(<App />);
    const addButtons = getAllByRole('button', { name: 'Add to Cart' });

    // Click first product's add button
    addButtons[0].click();

    const badge = getByText(/Cart \(1\)/);
    expect(badge).toBeDefined();
  });
}); 