import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { render, cleanup, RenderOptions } from '@testing-library/react';
import { Window } from 'happy-dom';
import type { ReactElement } from 'react';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

// Set up global DOM environment
(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;
(global as any).Text = window.Text;

/**
 * Custom render function that includes common setup
 */
export function renderWithCleanup(ui: ReactElement, options?: RenderOptions) {
  return render(ui, options);
}

/**
 * Common test setup that can be used in beforeEach
 */
export function setupTest() {
  cleanup();
  document.body.innerHTML = '';
}

/**
 * Common test teardown that can be used in afterEach
 */
export function teardownTest() {
  cleanup();
}

/**
 * Helper to create a mock DOM element
 */
export function createMockElement(tag: string, attributes?: Record<string, string>) {
  const element = document.createElement(tag);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
}

/**
 * Helper to wait for element to appear in DOM
 */
export async function waitForElement(selector: string, timeout = 1000): Promise<Element | null> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    function check() {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(check, 10);
      } else {
        resolve(null);
      }
    }
    
    check();
  });
}

/**
 * Helper to create a mock fetch response
 */
export function createMockResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Re-export commonly used testing utilities
export {
  test,
  expect,
  describe,
  beforeEach,
  afterEach,
  render,
  cleanup,
  RenderOptions
};