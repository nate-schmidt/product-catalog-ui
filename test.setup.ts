import { Window } from 'happy-dom';
import '@testing-library/jest-dom';

// Setup DOM environment before any imports
const window = new Window({ url: 'http://localhost:3000' });

// Set globals before any module imports
(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).MutationObserver = window.MutationObserver;
(global as any).getComputedStyle = window.getComputedStyle;
(global as any).requestAnimationFrame = (fn: Function) => setTimeout(fn, 0);
(global as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
(global as any).location = window.location;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Add custom matchers for spyOn
declare global {
  function spyOn(obj: any, method: string): any;
}

// Implement spyOn function
(global as any).spyOn = (obj: any, method: string) => {
  const original = obj[method];
  const calls: any[] = [];
  
  const spy = {
    calls,
    toHaveBeenCalled: () => calls.length > 0,
    toHaveBeenCalledTimes: (times: number) => calls.length === times,
    toHaveBeenCalledWith: (...expectedArgs: any[]) => {
      return calls.some(call => 
        expectedArgs.every((arg, i) => arg === call[i])
      );
    },
  };
  
  obj[method] = (...args: any[]) => {
    calls.push(args);
    return original?.(...args);
  };
  
  // Add these properties directly to match Bun's expect API
  (expect(spy) as any).toHaveBeenCalled = () => {
    if (calls.length === 0) {
      throw new Error(`Expected spy to have been called, but it was not called`);
    }
    return { pass: true };
  };
  
  (expect(spy) as any).toHaveBeenCalledTimes = (expectedTimes: number) => {
    if (calls.length !== expectedTimes) {
      throw new Error(`Expected spy to have been called ${expectedTimes} times, but was called ${calls.length} times`);
    }
    return { pass: true };
  };
  
  (expect(spy) as any).toHaveBeenCalledWith = (...expectedArgs: any[]) => {
    const hasCall = calls.some(call => 
      expectedArgs.every((arg, i) => arg === call[i])
    );
    if (!hasCall) {
      throw new Error(`Expected spy to have been called with ${JSON.stringify(expectedArgs)}`);
    }
    return { pass: true };
  };
  
  return spy;
};