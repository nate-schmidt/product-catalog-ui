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

  test('renders product catalog component', () => {
    const { getByText } = render(<App />);
    // ProductCatalog shows "Loading products..." initially
    expect(getByText('Loading products...')).toBeDefined();
  });

  test('renders cart component', () => {
    const { getByText } = render(<App />);
    // Cart shows "Your Cart is Empty" initially
    expect(getByText('Your Cart is Empty')).toBeDefined();
  });

  test('has proper layout structure with padding and min-height', () => {
    const { container } = render(<App />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer.style.padding).toBe('2rem');
    expect(mainContainer.style.minHeight).toBe('100vh');
  });

  test('wraps components in CartProvider context', () => {
    // If CartProvider is working, the components should render without context errors
    const { getByText } = render(<App />);
    expect(getByText('Loading products...')).toBeDefined();
    expect(getByText('Your Cart is Empty')).toBeDefined();
  });
}); 