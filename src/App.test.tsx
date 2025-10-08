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
    expect(heading.textContent).toBe('Welcome to ShopFlash ⚡');
  });

  test('displays the subtitle text', () => {
    const { getByText } = render(<App />);
    const subtitle = getByText('Your destination for incredible flash deals and unbeatable prices!');
    expect(subtitle).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('text-center');
  });

  test('has correct text color classes', () => {
    const { getByRole, getByText } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    const subtitle = getByText('Your destination for incredible flash deals and unbeatable prices!');
    
    expect(heading.className).toContain('text-transparent');
    expect(heading.className).toContain('bg-clip-text');
    expect(subtitle.className).toContain('text-gray-300');
  });

  test('has proper layout structure', () => {
    const { getAllByRole, container } = render(<App />);
    const h1s = getAllByRole('heading', { level: 1 });
    expect(h1s.length).toBe(1);
    const heroContainer = container.querySelector('.max-w-7xl');
    expect(heroContainer).toBeDefined();
    expect(heroContainer?.className).toContain('text-center');
  });
}); 