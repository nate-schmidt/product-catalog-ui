/**
 * Shared test configuration and utilities
 * Import this in test files for consistent DOM setup and common utilities
 */

import { Window } from 'happy-dom';
import { cleanup } from '@testing-library/react';

/**
 * Sets up a DOM environment for testing React components
 * Call this in your test files that need DOM access
 */
export function setupTestDOM() {
  const window = new Window();
  const document = window.document;

  (global as any).window = window;
  (global as any).document = document;
  (global as any).navigator = window.navigator;
  (global as any).HTMLElement = window.HTMLElement;
  (global as any).Element = window.Element;
  (global as any).Node = window.Node;

  return { window, document };
}

/**
 * Cleans up the test environment
 * Call this in beforeEach or afterEach hooks
 */
export function cleanupTestDOM() {
  cleanup();
  if (global.document) {
    global.document.body.innerHTML = '';
  }
}

/**
 * Creates a mock root element for testing
 */
export function createMockRootElement() {
  if (!global.document) {
    setupTestDOM();
  }
  
  const rootElement = global.document.createElement('div');
  rootElement.id = 'root';
  global.document.body.appendChild(rootElement);
  
  return rootElement;
}

/**
 * Common test utilities
 */
export const testUtils = {
  /**
   * Creates a mock Request object for API testing
   */
  createMockRequest(options: {
    method?: string;
    url?: string;
    params?: Record<string, string>;
    body?: any;
  } = {}) {
    return {
      method: options.method || 'GET',
      url: options.url || '/',
      params: options.params || {},
      json: async () => options.body || {},
      text: async () => JSON.stringify(options.body || {})
    } as any;
  },

  /**
   * Creates a mock Response object for API testing
   */
  createMockResponse(data: any, options: { status?: number; headers?: Record<string, string> } = {}) {
    return {
      status: options.status || 200,
      headers: options.headers || {},
      json: async () => data,
      text: async () => JSON.stringify(data)
    } as Response;
  },

  /**
   * Waits for next tick - useful for async operations in tests
   */
  waitForNextTick() {
    return new Promise(resolve => setTimeout(resolve, 0));
  },

  /**
   * Generates test data for file size formatting tests
   */
  generateFileSizeTestData() {
    return [
      { bytes: 0, expected: '0.00 B' },
      { bytes: 512, expected: '512.00 B' },
      { bytes: 1024, expected: '1.00 KB' },
      { bytes: 1536, expected: '1.50 KB' },
      { bytes: 1024 * 1024, expected: '1.00 MB' },
      { bytes: 1024 * 1024 * 1024, expected: '1.00 GB' }
    ];
  },

  /**
   * Generates test data for camelCase conversion tests
   */
  generateCamelCaseTestData() {
    return [
      { input: 'hello-world', expected: 'helloWorld' },
      { input: 'test-case', expected: 'testCase' },
      { input: 'multi-word-string', expected: 'multiWordString' },
      { input: 'single', expected: 'single' },
      { input: '', expected: '' }
    ];
  }
};

/**
 * Custom matchers for better test assertions
 */
export const customMatchers = {
  toBeValidJSON(received: any) {
    try {
      JSON.stringify(received);
      return { pass: true, message: () => 'Value is valid JSON' };
    } catch (error) {
      return { 
        pass: false, 
        message: () => `Expected value to be valid JSON, but got error: ${error}` 
      };
    }
  },

  toMatchFileSizeFormat(received: string) {
    const fileSizeRegex = /^\d+\.\d{2} (B|KB|MB|GB)$/;
    const pass = fileSizeRegex.test(received);
    
    return {
      pass,
      message: () => pass 
        ? `Expected ${received} not to match file size format`
        : `Expected ${received} to match file size format (e.g., "1.50 KB")`
    };
  }
};

/**
 * Mock factory functions for common dependencies
 */
export const mockFactories = {
  /**
   * Creates a mock for react-dom/client
   */
  createReactDomClientMock() {
    const mockRender = jest.fn ? jest.fn() : (() => {});
    const mockCreateRoot = jest.fn ? jest.fn(() => ({ render: mockRender })) : (() => ({ render: mockRender }));

    return { mockRender, mockCreateRoot };
  },

  /**
   * Creates a mock for React components
   */
  createComponentMock(name: string) {
    return jest.fn ? jest.fn(() => `Mock${name}`) : (() => `Mock${name}`);
  }
};