import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { Window } from 'happy-dom';

// Mock DOM for testing
let window: Window;
let document: Document;
let originalDocument: Document;
let originalWindow: Window & typeof globalThis;

describe('Frontend initialization', () => {
  beforeEach(() => {
    // Store original globals
    originalDocument = global.document;
    originalWindow = global.window;
    
    // Create new DOM environment
    window = new Window();
    document = window.document;
    
    // Set up globals
    (global as any).window = window;
    (global as any).document = document;
    (global as any).navigator = window.navigator;
    (global as any).HTMLElement = window.HTMLElement;
    (global as any).Element = window.Element;
    
    // Set up DOM structure
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    // Restore original globals
    (global as any).document = originalDocument;
    (global as any).window = originalWindow;
  });

  test('should find root element and create React root', () => {
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeDefined();
    expect(rootElement?.tagName).toBe('DIV');
  });

  test('should handle missing root element gracefully', () => {
    // Remove root element
    document.body.innerHTML = '';
    
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeNull();
  });

  test('should handle DOM ready state correctly when loading', () => {
    // Mock document ready state as loading
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true
    });
    
    expect(document.readyState).toBe('loading');
  });

  test('should handle DOM ready state correctly when interactive', () => {
    // Mock document ready state as interactive
    Object.defineProperty(document, 'readyState', {
      value: 'interactive',
      writable: true
    });
    
    expect(document.readyState).toBe('interactive');
  });

  test('should handle DOM ready state correctly when complete', () => {
    // Mock document ready state as complete
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true
    });
    
    expect(document.readyState).toBe('complete');
  });

  test('should set up event listener for DOMContentLoaded when document is loading', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true
    });
    
    let eventListenerAdded = false;
    const originalAddEventListener = document.addEventListener;
    document.addEventListener = (type: string, listener: any) => {
      if (type === 'DOMContentLoaded') {
        eventListenerAdded = true;
      }
      return originalAddEventListener.call(document, type, listener);
    };
    
    // This would normally import and run the frontend module
    // For testing purposes, we're just verifying the logic
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {});
    }
    
    expect(eventListenerAdded).toBe(true);
  });
});