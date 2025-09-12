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
    expect(heading.textContent).toBe('Furniture Store');
  });

  test('displays the subtitle text', () => {
    const { getByText } = render(<App />);
    const subtitle = getByText('Welcome to our store!');
    expect(subtitle).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const headerContainer = container.querySelector('header .max-w-7xl');
    expect(headerContainer).toBeDefined();
    expect(headerContainer?.className).toContain('max-w-7xl');
    expect(headerContainer?.className).toContain('mx-auto');
    expect(headerContainer?.className).toContain('px-4');
  });

  test('has correct text color classes', () => {
    const { getByRole, getByText } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    const subtitle = getByText('Welcome to our store!');
    
    expect(heading.className).toContain('text-gray-900');
    expect(subtitle.className).toContain('text-gray-600');
  });

  test('has proper layout structure', () => {
    const { getByRole } = render(<App />);
    const flexContainer = getByRole('heading', { level: 1 }).parentElement;
    expect(flexContainer).toBeDefined();
    expect(flexContainer?.className).toContain('flex');
    expect(flexContainer?.className).toContain('items-center');
  });
}); 