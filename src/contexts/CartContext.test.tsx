import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).fetch = () => Promise.reject(new Error('Network error'));

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Test Chair',
  description: 'A comfortable test chair',
  price: 99.99,
  category: 'Furniture',
  material: 'Wood',
  color: 'Brown',
  dimensions: { width: 60, height: 80, depth: 60 },
  stock: 5,
  inStock: true,
  imageUrl: 'test.jpg'
};

// Test component that uses the cart context
function TestComponent() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getTotalPrice,
    clearCart
  } = useCart();

  return (
    <div>
      <div data-testid="cart-items">{cartItems.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="subtotal">{getSubtotal()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <button onClick={() => removeFromCart(1)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(1, 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('throws error when useCart is used outside CartProvider', () => {
    // This test needs to catch the error thrown by useCart
    let errorThrown = false;
    try {
      render(<TestComponent />);
    } catch (error) {
      errorThrown = true;
      expect((error as Error).message).toBe('useCart must be used within a CartProvider');
    }
    expect(errorThrown).toBe(true);
  });

  test('provides initial empty cart state', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('cart-items').textContent).toBe('0');
    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('subtotal').textContent).toBe('0');
    expect(getByTestId('total-price').textContent).toBe('0');
  });

  test('adds product to cart', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
    });

    expect(getByTestId('cart-items').textContent).toBe('1');
    expect(getByTestId('total-items').textContent).toBe('1');
    expect(getByTestId('subtotal').textContent).toBe('99.99');
    expect(getByTestId('total-price').textContent).toBe('99.99');
  });

  test('increases quantity when same product added again', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
      getByText('Add to Cart').click();
    });

    expect(getByTestId('cart-items').textContent).toBe('1'); // Still 1 unique item
    expect(getByTestId('total-items').textContent).toBe('2'); // But quantity is 2
    expect(getByTestId('subtotal').textContent).toBe('199.98');
  });

  test('removes product from cart', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
      getByText('Remove from Cart').click();
    });

    expect(getByTestId('cart-items').textContent).toBe('0');
    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('subtotal').textContent).toBe('0');
  });

  test('updates product quantity', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
      getByText('Update Quantity').click();
    });

    expect(getByTestId('total-items').textContent).toBe('2');
    expect(getByTestId('subtotal').textContent).toBe('199.98');
  });

  test('removes item when quantity updated to 0', () => {
    function TestUpdateToZero() {
      const { cartItems, addToCart, updateQuantity, getTotalItems } = useCart();
      
      return (
        <div>
          <div data-testid="total-items">{getTotalItems()}</div>
          <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
          <button onClick={() => updateQuantity(1, 0)}>Set Quantity to 0</button>
        </div>
      );
    }

    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestUpdateToZero />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
      getByText('Set Quantity to 0').click();
    });

    expect(getByTestId('total-items').textContent).toBe('0');
  });

  test('clears entire cart', () => {
    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      getByText('Add to Cart').click();
      getByText('Add to Cart').click();
      getByText('Clear Cart').click();
    });

    expect(getByTestId('cart-items').textContent).toBe('0');
    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('subtotal').textContent).toBe('0');
  });

  test('prevents adding out of stock product', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false, stock: 0 };
    
    function TestOutOfStock() {
      const { cartItems, addToCart, error } = useCart();
      
      return (
        <div>
          <div data-testid="cart-items">{cartItems.length}</div>
          <div data-testid="error">{error || 'no error'}</div>
          <button onClick={() => addToCart(outOfStockProduct)}>Add Out of Stock</button>
        </div>
      );
    }

    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestOutOfStock />
      </CartProvider>
    );

    act(() => {
      getByText('Add Out of Stock').click();
    });

    expect(getByTestId('cart-items').textContent).toBe('0');
    expect(getByTestId('error').textContent).toContain('out of stock');
  });

  test('prevents adding more than available stock', () => {
    const limitedProduct = { ...mockProduct, stock: 2 };
    
    function TestStockLimit() {
      const { cartItems, addToCart, error, getTotalItems } = useCart();
      
      return (
        <div>
          <div data-testid="total-items">{getTotalItems()}</div>
          <div data-testid="error">{error || 'no error'}</div>
          <button onClick={() => addToCart(limitedProduct)}>Add Limited Product</button>
        </div>
      );
    }

    const { getByTestId, getByText } = render(
      <CartProvider>
        <TestStockLimit />
      </CartProvider>
    );

    act(() => {
      // Add up to stock limit
      getByText('Add Limited Product').click();
      getByText('Add Limited Product').click();
      // Try to add beyond stock limit
      getByText('Add Limited Product').click();
    });

    expect(getByTestId('total-items').textContent).toBe('2');
    expect(getByTestId('error').textContent).toContain('Only 2 in stock');
  });
});
