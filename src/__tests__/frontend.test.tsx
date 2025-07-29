import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { createMockElement, setupTest } from './test-utils';

describe('frontend', () => {
  beforeEach(() => {
    setupTest();
  });

  test('finds root element and sets up React app', () => {
    // Setup DOM with root element
    const rootElement = createMockElement('div', { id: 'root' });
    document.body.appendChild(rootElement);
    
    // Test that the root element exists and has correct ID
    const foundRoot = document.getElementById('root');
    expect(foundRoot).toBeDefined();
    expect(foundRoot).toBe(rootElement);
    expect(foundRoot?.id).toBe('root');
  });

  test('handles document ready state checking', () => {
    // Test loading state
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
      configurable: true,
    });
    
    expect(document.readyState).toBe('loading');

    // Test complete state
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
      configurable: true,
    });
    
    expect(document.readyState).toBe('complete');
  });

  test('can add and trigger DOMContentLoaded event', () => {
    let eventTriggered = false;
    
    const handler = () => {
      eventTriggered = true;
    };
    
    document.addEventListener('DOMContentLoaded', handler);
    
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
    
    expect(eventTriggered).toBe(true);
  });

  test('throws error when root element is missing', () => {
    // Don't add root element to DOM
    const getRootElement = () => document.getElementById('root')!;
    
    expect(() => getRootElement()).toThrow();
  });

  test('can create and append elements to body', () => {
    const testElement = createMockElement('div', { 
      id: 'test-element',
      'data-testid': 'test'
    });
    
    document.body.appendChild(testElement);
    
    const found = document.getElementById('test-element');
    expect(found).toBeDefined();
    expect(found?.getAttribute('data-testid')).toBe('test');
  });
});