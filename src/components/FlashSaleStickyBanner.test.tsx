import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import FlashSaleStickyBanner from './FlashSaleStickyBanner';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

(global as any).localStorage = localStorageMock;

describe('FlashSaleStickyBanner Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  test('renders banner when visible', () => {
    const onShowSale = () => {};
    render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    expect(screen.getByText(/FLASH SALE:/)).toBeDefined();
  });

  test('displays discount information', () => {
    const onShowSale = () => {};
    render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    expect(screen.getByText(/Up to 60% OFF/)).toBeDefined();
  });

  test('displays Shop Now button', () => {
    const onShowSale = () => {};
    render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    expect(screen.getByText('Shop Now')).toBeDefined();
  });

  test('calls onShowSale when Shop Now is clicked', () => {
    let called = false;
    const onShowSale = () => {
      called = true;
    };
    render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    const button = screen.getByText('Shop Now');
    fireEvent.click(button);
    expect(called).toBe(true);
  });

  test('hides banner when dismiss button is clicked', () => {
    const onShowSale = () => {};
    const { container } = render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    const dismissButton = screen.getByLabelText('Hide banner');
    fireEvent.click(dismissButton);
    
    // Banner should be hidden (returns null)
    expect(container.firstChild).toBeNull();
  });

  test('saves dismissal to localStorage', () => {
    const onShowSale = () => {};
    render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    const dismissButton = screen.getByLabelText('Hide banner');
    fireEvent.click(dismissButton);
    
    expect(localStorageMock.getItem('flashSaleBanner:dismissed')).toBe('1');
  });

  test('does not render when dismissed in localStorage', () => {
    localStorageMock.setItem('flashSaleBanner:dismissed', '1');
    const onShowSale = () => {};
    const { container } = render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    
    expect(container.firstChild).toBeNull();
  });

  test('handles localStorage errors gracefully', () => {
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = () => {
      throw new Error('Storage error');
    };
    
    const onShowSale = () => {};
    // Should not throw and should still render
    expect(() => render(<FlashSaleStickyBanner onShowSale={onShowSale} />)).not.toThrow();
    
    localStorageMock.getItem = originalGetItem;
  });

  test('handles localStorage setItem errors gracefully', () => {
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('Storage error');
    };
    
    const onShowSale = () => {};
    const { container } = render(<FlashSaleStickyBanner onShowSale={onShowSale} />);
    const dismissButton = screen.getByLabelText('Hide banner');
    
    // Should not throw
    expect(() => fireEvent.click(dismissButton)).not.toThrow();
    
    localStorageMock.setItem = originalSetItem;
  });
});
