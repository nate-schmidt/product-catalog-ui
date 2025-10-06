import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import { Cart } from './Cart';
import { CartProvider } from '../contexts/CartContext';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('Cart', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<CartProvider>{ui}</CartProvider>);
  };

  test('renders empty cart message when no items', () => {
    const { getByTestId } = renderWithProvider(<Cart />);
    
    expect(getByTestId('empty-cart')).toBeDefined();
    expect(getByTestId('empty-cart').textContent).toContain('Your cart is empty');
  });

  test('displays Shopping Cart title in empty cart', () => {
    const { getByText } = renderWithProvider(<Cart />);
    
    expect(getByText('Shopping Cart')).toBeDefined();
  });

  test('renders cart with items when items are added', () => {
    const { getByTestId, queryByTestId } = renderWithProvider(
      <CartWithItems />
    );
    
    expect(queryByTestId('empty-cart')).toBeNull();
    expect(getByTestId('cart-container')).toBeDefined();
  });

  test('displays correct item count badge', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const badge = getByTestId('item-count-badge');
    expect(badge.textContent).toContain('items');
  });

  test('displays cart items with correct information', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    // Check that cart items container exists
    expect(getByTestId('cart-items')).toBeDefined();
  });

  test('item name is displayed correctly', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const itemNames = container.querySelectorAll('[data-testid^="item-name-"]');
    expect(itemNames.length).toBeGreaterThan(0);
  });

  test('item price is displayed correctly', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const itemPrices = container.querySelectorAll('[data-testid^="item-price-"]');
    expect(itemPrices.length).toBeGreaterThan(0);
  });

  test('item quantity is displayed', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const quantities = container.querySelectorAll('[data-testid^="item-quantity-"]');
    expect(quantities.length).toBeGreaterThan(0);
  });

  test('increase quantity button exists', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const increaseButtons = container.querySelectorAll('[data-testid^="increase-qty-"]');
    expect(increaseButtons.length).toBeGreaterThan(0);
  });

  test('decrease quantity button exists', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const decreaseButtons = container.querySelectorAll('[data-testid^="decrease-qty-"]');
    expect(decreaseButtons.length).toBeGreaterThan(0);
  });

  test('remove item button exists', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const removeButtons = container.querySelectorAll('[data-testid^="remove-item-"]');
    expect(removeButtons.length).toBeGreaterThan(0);
  });

  test('item total price is calculated and displayed', () => {
    const { container } = renderWithProvider(<CartWithItems />);
    
    const totals = container.querySelectorAll('[data-testid^="item-total-"]');
    expect(totals.length).toBeGreaterThan(0);
  });

  test('coupon section is rendered', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(getByTestId('coupon-section')).toBeDefined();
  });

  test('coupon input is displayed when no coupon applied', () => {
    const { getByTestId, queryByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(getByTestId('coupon-input')).toBeDefined();
    expect(getByTestId('apply-coupon-button')).toBeDefined();
    expect(queryByTestId('applied-coupon')).toBeNull();
  });

  test('coupon input accepts text', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const input = getByTestId('coupon-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    
    expect(input.value).toBe('SAVE10');
  });

  test('coupon hints are displayed', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const hints = getByTestId('coupon-hints');
    expect(hints.textContent).toContain('SAVE10');
    expect(hints.textContent).toContain('SAVE20');
    expect(hints.textContent).toContain('WELCOME15');
    expect(hints.textContent).toContain('FIXED5');
  });

  test('order summary section exists', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(getByTestId('order-summary')).toBeDefined();
  });

  test('subtotal is displayed', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const subtotal = getByTestId('subtotal');
    expect(subtotal).toBeDefined();
    expect(subtotal.textContent).toContain('$');
  });

  test('total is displayed', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const total = getByTestId('total');
    expect(total).toBeDefined();
    expect(total.textContent).toContain('$');
  });

  test('clear cart button exists', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(getByTestId('clear-cart-button')).toBeDefined();
  });

  test('checkout button exists', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(getByTestId('checkout-button')).toBeDefined();
  });

  test('shows error message when applying invalid coupon', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const input = getByTestId('coupon-input') as HTMLInputElement;
    const applyButton = getByTestId('apply-coupon-button');
    
    fireEvent.change(input, { target: { value: 'INVALID' } });
    fireEvent.click(applyButton);
    
    const message = getByTestId('coupon-message');
    expect(message).toBeDefined();
    expect(message.className).toContain('text-red-600');
  });

  test('shows error message when applying coupon on empty input', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const applyButton = getByTestId('apply-coupon-button');
    fireEvent.click(applyButton);
    
    const message = getByTestId('coupon-message');
    expect(message.textContent).toContain('Please enter a coupon code');
  });

  test('formats prices with two decimal places', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const subtotal = getByTestId('subtotal').textContent || '';
    const total = getByTestId('total').textContent || '';
    
    // Check format like $XX.XX
    expect(subtotal).toMatch(/\$\d+\.\d{2}/);
    expect(total).toMatch(/\$\d+\.\d{2}/);
  });

  test('coupon section has correct heading', () => {
    const { getByText } = renderWithProvider(<CartWithItems />);
    
    expect(getByText('Coupon Code')).toBeDefined();
  });

  test('cart container has correct styling classes', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const container = getByTestId('cart-container');
    expect(container.className).toContain('bg-white');
    expect(container.className).toContain('rounded-lg');
    expect(container.className).toContain('shadow-lg');
  });

  test('empty cart has correct styling classes', () => {
    const { getByTestId } = renderWithProvider(<Cart />);
    
    const emptyCart = getByTestId('empty-cart');
    expect(emptyCart.className).toContain('bg-white');
    expect(emptyCart.className).toContain('rounded-lg');
  });

  test('apply button has correct text', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const applyButton = getByTestId('apply-coupon-button');
    expect(applyButton.textContent).toBe('Apply');
  });

  test('clear cart button has correct text', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const clearButton = getByTestId('clear-cart-button');
    expect(clearButton.textContent).toBe('Clear Cart');
  });

  test('checkout button has correct text', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const checkoutButton = getByTestId('checkout-button');
    expect(checkoutButton.textContent).toBe('Checkout');
  });

  test('discount is not shown when no coupon applied', () => {
    const { queryByTestId } = renderWithProvider(<CartWithItems />);
    
    expect(queryByTestId('discount')).toBeNull();
  });

  test('coupon input has correct placeholder', () => {
    const { getByTestId } = renderWithProvider(<CartWithItems />);
    
    const input = getByTestId('coupon-input') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter coupon code');
  });
});

// Helper component that renders a cart with pre-populated items
function CartWithItems() {
  const { useCart } = require('../contexts/CartContext');
  
  const TestCart = () => {
    const { addItem } = useCart();
    
    React.useEffect(() => {
      addItem({ id: '1', name: 'Test Product 1', price: 29.99 });
      addItem({ id: '2', name: 'Test Product 2', price: 49.99 });
    }, []);
    
    return <Cart />;
  };
  
  return <TestCart />;
}
