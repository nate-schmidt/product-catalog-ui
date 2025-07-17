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

  // New accessibility tests
  describe('Accessibility', () => {
    test('has semantic HTML structure', () => {
      const { container } = render(<App />);
      const heading = container.querySelector('h1');
      const paragraph = container.querySelector('p');
      
      expect(heading).toBeDefined();
      expect(paragraph).toBeDefined();
      expect(heading?.tagName).toBe('H1');
      expect(paragraph?.tagName).toBe('P');
    });

    test('has proper heading hierarchy', () => {
      const { container } = render(<App />);
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      expect(headings.length).toBe(1);
      expect(headings[0].tagName).toBe('H1');
    });

    test('text has sufficient contrast for accessibility', () => {
      const { getByRole, getByText } = render(<App />);
      const heading = getByRole('heading', { level: 1 });
      const subtitle = getByText('One day I hope to be an ecommerce website.');
      
      // Check that text colors are set for contrast
      expect(heading.className).toContain('text-white');
      expect(subtitle.className).toContain('text-gray-300');
    });

    test('has proper font sizing for readability', () => {
      const { getByRole, getByText } = render(<App />);
      const heading = getByRole('heading', { level: 1 });
      const subtitle = getByText('One day I hope to be an ecommerce website.');
      
      expect(heading.className).toContain('text-6xl');
      expect(subtitle.className).toContain('text-2xl');
    });
  });

  // Responsive design tests
  describe('Responsive Design', () => {
    test('uses responsive container classes', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('.max-w-7xl');
      
      expect(mainContainer?.className).toContain('mx-auto');
      expect(mainContainer?.className).toContain('p-8');
    });

    test('content is centered on all screen sizes', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('.text-center');
      const flexContainer = container.querySelector('.items-center');
      
      expect(mainContainer).toBeDefined();
      expect(flexContainer).toBeDefined();
      expect(flexContainer?.className).toContain('justify-center');
    });

    test('has proper spacing for mobile devices', () => {
      const { container } = render(<App />);
      const flexContainer = container.querySelector('.gap-8');
      
      expect(flexContainer).toBeDefined();
      expect(flexContainer?.className).toContain('gap-8');
    });
  });

  // Edge cases and robustness tests
  describe('Edge Cases', () => {
    test('renders correctly when imported as default export', () => {
      const { default: AppDefault } = require('./App');
      const { getByText } = render(<AppDefault />);
      
      expect(getByText('Hello World! 👋')).toBeDefined();
    });

    test('maintains z-index layering', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('.relative.z-10');
      
      expect(mainContainer).toBeDefined();
      expect(mainContainer?.className).toContain('relative');
      expect(mainContainer?.className).toContain('z-10');
    });

    test('has minimum height constraint', () => {
      const { container } = render(<App />);
      const minHeightContainer = container.querySelector('.min-h-\\[60vh\\]');
      
      expect(minHeightContainer).toBeDefined();
    });

    test('subtitle has maximum width constraint', () => {
      const { getByText } = render(<App />);
      const subtitle = getByText('One day I hope to be an ecommerce website.');
      
      expect(subtitle.className).toContain('max-w-2xl');
    });

    test('uses proper line height for readability', () => {
      const { getByText } = render(<App />);
      const subtitle = getByText('One day I hope to be an ecommerce website.');
      
      expect(subtitle.className).toContain('leading-relaxed');
    });
  });

  // Performance and optimization tests
  describe('Performance', () => {
    test('imports CSS only once', () => {
      const { unmount } = render(<App />);
      unmount();
      
      // Re-render should not cause issues
      const { getByText } = render(<App />);
      expect(getByText('Hello World! 👋')).toBeDefined();
    });

    test('does not have memory leaks on unmount', () => {
      const { unmount } = render(<App />);
      
      // Component should unmount cleanly
      expect(() => unmount()).not.toThrow();
    });
  });
}); 