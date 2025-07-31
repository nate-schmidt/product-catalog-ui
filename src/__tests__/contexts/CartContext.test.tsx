import { describe, test, expect, beforeEach, jest } from 'bun:test';
import React from 'react';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { 
  renderWithProviders, 
  createMockProduct,
  createMockCart,
  createMockCartItem,
  cleanupAfterEach,
  screen,
  fireEvent,
  waitFor,
  render
} from '../utils/test-helpers';

// Test component to access cart context
const TestCartComponent: React.FC = () => {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    isOpen, 
    toggleCart 
  } = useCart();

  return (
    <div>
      <div data-testid="cart-item-count">{cart.itemCount}</div>
      <div data-testid="cart-total">{cart.total}</div>
      <div data-testid="cart-is-open">{isOpen.toString()}</div>
      <button 
        data-testid="add-to-cart" 
        onClick={() => addToCart(createMockProduct({ id: 'test-1', price: 10 }))}
      >
        Add to Cart
      </button>
      <button 
        data-testid="remove-from-cart" 
        onClick={() => removeFromCart('test-1')}
      >
        Remove from Cart
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity('test-1', 5)}
      >
        Update Quantity
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={clearCart}
      >
        Clear Cart
      </button>
      <button 
        data-testid="toggle-cart" 
        onClick={toggleCart}
      >
        Toggle Cart
      </button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    cleanupAfterEach();
  });

  test('provides initial cart state', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    expect(screen.getByTestId('cart-is-open')).toHaveTextContent('false');
  });

  test('throws error when useCart is used outside CartProvider', () => {
    const TestComponent = () => {
      try {
        useCart();
        return <div>Should not render</div>;
      } catch (error) {
        return <div data-testid="error">{(error as Error).message}</div>;
      }
    };

    render(<TestComponent />);
    
    expect(screen.getByTestId('error')).toHaveTextContent(
      'useCart must be used within a CartProvider'
    );
  });

  test('addToCart adds new item to cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('10');
    });
  });

  test('addToCart increases quantity for existing item', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    
    // Add item twice
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('20');
    });
  });

  test('removeFromCart removes item from cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const removeButton = screen.getByTestId('remove-from-cart');
    
    // Add then remove
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
    });

    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });
  });

  test('updateQuantity changes item quantity', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const updateButton = screen.getByTestId('update-quantity');
    
    // Add item then update quantity
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
    });

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('5');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('50');
    });
  });

  test('updateQuantity with zero removes item', async () => {
    const TestComponent = () => {
      const { cart, addToCart, updateQuantity } = useCart();
      
      return (
        <div>
          <div data-testid="cart-item-count">{cart.itemCount}</div>
          <button 
            data-testid="add-to-cart" 
            onClick={() => addToCart(createMockProduct({ id: 'test-1', price: 10 }))}
          >
            Add to Cart
          </button>
          <button 
            data-testid="set-zero-quantity" 
            onClick={() => updateQuantity('test-1', 0)}
          >
            Set Zero Quantity
          </button>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const zeroButton = screen.getByTestId('set-zero-quantity');
    
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
    });

    fireEvent.click(zeroButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0');
    });
  });

  test('clearCart empties the cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    const clearButton = screen.getByTestId('clear-cart');
    
    // Add multiple items
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2');
    });

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('0');
    });
  });

  test('toggleCart changes open state', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const toggleButton = screen.getByTestId('toggle-cart');
    
    expect(screen.getByTestId('cart-is-open')).toHaveTextContent('false');

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-is-open')).toHaveTextContent('true');
    });

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-is-open')).toHaveTextContent('false');
    });
  });

  test('addToCart with custom quantity', async () => {
    const TestComponent = () => {
      const { cart, addToCart } = useCart();
      
      return (
        <div>
          <div data-testid="cart-item-count">{cart.itemCount}</div>
          <div data-testid="cart-total">{cart.total}</div>
          <button 
            data-testid="add-multiple" 
            onClick={() => addToCart(createMockProduct({ id: 'test-1', price: 10 }), 3)}
          >
            Add 3 to Cart
          </button>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-multiple');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('3');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('30');
    });
  });

  test('loads cart from storage on mount', async () => {
    // Pre-populate localStorage with cart data
    const savedCart = createMockCart({
      items: [createMockCartItem({ 
        product: createMockProduct({ id: 'saved-item', price: 25 }), 
        quantity: 2 
      })]
    });
    
    localStorage.setItem('ecommerce_cart', JSON.stringify({
      items: savedCart.items,
      timestamp: Date.now()
    }));

    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('50');
    });
  });

  test('saves cart to storage when cart changes', async () => {
    const TestComponent = () => {
      const { addToCart } = useCart();
      
      return (
        <button 
          data-testid="add-to-cart" 
          onClick={() => addToCart(createMockProduct({ id: 'test-1', price: 15 }))}
        >
          Add to Cart
        </button>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      const savedData = localStorage.getItem('ecommerce_cart');
      expect(savedData).not.toBeNull();
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        expect(parsed.items).toHaveLength(1);
        expect(parsed.items[0].product.id).toBe('test-1');
      }
    });
  });

  test('cart state persistence across re-renders', async () => {
    const TestComponent = () => {
      const { cart, addToCart } = useCart();
      
      return (
        <div>
          <div data-testid="cart-item-count">{cart.itemCount}</div>
          <button 
            data-testid="add-to-cart" 
            onClick={() => addToCart(createMockProduct({ id: 'persist-test', price: 20 }))}
          >
            Add to Cart
          </button>
        </div>
      );
    };

    const { rerender } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
    });

    // Re-render the component
    rerender(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // State should persist
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
  });

  test('handles multiple products correctly', async () => {
    const TestComponent = () => {
      const { cart, addToCart } = useCart();
      
      return (
        <div>
          <div data-testid="cart-item-count">{cart.itemCount}</div>
          <div data-testid="cart-total">{cart.total}</div>
          <div data-testid="cart-items-length">{cart.items.length}</div>
          <button 
            data-testid="add-product-1" 
            onClick={() => addToCart(createMockProduct({ id: 'product-1', price: 10 }))}
          >
            Add Product 1
          </button>
          <button 
            data-testid="add-product-2" 
            onClick={() => addToCart(createMockProduct({ id: 'product-2', price: 20 }))}
          >
            Add Product 2
          </button>
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    const addButton1 = screen.getByTestId('add-product-1');
    const addButton2 = screen.getByTestId('add-product-2');
    
    fireEvent.click(addButton1);
    fireEvent.click(addButton2);

    await waitFor(() => {
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2');
      expect(screen.getByTestId('cart-total')).toHaveTextContent('30');
      expect(screen.getByTestId('cart-items-length')).toHaveTextContent('2');
    });
  });
});