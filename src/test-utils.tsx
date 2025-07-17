import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Window } from 'happy-dom';

// Setup DOM environment once
let window: any;
let document: any;

export function setupDOM() {
  if (!window) {
    window = new Window();
    document = window.document;
    
    (global as any).window = window;
    (global as any).document = document;
    (global as any).navigator = window.navigator;
    (global as any).HTMLElement = window.HTMLElement;
    (global as any).Element = window.Element;
    (global as any).Event = window.Event;
    (global as any).CustomEvent = window.CustomEvent;
  }
  
  return { window, document };
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  setupDOM();
  
  // Add any providers here in the future (Redux, Router, etc.)
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Helper to wait for async operations
export function waitFor(fn: () => void, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    function check() {
      try {
        fn();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    }
    
    check();
  });
}

// Helper to simulate user events
export const userEvent = {
  click: (element: Element) => {
    const clickEvent = new window.MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    element.dispatchEvent(clickEvent);
  },
  
  type: (element: HTMLInputElement, text: string) => {
    element.value = text;
    const inputEvent = new window.Event('input', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(inputEvent);
  },
  
  clear: (element: HTMLInputElement) => {
    element.value = '';
    const inputEvent = new window.Event('input', {
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(inputEvent);
  }
};

// Helper to mock fetch for API tests
export function mockFetch(responses: Record<string, any>) {
  const originalFetch = global.fetch;
  
  global.fetch = async (url: string | URL | Request, options?: RequestInit) => {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    for (const [pattern, response] of Object.entries(responses)) {
      if (urlString.includes(pattern)) {
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  };
  
  return () => {
    global.fetch = originalFetch;
  };
}

// Helper for accessibility testing
export const a11y = {
  // Check if element is visible
  isVisible: (element: Element): boolean => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  },
  
  // Check if element has accessible name
  hasAccessibleName: (element: Element): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim()
    );
  },
  
  // Check color contrast (simplified)
  hasGoodContrast: (element: Element): boolean => {
    const classes = element.className;
    const darkTextOnLight = classes.includes('text-gray-900') || classes.includes('text-black');
    const lightTextOnDark = classes.includes('text-white') || classes.includes('text-gray-100');
    
    return darkTextOnLight || lightTextOnDark;
  }
};

// Export everything from testing library for convenience
export * from '@testing-library/react';