import { describe, beforeEach, test as nodeTest, expect } from 'node:test';
import { render, cleanup } from '@testing-library/react';
import { App } from './App';
import { Window } from 'happy-dom';

// Augment global types for the test runtime
declare global {
  // eslint-disable-next-line no-var
  var window: Window & typeof globalThis;
  // eslint-disable-next-line no-var
  var document: Document;
  // eslint-disable-next-line no-var
  var navigator: Navigator;
}

const happyWindow = new Window();
const { document } = happyWindow;

globalThis.window = happyWindow as unknown as Window & typeof globalThis;
globalThis.document = document;
globalThis.navigator = happyWindow.navigator;
// Provide HTMLElement & Element for JSX runtime expectations
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.HTMLElement = happyWindow.HTMLElement;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.Element = happyWindow.Element;

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  nodeTest('renders without crashing', () => {
    render(<App />);
  });

  nodeTest('displays the main heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Product Catalog');
  });

  nodeTest('shows a cart badge with 0 items initially', () => {
    const { getByText } = render(<App />);
    const badge = getByText(/Cart \(0\)/);
    expect(badge).toBeDefined();
  });

  nodeTest('adds item to cart when button clicked', () => {
    const { getAllByRole, getByText } = render(<App />);
    const addButtons = getAllByRole('button', { name: 'Add to Cart' });

    // Click first product's add button
    addButtons[0].click();

    const badge = getByText(/Cart \(1\)/);
    expect(badge).toBeDefined();
  });
}); 