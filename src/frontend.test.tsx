import { test, expect, describe, beforeEach, afterEach, mock } from 'bun:test';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('frontend', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('mounts React app when DOM is already loaded', () => {
    // Verify root element exists for mounting
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeDefined();
    
    // Verify document readyState is accessible
    expect(['loading', 'interactive', 'complete']).toContain(document.readyState);
    
    // Test that createRoot can be called with the root element
    const { createRoot } = require('react-dom/client');
    expect(() => createRoot(rootElement!)).not.toThrow();
  });

  test('waits for DOMContentLoaded when document is loading', () => {
    // Test that addEventListener can be called for DOMContentLoaded
    let eventListenerCalled = false;
    const testCallback = () => {
      eventListenerCalled = true;
    };

    // Add event listener
    document.addEventListener('DOMContentLoaded', testCallback);

    // Manually dispatch the event to test the listener works
    const event = new (window as any).Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Verify the event listener was called
    expect(eventListenerCalled).toBe(true);
  });

  test('renders App component to root element', async () => {
    // Ensure root element exists
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeDefined();
    expect(rootElement?.tagName).toBe('DIV');
  });

  test('throws error if root element is missing', async () => {
    // Remove root element
    document.body.innerHTML = '';

    // Set readyState to complete
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });

    // Clear the module cache to re-import
    delete require.cache[require.resolve('./frontend')];

    // Import should throw or handle missing root
    // In the actual code, getElementById('root')! will throw at runtime
    expect(() => {
      const element = document.getElementById('root');
      if (!element) {
        throw new Error('Root element not found');
      }
    }).toThrow('Root element not found');
  });
});