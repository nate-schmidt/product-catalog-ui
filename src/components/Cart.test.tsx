import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { useEffect } from 'react';
import Cart from './Cart';
import { CartProvider, useCart } from '../providers/CartProvider';
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

const renderCart = () => {
  return render(
    <CartProvider>
      <Cart />
    </CartProvider>
  );
};

// Helper component to add items to cart for testing
const CartWithItems = ({ items }: { items: Array<{ id: string; name: string; price: number }> }) => {
  const { addItem } = useCart();
  
  useEffect(() => {
    items.forEach(item => addItem(item));
  }, []);

  return <Cart />;
};

describe('Cart Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    localStorageMock.clear();
  });

  test('renders empty cart message when cart is empty', () => {
    renderCart();
    expect(screen.getByText('Your cart is empty')).toBeDefined();
  });

  test('displays cart heading', () => {
    renderCart();
    expect(screen.getByText('Cart')).toBeDefined();
  });

  test('displays items when cart has items', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 10 }]} />
      </CartProvider>
    );

    expect(screen.getByText('Test Product')).toBeDefined();
  });

  test('displays item price correctly', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 19.99 }]} />
      </CartProvider>
    );

    expect(screen.getByText(/\$19\.99/)).toBeDefined();
  });

  test('displays item quantity', () => {
    render(
      <CartProvider>
        <CartWithItems items={[
          { id: '1', name: 'Test Product', price: 10 },
          { id: '1', name: 'Test Product', price: 10 }
        ]} />
      </CartProvider>
    );

    expect(screen.getByText('2')).toBeDefined();
  });

  test('displays line total correctly', () => {
    render(
      <CartProvider>
        <CartWithItems items={[
          { id: '1', name: 'Test Product', price: 10 },
          { id: '1', name: 'Test Product', price: 10 }
        ]} />
      </CartProvider>
    );

    // Line total should be $20.00
    expect(screen.getByText(/\$20\.00/)).toBeDefined();
  });

  test('displays subtotal correctly', () => {
    render(
      <CartProvider>
        <CartWithItems items={[
          { id: '1', name: 'Product 1', price: 10 },
          { id: '2', name: 'Product 2', price: 20 }
        ]} />
      </CartProvider>
    );

    expect(screen.getByText(/Subtotal:/)).toBeDefined();
    // Subtotal should be $30.00
    expect(screen.getByText(/\$30\.00/)).toBeDefined();
  });

  test('increases quantity when + button is clicked', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 10 }]} />
      </CartProvider>
    );

    const increaseButtons = screen.getAllByLabelText('Increase quantity');
    fireEvent.click(increaseButtons[0]);
    
    expect(screen.getByText('2')).toBeDefined();
  });

  test('decreases quantity when - button is clicked', () => {
    render(
      <CartProvider>
        <CartWithItems items={[
          { id: '1', name: 'Test Product', price: 10 },
          { id: '1', name: 'Test Product', price: 10 }
        ]} />
      </CartProvider>
    );

    const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
    fireEvent.click(decreaseButtons[0]);
    
    expect(screen.getByText('1')).toBeDefined();
  });

  test('removes item when quantity reaches 0', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 10 }]} />
      </CartProvider>
    );

    const decreaseButtons = screen.getAllByLabelText('Decrease quantity');
    fireEvent.click(decreaseButtons[0]);
    
    expect(screen.getByText('Your cart is empty')).toBeDefined();
  });

  test('removes item when Remove button is clicked', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 10 }]} />
      </CartProvider>
    );

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    expect(screen.getByText('Your cart is empty')).toBeDefined();
  });

  test('clears cart when Clear Cart button is clicked', () => {
    render(
      <CartProvider>
        <CartWithItems items={[
          { id: '1', name: 'Product 1', price: 10 },
          { id: '2', name: 'Product 2', price: 20 }
        ]} />
      </CartProvider>
    );

    const clearButton = screen.getByText('Clear Cart');
    fireEvent.click(clearButton);
    
    expect(screen.getByText('Your cart is empty')).toBeDefined();
  });

  test('displays correct aria-label for remove button', () => {
    render(
      <CartProvider>
        <CartWithItems items={[{ id: '1', name: 'Test Product', price: 10 }]} />
      </CartProvider>
    );

    const removeButton = screen.getByLabelText('Remove Test Product from cart');
    expect(removeButton).toBeDefined();
  });
});
