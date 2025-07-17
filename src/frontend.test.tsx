import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { Window } from 'happy-dom';

describe('Frontend Entry Point', () => {
  let window: any;
  let document: any;
  let originalDocument: any;
  let originalWindow: any;
  let rootElement: HTMLElement;
  let consoleErrors: any[] = [];
  let originalConsoleError: any;

  beforeEach(() => {
    // Save originals
    originalDocument = global.document;
    originalWindow = global.window;
    originalConsoleError = console.error;

    // Setup DOM environment
    window = new Window();
    document = window.document;
    
    // Setup globals
    (global as any).window = window;
    (global as any).document = document;
    (global as any).navigator = window.navigator;
    (global as any).HTMLElement = window.HTMLElement;
    (global as any).Element = window.Element;

    // Create root element
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Capture console errors
    consoleErrors = [];
    console.error = (...args: any[]) => {
      consoleErrors.push(args);
    };

    // Mock React modules
    const React = require('react');
    const ReactDOM = require('react-dom/client');
    
    // Clear module cache to ensure fresh imports
    delete require.cache[require.resolve('./frontend.tsx')];
    delete require.cache[require.resolve('./App.tsx')];
  });

  afterEach(() => {
    // Restore originals
    global.document = originalDocument;
    global.window = originalWindow;
    console.error = originalConsoleError;
    
    // Clear timers
    window.happyDOM.cancelAsync();
  });

  test('renders App component when DOM is ready', async () => {
    // Set document ready state
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: false,
      configurable: true
    });

    // Import and execute frontend
    await import('./frontend.tsx');

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if App was rendered
    const appContent = document.body.textContent;
    expect(appContent).toContain('Hello World!');
    expect(appContent).toContain('One day I hope to be an ecommerce website.');
  });

  test('waits for DOMContentLoaded when document is loading', async () => {
    // Set document to loading state
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
      configurable: true
    });

    // Import frontend
    await import('./frontend.tsx');

    // At this point, app should not be rendered yet
    expect(document.getElementById('root')?.innerHTML).toBe('');

    // Simulate DOMContentLoaded
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: false,
      configurable: true
    });
    
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check if App was rendered
    const appContent = document.body.textContent;
    expect(appContent).toContain('Hello World!');
  });

  test('handles missing root element gracefully', async () => {
    // Remove root element
    rootElement.remove();

    // Set document ready
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: false,
      configurable: true
    });

    // Import frontend - should throw error
    let errorThrown = false;
    try {
      await import('./frontend.tsx');
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      errorThrown = true;
    }

    // Check that an error was thrown or logged
    expect(errorThrown || consoleErrors.length > 0).toBe(true);
  });

  test('renders correct React components', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: false,
      configurable: true
    });

    await import('./frontend.tsx');
    await new Promise(resolve => setTimeout(resolve, 100));

    // Check for specific elements
    const heading = document.querySelector('h1');
    expect(heading).toBeDefined();
    expect(heading?.textContent).toBe('Hello World! 👋');

    const paragraph = document.querySelector('p');
    expect(paragraph).toBeDefined();
    expect(paragraph?.textContent).toBe('One day I hope to be an ecommerce website.');
  });
});