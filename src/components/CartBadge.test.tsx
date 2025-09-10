import { test, expect, describe, beforeEach, vi } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import CartBadge from './CartBadge';
import { CartProvider } from '../cart/CartContext';
import { Window } from 'happy-dom';

// Setup DOM environment
const window = new Window();
(global as any).window = window;
(global as any).document = window.document;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;
(global as any).SVGElement = window.SVGElement;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
(global as any).localStorage = mockLocalStorage;

// Helper component to provide cart context
function CartBadgeWithProvider(props: any) {
  return (
    <CartProvider>
      <CartBadge {...props} />
    </CartProvider>
  );
}

describe('CartBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  test('renders with empty cart', () => {
    const { getByText } = render(<CartBadgeWithProvider />);
    
    expect(getByText('Cart')).toBeDefined();
    
    // Should not show price when cart is empty
    const priceElement = document.querySelector('[class*="text-xs text-gray-600"]');
    expect(priceElement).toBeNull();
    
    // Should not show badge count when empty
    const badgeElement = document.querySelector('[class*="bg-red-500"]');
    expect(badgeElement).toBeNull();
  });

  test('shows correct item count and total price with items in cart', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 100, inStock: true },
          quantity: 2,
          addedAt: '2023-01-01T00:00:00.000Z'
        },
        {
          product: { id: '2', name: 'Product 2', price: 50, inStock: true },
          quantity: 1,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 3,
      totalPrice: 250
    }));

    const { getByText } = render(<CartBadgeWithProvider />);
    
    expect(getByText('3 items')).toBeDefined();
    expect(getByText('$250')).toBeDefined();
    expect(getByText('3')).toBeDefined(); // Badge count
  });

  test('shows singular item text for one item', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 100, inStock: true },
          quantity: 1,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 1,
      totalPrice: 100
    }));

    const { getByText } = render(<CartBadgeWithProvider />);
    
    expect(getByText('1 item')).toBeDefined(); // Singular form
    expect(getByText('$100')).toBeDefined();
  });

  test('shows 99+ for large quantities', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 1, inStock: true },
          quantity: 150,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 150,
      totalPrice: 150
    }));

    const { getByText } = render(<CartBadgeWithProvider />);
    
    expect(getByText('150 items')).toBeDefined();
    expect(getByText('99+')).toBeDefined(); // Badge should show 99+
  });

  test('handles click events', () => {
    const onClickMock = vi.fn();
    const { container } = render(<CartBadgeWithProvider onClick={onClickMock} />);
    
    const button = container.querySelector('button');
    expect(button).toBeDefined();
    
    fireEvent.click(button!);
    
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    const { container } = render(<CartBadgeWithProvider className="custom-badge" />);
    
    const button = container.querySelector('.custom-badge');
    expect(button).toBeDefined();
    expect(button?.className).toContain('custom-badge');
    expect(button?.className).toContain('relative');
    expect(button?.className).toContain('flex');
  });

  test('has proper styling and layout classes', () => {
    const { container } = render(<CartBadgeWithProvider />);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('relative');
    expect(button?.className).toContain('flex');
    expect(button?.className).toContain('items-center');
    expect(button?.className).toContain('gap-2');
    expect(button?.className).toContain('px-4');
    expect(button?.className).toContain('py-2');
    expect(button?.className).toContain('bg-white');
    expect(button?.className).toContain('text-black');
    expect(button?.className).toContain('rounded-lg');
    expect(button?.className).toContain('shadow-md');
  });

  test('has hover effects', () => {
    const { container } = render(<CartBadgeWithProvider />);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('hover:bg-gray-100');
    expect(button?.className).toContain('transition-colors');
    expect(button?.className).toContain('duration-200');
  });

  test('renders cart SVG icon', () => {
    const { container } = render(<CartBadgeWithProvider />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.className).toContain('w-6');
    expect(svg?.className).toContain('h-6');
    
    const path = svg?.querySelector('path');
    expect(path).toBeDefined();
    expect(path?.getAttribute('stroke-linecap')).toBe('round');
    expect(path?.getAttribute('stroke-linejoin')).toBe('round');
  });

  test('formats large prices correctly', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Expensive Item', price: 10000, inStock: true },
          quantity: 1,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 1,
      totalPrice: 10000
    }));

    const { getByText } = render(<CartBadgeWithProvider />);
    
    // Should format large numbers with commas
    expect(getByText('$10,000')).toBeDefined();
  });

  test('badge positioning and styling', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 100, inStock: true },
          quantity: 5,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 5,
      totalPrice: 500
    }));

    const { container } = render(<CartBadgeWithProvider />);
    
    const badge = container.querySelector('.bg-red-500');
    expect(badge).toBeDefined();
    expect(badge?.className).toContain('absolute');
    expect(badge?.className).toContain('-top-2');
    expect(badge?.className).toContain('-right-2');
    expect(badge?.className).toContain('text-white');
    expect(badge?.className).toContain('text-xs');
    expect(badge?.className).toContain('rounded-full');
    expect(badge?.className).toContain('w-6');
    expect(badge?.className).toContain('h-6');
    expect(badge?.className).toContain('flex');
    expect(badge?.className).toContain('items-center');
    expect(badge?.className).toContain('justify-center');
    expect(badge?.className).toContain('font-bold');
  });

  test('price display styling', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 100, inStock: true },
          quantity: 1,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 1,
      totalPrice: 100
    }));

    const { container } = render(<CartBadgeWithProvider />);
    
    const priceElement = container.querySelector('.text-xs.text-gray-600');
    expect(priceElement).toBeDefined();
    expect(priceElement?.textContent).toBe('$100');
  });

  test('text content styling', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [
        {
          product: { id: '1', name: 'Product 1', price: 100, inStock: true },
          quantity: 2,
          addedAt: '2023-01-01T00:00:00.000Z'
        }
      ],
      totalItems: 2,
      totalPrice: 200
    }));

    const { container } = render(<CartBadgeWithProvider />);
    
    const itemCountElement = container.querySelector('.text-sm.font-semibold');
    expect(itemCountElement).toBeDefined();
    expect(itemCountElement?.textContent).toBe('2 items');
  });
});