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
    expect(heading.textContent).toBe('Hello World! 👋');
  });

  test('displays the subtitle text', () => {
    const { getByText } = render(<App />);
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    expect(subtitle).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
    expect(mainContainer?.className).toContain('text-center');
  });

  test('has correct text color classes', () => {
    const { getByRole, getByText } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    
    expect(heading.className).toContain('text-white');
    expect(subtitle.className).toContain('text-gray-300');
  });

  test('has proper layout structure', () => {
    const { getByRole } = render(<App />);
    const flexContainer = getByRole('heading', { level: 1 }).parentElement;
    expect(flexContainer).toBeDefined();
    expect(flexContainer?.className).toContain('flex');
    expect(flexContainer?.className).toContain('flex-col');
    expect(flexContainer?.className).toContain('items-center');
  });

  test('renders with correct semantic HTML structure', () => {
    const { container } = render(<App />);
    
    // Check for proper heading hierarchy
    const h1 = container.querySelector('h1');
    expect(h1).toBeDefined();
    expect(h1?.tagName).toBe('H1');
    
    // Check for paragraph element
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeDefined();
    expect(paragraph?.tagName).toBe('P');
  });

  test('applies responsive design classes correctly', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
  });

  test('has proper z-index for layering', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.relative');
    
    expect(mainContainer?.className).toContain('relative');
    expect(mainContainer?.className).toContain('z-10');
  });

  test('uses proper spacing and sizing classes', () => {
    const { container } = render(<App />);
    
    // Check inner container spacing
    const innerContainer = container.querySelector('.min-h-\\[60vh\\]');
    expect(innerContainer?.className).toContain('gap-8');
    expect(innerContainer?.className).toContain('justify-center');
    
    // Check heading spacing
    const heading = container.querySelector('h1');
    expect(heading?.className).toContain('mb-4');
    expect(heading?.className).toContain('text-6xl');
    expect(heading?.className).toContain('font-bold');
  });

  test('paragraph has correct styling and constraints', () => {
    const { getByText } = render(<App />);
    const paragraph = getByText('One day I hope to be an ecommerce website.');
    
    expect(paragraph.className).toContain('text-2xl');
    expect(paragraph.className).toContain('text-gray-300');
    expect(paragraph.className).toContain('max-w-2xl');
    expect(paragraph.className).toContain('leading-relaxed');
  });

  test('component exports are properly defined', () => {
    // Test both named and default exports
    expect(typeof App).toBe('function');
    
    // Verify component returns JSX
    const result = App();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  test('component handles re-rendering correctly', () => {
    const { rerender, getByRole } = render(<App />);
    
    // Initial render
    let heading = getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Hello World! 👋');
    
    // Re-render should produce same result
    rerender(<App />);
    heading = getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Hello World! 👋');
  });

  test('component is accessible', () => {
    const { getByRole } = render(<App />);
    
    // Check for proper heading role
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    
    // Verify heading level is correct for accessibility
    expect(heading.tagName).toBe('H1');
  });
}); 