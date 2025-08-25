/**
 * Comprehensive test suite for CartContext
 * Note: This context doesn't exist yet, but this demonstrates testing patterns
 */

import { test, expect, describe, beforeEach } from 'bun:test';
import { customRender, testDataFactories } from '../helpers/test-utils';
import { createContext, useContext, useReducer, ReactNode } from 'react';

// Mock cart types
interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  state: CartState;
  addItem: (product: any) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

// Mock cart reducer
const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return calculateCartState(updatedItems);
      }
      
      const newItem: CartItem = {
        id: Date.now(),
        productId: action.product.id,
        name: action.product.name,
        price: action.product.price,
        quantity: 1,
        image: action.product.image,
      };
      
      return calculateCartState([...state.items, newItem]);
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.itemId);
      return calculateCartState(updatedItems);
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== action.itemId);
        return calculateCartState(updatedItems);
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.itemId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return calculateCartState(updatedItems);
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

const calculateCartState = (items: CartItem[]): CartState => ({
  items,
  total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
});

// Mock CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

const MockCartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addItem = (product: any) => {
    dispatch({ type: 'ADD_ITEM', product });
  };

  const removeItem = (itemId: number) => {
    dispatch({ type: 'REMOVE_ITEM', itemId });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Test component that uses the cart context
const TestCartComponent = () => {
  const { state, addItem, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div data-testid="cart-component">
      <div data-testid="item-count">{state.itemCount}</div>
      <div data-testid="total">${state.total.toFixed(2)}</div>
      <div data-testid="items">
        {state.items.map(item => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            <span data-testid="item-name">{item.name}</span>
            <span data-testid="item-quantity">{item.quantity}</span>
            <span data-testid="item-price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <button 
        data-testid="add-product-button"
        onClick={() => addItem(testDataFactories.product({ 
          id: 1, 
          name: 'Test Product', 
          price: 29.99 
        }))}
      >
        Add Product
      </button>
      <button 
        data-testid="remove-first-item"
        onClick={() => state.items[0] && removeItem(state.items[0].id)}
      >
        Remove First Item
      </button>
      <button 
        data-testid="update-first-quantity"
        onClick={() => state.items[0] && updateQuantity(state.items[0].id, 5)}
      >
        Update First Quantity to 5
      </button>
      <button data-testid="clear-cart" onClick={clearCart}>
        Clear Cart
      </button>
    </div>
  );
};

describe('CartContext', () => {
  const renderWithCartProvider = (component: ReactNode) => {
    return customRender(
      <MockCartProvider>
        {component}
      </MockCartProvider>
    );
  };

  beforeEach(() => {
    // Reset any global state if needed
  });

  test('provides initial empty cart state', () => {
    const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

    expect(getByTestId('item-count').textContent).toBe('0');
    expect(getByTestId('total').textContent).toBe('$0.00');
  });

  test('throws error when useCart is used outside provider', () => {
    const TestComponent = () => {
      const cart = useCart();
      return <div>{cart.state.itemCount}</div>;
    };

    expect(() => customRender(<TestComponent />)).toThrow(
      'useCart must be used within a CartProvider'
    );
  });

  describe('addItem functionality', () => {
    test('adds new item to cart', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      getByTestId('add-product-button').click();

      expect(getByTestId('item-count').textContent).toBe('1');
      expect(getByTestId('total').textContent).toBe('$29.99');
    });

    test('increases quantity for existing item', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      // Add same product twice
      getByTestId('add-product-button').click();
      getByTestId('add-product-button').click();

      expect(getByTestId('item-count').textContent).toBe('2');
      expect(getByTestId('total').textContent).toBe('$59.98');
      
      // Should only have one item with quantity 2
      const items = getByTestId('items');
      expect(items.children.length).toBe(1);
      expect(getByTestId('item-quantity').textContent).toBe('2');
    });

    test('creates unique cart item IDs', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      getByTestId('add-product-button').click();
      
      const items = getByTestId('items');
      const firstItem = items.children[0];
      expect(firstItem.getAttribute('data-testid')).toMatch(/^item-\d+$/);
    });
  });

  describe('removeItem functionality', () => {
    test('removes item from cart', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      // Add item then remove it
      getByTestId('add-product-button').click();
      expect(getByTestId('item-count').textContent).toBe('1');

      getByTestId('remove-first-item').click();
      expect(getByTestId('item-count').textContent).toBe('0');
      expect(getByTestId('total').textContent).toBe('$0.00');
    });

    test('handles removing non-existent item gracefully', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      // Try to remove item when cart is empty
      getByTestId('remove-first-item').click();
      
      expect(getByTestId('item-count').textContent).toBe('0');
    });
  });

  describe('updateQuantity functionality', () => {
    test('updates item quantity', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      getByTestId('add-product-button').click();
      getByTestId('update-first-quantity').click();

      expect(getByTestId('item-count').textContent).toBe('5');
      expect(getByTestId('total').textContent).toBe('$149.95');
      expect(getByTestId('item-quantity').textContent).toBe('5');
    });

    test('removes item when quantity is set to zero', () => {
      const TestComponent = () => {
        const { state, addItem, updateQuantity } = useCart();
        
        return (
          <div>
            <div data-testid="item-count">{state.itemCount}</div>
            <button 
              data-testid="add-item"
              onClick={() => addItem(testDataFactories.product())}
            >
              Add
            </button>
            <button 
              data-testid="set-zero"
              onClick={() => state.items[0] && updateQuantity(state.items[0].id, 0)}
            >
              Set to Zero
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      getByTestId('add-item').click();
      expect(getByTestId('item-count').textContent).toBe('1');

      getByTestId('set-zero').click();
      expect(getByTestId('item-count').textContent).toBe('0');
    });

    test('removes item when quantity is negative', () => {
      const TestComponent = () => {
        const { state, addItem, updateQuantity } = useCart();
        
        return (
          <div>
            <div data-testid="item-count">{state.itemCount}</div>
            <button 
              data-testid="add-item"
              onClick={() => addItem(testDataFactories.product())}
            >
              Add
            </button>
            <button 
              data-testid="set-negative"
              onClick={() => state.items[0] && updateQuantity(state.items[0].id, -1)}
            >
              Set Negative
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      getByTestId('add-item').click();
      getByTestId('set-negative').click();
      
      expect(getByTestId('item-count').textContent).toBe('0');
    });
  });

  describe('clearCart functionality', () => {
    test('clears all items from cart', () => {
      const { getByTestId } = renderWithCartProvider(<TestCartComponent />);

      // Add multiple items
      getByTestId('add-product-button').click();
      getByTestId('add-product-button').click();
      expect(getByTestId('item-count').textContent).toBe('2');

      getByTestId('clear-cart').click();
      expect(getByTestId('item-count').textContent).toBe('0');
      expect(getByTestId('total').textContent).toBe('$0.00');
    });
  });

  describe('cart calculations', () => {
    test('calculates total correctly with multiple items', () => {
      const TestComponent = () => {
        const { state, addItem } = useCart();
        
        return (
          <div>
            <div data-testid="total">${state.total.toFixed(2)}</div>
            <button 
              data-testid="add-expensive"
              onClick={() => addItem(testDataFactories.product({ 
                id: 1, 
                price: 99.99 
              }))}
            >
              Add Expensive
            </button>
            <button 
              data-testid="add-cheap"
              onClick={() => addItem(testDataFactories.product({ 
                id: 2, 
                price: 9.99 
              }))}
            >
              Add Cheap
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      getByTestId('add-expensive').click();
      getByTestId('add-cheap').click();

      expect(getByTestId('total').textContent).toBe('$109.98');
    });

    test('calculates item count correctly', () => {
      const TestComponent = () => {
        const { state, addItem } = useCart();
        
        return (
          <div>
            <div data-testid="item-count">{state.itemCount}</div>
            <button 
              data-testid="add-item1"
              onClick={() => addItem(testDataFactories.product({ id: 1 }))}
            >
              Add Item 1
            </button>
            <button 
              data-testid="add-item2"
              onClick={() => addItem(testDataFactories.product({ id: 2 }))}
            >
              Add Item 2
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      getByTestId('add-item1').click();
      getByTestId('add-item1').click(); // Same item, should increase quantity
      getByTestId('add-item2').click(); // Different item

      expect(getByTestId('item-count').textContent).toBe('3'); // 2 + 1
    });
  });

  describe('edge cases', () => {
    test('handles products with missing properties', () => {
      const TestComponent = () => {
        const { state, addItem } = useCart();
        
        return (
          <div>
            <div data-testid="item-count">{state.itemCount}</div>
            <button 
              data-testid="add-minimal"
              onClick={() => addItem({ id: 1, name: 'Minimal', price: 0 })}
            >
              Add Minimal
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      expect(() => getByTestId('add-minimal').click()).not.toThrow();
      expect(getByTestId('item-count').textContent).toBe('1');
    });

    test('handles very large quantities', () => {
      const TestComponent = () => {
        const { state, addItem, updateQuantity } = useCart();
        
        return (
          <div>
            <div data-testid="item-count">{state.itemCount}</div>
            <div data-testid="total">${state.total.toFixed(2)}</div>
            <button 
              data-testid="add-item"
              onClick={() => addItem(testDataFactories.product({ price: 1 }))}
            >
              Add
            </button>
            <button 
              data-testid="set-large"
              onClick={() => state.items[0] && updateQuantity(state.items[0].id, 1000)}
            >
              Set Large Quantity
            </button>
          </div>
        );
      };

      const { getByTestId } = renderWithCartProvider(<TestComponent />);

      getByTestId('add-item').click();
      getByTestId('set-large').click();

      expect(getByTestId('item-count').textContent).toBe('1000');
      expect(getByTestId('total').textContent).toBe('$1000.00');
    });
  });
});