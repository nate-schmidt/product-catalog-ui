/// <reference types="vitest" />
import { describe, beforeEach, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('renders without crashing', () => {
    render(<App />);
  });

  it('displays the main heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Product Catalog');
  });

  it('shows a cart badge with 0 items initially', () => {
    const { getByText } = render(<App />);
    const badge = getByText(/Cart \(0\)/);
    expect(badge).toBeDefined();
  });

  it('adds item to cart when button clicked', () => {
    const { getAllByRole, getByText } = render(<App />);
    const addButtons = getAllByRole('button', { name: 'Add to Cart' });

    // Click first product's add button
    addButtons[0].click();

    const badge = getByText(/Cart \(1\)/);
    expect(badge).toBeDefined();
  });
}); 