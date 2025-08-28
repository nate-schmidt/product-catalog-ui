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

  test('has responsive design classes', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
  });

  test('heading has proper typography classes', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.className).toContain('text-6xl');
    expect(heading.className).toContain('font-bold');
    expect(heading.className).toContain('mb-4');
  });

  test('subtitle has proper typography and layout classes', () => {
    const { getByText } = render(<App />);
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    expect(subtitle.className).toContain('text-2xl');
    expect(subtitle.className).toContain('max-w-2xl');
    expect(subtitle.className).toContain('leading-relaxed');
  });

  test('main container has proper height and spacing', () => {
    const { container } = render(<App />);
    const flexContainer = container.querySelector('.min-h-\\[60vh\\]');
    expect(flexContainer).toBeDefined();
    expect(flexContainer?.className).toContain('gap-8');
    expect(flexContainer?.className).toContain('justify-center');
  });

  test('has proper z-index for layering', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.relative');
    expect(mainContainer?.className).toContain('z-10');
  });

  test('renders emoji in heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('👋');
  });

  test('component exports are available', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  test('component renders without props', () => {
    // Test that component doesn't require any props
    expect(() => render(<App />)).not.toThrow();
  });

  test('accessibility: heading has proper level', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.tagName).toBe('H1');
  });

  test('accessibility: text content is readable', () => {
    const { getByRole, getByText } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    
    expect(heading.textContent).toBeTruthy();
    expect(subtitle.textContent).toBeTruthy();
    expect(heading.textContent?.length).toBeGreaterThan(0);
    expect(subtitle.textContent?.length).toBeGreaterThan(0);
  });
}); 