import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { CartIcon } from './CartIcon';
import { CartProvider } from '../contexts/CartContext';
import { Window } from 'happy-dom';
import React from 'react';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('CartIcon', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<CartProvider>{ui}</CartProvider>);
  };

  test('renders without crashing', () => {
    renderWithProvider(<CartIcon />);
  });

  test('renders cart icon button', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    expect(getByTestId('cart-icon-button')).toBeDefined();
  });

  test('renders cart icon SVG', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    expect(getByTestId('cart-icon-svg')).toBeDefined();
  });

  test('button has correct aria-label', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const button = getByTestId('cart-icon-button');
    expect(button.getAttribute('aria-label')).toBe('Cart');
  });

  test('does not show badge when cart is empty', () => {
    const { queryByTestId } = renderWithProvider(<CartIcon />);
    
    expect(queryByTestId('cart-item-count')).toBeNull();
  });

  test('shows badge when cart has items', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems />);
    
    expect(getByTestId('cart-item-count')).toBeDefined();
  });

  test('displays correct item count in badge', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={3} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.textContent).toBe('3');
  });

  test('badge displays single digit count', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={5} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.textContent).toBe('5');
  });

  test('badge displays double digit count', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={15} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.textContent).toBe('15');
  });

  test('button has correct styling classes', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const button = getByTestId('cart-icon-button');
    expect(button.className).toContain('relative');
    expect(button.className).toContain('text-white');
    expect(button.className).toContain('hover:opacity-80');
  });

  test('SVG has correct size classes', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const svg = getByTestId('cart-icon-svg');
    expect(svg.className).toContain('w-8');
    expect(svg.className).toContain('h-8');
  });

  test('badge has correct styling when shown', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={1} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.className).toContain('absolute');
    expect(badge.className).toContain('bg-red-500');
    expect(badge.className).toContain('text-white');
    expect(badge.className).toContain('rounded-full');
  });

  test('badge has correct positioning classes', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={1} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.className).toContain('-top-1');
    expect(badge.className).toContain('-right-1');
  });

  test('SVG has correct viewBox', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const svg = getByTestId('cart-icon-svg');
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  test('SVG has correct stroke width', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const svg = getByTestId('cart-icon-svg');
    // SVG attributes may be camelCase in React but rendered as kebab-case in DOM
    const strokeWidth = svg.getAttribute('stroke-width') || svg.getAttribute('strokeWidth');
    expect(strokeWidth).toBe('1.5');
  });

  test('component has display name', () => {
    expect(CartIcon.displayName).toBe('CartIcon');
  });

  test('badge text has correct font styling', () => {
    const { getByTestId } = renderWithProvider(<CartIconWithItems count={7} />);
    
    const badge = getByTestId('cart-item-count');
    expect(badge.className).toContain('text-xs');
    expect(badge.className).toContain('font-bold');
  });

  test('handles zero count by not showing badge', () => {
    const { queryByTestId } = renderWithProvider(<CartIconWithItems count={0} />);
    
    expect(queryByTestId('cart-item-count')).toBeNull();
  });

  test('renders as button element', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const button = getByTestId('cart-icon-button');
    expect(button.tagName.toLowerCase()).toBe('button');
  });

  test('SVG has no fill attribute', () => {
    const { getByTestId } = renderWithProvider(<CartIcon />);
    
    const svg = getByTestId('cart-icon-svg');
    expect(svg.getAttribute('fill')).toBe('none');
  });

  test('renders with proper React memo optimization', () => {
    // CartIcon is wrapped in React.memo
    expect(typeof CartIcon).toBe('object');
  });
});

// Helper component to render CartIcon with items
function CartIconWithItems({ count = 1 }: { count?: number }) {
  const { useCart } = require('../contexts/CartContext');
  
  const TestCartIcon = () => {
    const { addItem } = useCart();
    
    React.useEffect(() => {
      for (let i = 0; i < count; i++) {
        addItem({ id: `item-${i}`, name: `Item ${i}`, price: 10 });
      }
    }, []);
    
    return <CartIcon />;
  };
  
  return <TestCartIcon />;
}
