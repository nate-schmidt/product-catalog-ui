import { beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { Window } from 'happy-dom';

// Global test configuration
declare global {
  var __TEST_DOM__: Window;
}

/**
 * Global test setup - runs once before all tests
 */
beforeAll(() => {
  // Create a fresh DOM environment
  const window = new Window();
  const document = window.document;

  // Store reference for cleanup
  global.__TEST_DOM__ = window;

  // Set up global DOM environment
  (global as any).window = window;
  (global as any).document = document;
  (global as any).navigator = window.navigator;
  (global as any).HTMLElement = window.HTMLElement;
  (global as any).Element = window.Element;
  (global as any).Node = window.Node;
  (global as any).Text = window.Text;
  (global as any).Event = window.Event;
  (global as any).CustomEvent = window.CustomEvent;
  
  // Add localStorage mock
  const localStorageMock = {
    getItem: (key: string) => localStorageMock._storage[key] || null,
    setItem: (key: string, value: string) => localStorageMock._storage[key] = value,
    removeItem: (key: string) => delete localStorageMock._storage[key],
    clear: () => localStorageMock._storage = {},
    _storage: {} as Record<string, string>,
  };
  
  (global as any).localStorage = localStorageMock;
  (global as any).sessionStorage = { ...localStorageMock, _storage: {} };

  // Add console methods if needed
  if (!global.console) {
    (global as any).console = {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {},
    };
  }
});

/**
 * Global test cleanup - runs once after all tests
 */
afterAll(() => {
  // Clean up global DOM
  if (global.__TEST_DOM__) {
    global.__TEST_DOM__.close();
  }
});

/**
 * Setup before each test
 */
beforeEach(() => {
  // Clear DOM body
  if (global.document) {
    global.document.body.innerHTML = '';
  }
  
  // Clear localStorage
  if (global.localStorage) {
    global.localStorage.clear();
  }
  
  // Clear sessionStorage
  if (global.sessionStorage) {
    global.sessionStorage.clear();
  }
});

/**
 * Cleanup after each test
 */
afterEach(() => {
  // Additional cleanup if needed
});