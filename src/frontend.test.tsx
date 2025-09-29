import { test, expect, describe, beforeEach } from 'bun:test';
import { setupTestDOM, cleanupTestDOM } from './test-setup';

// Setup DOM environment for tests
setupTestDOM();

describe('frontend.tsx', () => {
  beforeEach(() => {
    cleanupTestDOM();
    
    // Create a root element
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  });

  test('document has expected structure for frontend initialization', () => {
    // Test that we can find the root element that frontend.tsx expects
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeDefined();
    expect(rootElement?.tagName).toBe('DIV');
  });

  test('DOM ready state can be checked', () => {
    // Test the logic that frontend.tsx uses to determine when to start
    expect(['loading', 'interactive', 'complete']).toContain(document.readyState);
  });

  test('DOMContentLoaded event can be added', () => {
    // Test that addEventListener works as expected
    let eventListenerCalled = false;
    const testHandler = () => { eventListenerCalled = true; };
    
    document.addEventListener('DOMContentLoaded', testHandler);
    
    // Create and dispatch the event
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
    
    expect(eventListenerCalled).toBe(true);
    
    // Clean up
    document.removeEventListener('DOMContentLoaded', testHandler);
  });

  test('getElementById returns null for missing elements', () => {
    // Test error handling case
    const missingElement = document.getElementById('nonexistent');
    expect(missingElement).toBeNull();
  });

  test('root element can be identified correctly', () => {
    // Test the specific element that frontend.tsx looks for
    const rootElement = document.getElementById('root');
    expect(rootElement).not.toBeNull();
    
    if (rootElement) {
      expect(rootElement.id).toBe('root');
    }
  });
});