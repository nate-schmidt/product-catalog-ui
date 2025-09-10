import { test, expect, describe, beforeEach, vi, afterEach } from 'bun:test';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { Product } from './cartTypes';
import { Window } from 'happy-dom';

// Setup DOM environment  
const window = new Window();
(global as any).window = window;
(global as any).document = window.document;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
(global as any).localStorage = mockLocalStorage;

// Test component that uses the cart context
function TestComponent() {
  const { cart, addItem, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div>
      <div data-testid="total-items">{cart.totalItems}</div>
      <div data-testid="total-price">{cart.totalPrice}</div>
      <div data-testid="items-count">{cart.items.length}</div>
      
      <button
        data-testid="add-item"
        onClick={() => addItem({
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        }, 2)}
      >
        Add Item
      </button>
      
      <button
        data-testid="remove-item"
        onClick={() => removeItem('1')}
      >
        Remove Item
      </button>
      
      <button
        data-testid="update-quantity"
        onClick={() => updateQuantity('1', 5)}
      >
        Update Quantity
      </button>
      
      <button
        data-testid="clear-cart"
        onClick={() => clearCart()}
      >
        Clear Cart
      </button>

      {cart.items.map(item => (
        <div key={item.product.id} data-testid={`item-${item.product.id}`}>
          {item.product.name} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
    window.document.body.innerHTML = '';
  });

  test('provides initial empty cart state', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('total-price').textContent).toBe('0');
    expect(getByTestId('items-count').textContent).toBe('0');
  });

  test('loads cart from localStorage on mount', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Existing Product',
          description: 'Test',
          price: 50,
          inStock: true
        },
        quantity: 1,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 1,
      totalPrice: 50
    }));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('total-items').textContent).toBe('1');
    expect(getByTestId('total-price').textContent).toBe('50');
    expect(getByTestId('items-count').textContent).toBe('1');
    expect(getByTestId('item-1').textContent).toBe('Existing Product - Quantity: 1');
  });

  test('adds new item to cart', async () => {
    // Ensure clean start - no localStorage data
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Initially should be empty
    expect(getByTestId('total-items').textContent).toBe('0');

    await act(async () => {
      fireEvent.click(getByTestId('add-item'));
    });

    expect(getByTestId('total-items').textContent).toBe('2');
    expect(getByTestId('total-price').textContent).toBe('200');
    expect(getByTestId('items-count').textContent).toBe('1');
    expect(getByTestId('item-1').textContent).toBe('Test Product - Quantity: 2');
  });

  test('adds quantity to existing item', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        },
        quantity: 1,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 1,
      totalPrice: 100
    }));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      fireEvent.click(getByTestId('add-item'));
    });

    expect(getByTestId('total-items').textContent).toBe('3'); // 1 + 2
    expect(getByTestId('total-price').textContent).toBe('300'); // 1*100 + 2*100
    expect(getByTestId('item-1').textContent).toBe('Test Product - Quantity: 3');
  });

  test('removes item from cart', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        },
        quantity: 2,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 2,
      totalPrice: 200
    }));

    const { getByTestId, queryByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('item-1')).toBeDefined();

    await act(async () => {
      fireEvent.click(getByTestId('remove-item'));
    });

    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('total-price').textContent).toBe('0');
    expect(queryByTestId('item-1')).toBeNull();
  });

  test('updates item quantity', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        },
        quantity: 2,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 2,
      totalPrice: 200
    }));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      fireEvent.click(getByTestId('update-quantity'));
    });

    expect(getByTestId('total-items').textContent).toBe('5');
    expect(getByTestId('total-price').textContent).toBe('500');
    expect(getByTestId('item-1').textContent).toBe('Test Product - Quantity: 5');
  });

  test('removes item when quantity updated to 0', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        },
        quantity: 2,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 2,
      totalPrice: 200
    }));

    function TestUpdateToZero() {
      const { cart, updateQuantity } = useCart();
      
      return (
        <div>
          <div data-testid="items-count">{cart.items.length}</div>
          <button
            data-testid="update-to-zero"
            onClick={() => updateQuantity('1', 0)}
          >
            Update to Zero
          </button>
        </div>
      );
    }

    const { getByTestId } = render(
      <CartProvider>
        <TestUpdateToZero />
      </CartProvider>
    );

    expect(getByTestId('items-count').textContent).toBe('1');

    await act(async () => {
      fireEvent.click(getByTestId('update-to-zero'));
    });

    expect(getByTestId('items-count').textContent).toBe('0');
  });

  test('clears entire cart', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      items: [{
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 100,
          inStock: true
        },
        quantity: 2,
        addedAt: '2023-01-01T00:00:00.000Z'
      }],
      totalItems: 2,
      totalPrice: 200
    }));

    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(getByTestId('total-items').textContent).toBe('2');

    await act(async () => {
      fireEvent.click(getByTestId('clear-cart'));
    });

    expect(getByTestId('total-items').textContent).toBe('0');
    expect(getByTestId('total-price').textContent).toBe('0');
    expect(getByTestId('items-count').textContent).toBe('0');
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('ecommerce_cart');
  });

  test('saves cart to localStorage when cart changes', async () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      fireEvent.click(getByTestId('add-item'));
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'ecommerce_cart',
      expect.stringContaining('"totalItems":2')
    );
  });

  test('throws error when useCart is used outside provider', () => {
    function ComponentWithoutProvider() {
      useCart(); // This should throw
      return <div>Test</div>;
    }

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useCart must be used within a CartProvider');
  });
});