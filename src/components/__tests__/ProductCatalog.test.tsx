import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { Window } from 'happy-dom';
import ProductCatalog from '../ProductCatalog';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('ProductCatalog', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing', () => {
    render(<ProductCatalog />);
  });

  test('shows loading state initially', () => {
    const { getByText } = render(<ProductCatalog />);
    expect(getByText('Loading products...')).toBeDefined();
  });

  test('has correct CSS classes for main container', () => {
    const { container } = render(<ProductCatalog />);
    const mainContainer = container.querySelector('.min-h-screen');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('bg-gray-50');
  });
}); 