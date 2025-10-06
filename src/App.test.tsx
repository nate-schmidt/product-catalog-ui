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

  test('renders header title', () => {
    const { getByRole } = render(<App />);
    const shopHeading = getByRole('heading', { name: 'My Shop', level: 1 });
    expect(shopHeading).toBeDefined();
  });

  test('renders products section title', () => {
    const { getByRole } = render(<App />);
    const productsHeading = getByRole('heading', { name: 'Our Products', level: 1 });
    expect(productsHeading).toBeDefined();
  });

  test('has header container styling classes', () => {
    const { container } = render(<App />);
    const headerContainer = container.querySelector('header .max-w-7xl');
    expect(headerContainer).toBeDefined();
    expect(headerContainer?.className).toContain('max-w-7xl');
    expect(headerContainer?.className).toContain('mx-auto');
    expect(headerContainer?.className).toContain('px-8');
    expect(headerContainer?.className).toContain('py-4');
    expect(headerContainer?.className).toContain('flex');
    expect(headerContainer?.className).toContain('items-center');
    expect(headerContainer?.className).toContain('justify-between');
  });

  test('shows Add to Cart buttons', () => {
    const { getAllByText } = render(<App />);
    const addButtons = getAllByText('Add to Cart');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  test('brand section has proper layout classes', () => {
    const { getByRole } = render(<App />);
    const shopHeading = getByRole('heading', { name: 'My Shop', level: 1 });
    const brandContainer = shopHeading.parentElement;
    expect(brandContainer).toBeDefined();
    expect(brandContainer?.className).toContain('flex');
    expect(brandContainer?.className).toContain('items-center');
  });
});