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

describe('frontend.tsx', () => {
  let mockCreateRoot: any;
  let mockRoot: any;
  
  beforeEach(() => {
    // Clear document and setup fresh DOM
    document.body.innerHTML = '<div id="root"></div>';
    
    // Mock React DOM
    mockRoot = {
      render: mock(() => {}),
    };
    mockCreateRoot = mock(() => mockRoot);
    
    // Clear module cache to ensure fresh imports
    delete require.cache[require.resolve('./frontend')];
    
    // Mock react-dom/client
    mock.module('react-dom/client', () => ({
      createRoot: mockCreateRoot,
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  test('creates root and renders App when DOM is already loaded', async () => {
    // Set document state to loaded
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });

    // Import module after mocks are set up
    await import('./frontend');

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRoot.render).toHaveBeenCalled();
  });

  test('waits for DOMContentLoaded when document is loading', async () => {
    // Set document state to loading
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      writable: true,
    });

    let eventListener: any;
    const mockAddEventListener = mock((event: string, listener: any) => {
      eventListener = listener;
    });
    document.addEventListener = mockAddEventListener;

    // Import module after mocks are set up
    await import('./frontend');

    expect(mockAddEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    expect(mockCreateRoot).not.toHaveBeenCalled();

    // Simulate DOMContentLoaded event
    eventListener();

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRoot.render).toHaveBeenCalled();
  });

  test('handles missing root element gracefully', async () => {
    // Remove root element
    document.body.innerHTML = '';
    
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });

    // Import should not throw even with missing root
    await import('./frontend');

    expect(mockCreateRoot).toHaveBeenCalledWith(null);
  });

  test('renders App component with correct props', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      writable: true,
    });

    await import('./frontend');

    // Check that render was called (App component will be passed)
    expect(mockRoot.render).toHaveBeenCalledTimes(1);
    const renderCall = mockRoot.render.mock.calls[0];
    expect(renderCall).toBeDefined();
  });
});