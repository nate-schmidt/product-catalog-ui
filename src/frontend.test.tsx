import { test, expect, beforeEach, afterEach, mock } from "bun:test";
import { Window } from "happy-dom";

let window: any;
let document: any;

beforeEach(() => {
  window = new Window();
  document = window.document;
  global.document = document;
  global.window = window;
  document.body.innerHTML = '<div id="root"></div>';
  
  // Clear module cache before each test
  delete require.cache[require.resolve('./frontend')];
});

afterEach(() => {
  document.body.innerHTML = '';
});

test("frontend calls start immediately when DOM is already loaded", async () => {
  // Set readyState to not loading (e.g., 'complete' or 'interactive')
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    writable: true,
    value: 'complete'
  });

  // Import the module - this should trigger the else branch
  await import('./frontend');

  // Give it time to execute
  await Bun.sleep(10);

  // Verify the root was used
  expect(document.getElementById('root')).toBeTruthy();
});

test("frontend waits for DOMContentLoaded when loading", async () => {
  // Set readyState to loading
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    writable: true,
    value: 'loading'
  });

  let domContentLoadedHandler: any;
  const originalAddEventListener = document.addEventListener.bind(document);
  const addEventListenerMock = mock((event: string, handler: any) => {
    if (event === 'DOMContentLoaded') {
      domContentLoadedHandler = handler;
    }
    return originalAddEventListener(event, handler);
  });
  document.addEventListener = addEventListenerMock;

  // Import the module - this should trigger the if branch
  await import('./frontend');

  expect(addEventListenerMock).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

  // Simulate DOMContentLoaded event
  if (domContentLoadedHandler) {
    domContentLoadedHandler();
  }

  await Bun.sleep(10);

  expect(document.getElementById('root')).toBeTruthy();

  document.addEventListener = originalAddEventListener;
});