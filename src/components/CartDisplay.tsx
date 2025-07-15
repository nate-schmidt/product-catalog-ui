import React from 'react';
import { useCart } from '../CartContext';

/**
 * Props for CartItemRow component
 */
interface CartItemRowProps {
  /** Cart item to display */
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  };
  /** Callback when quantity is changed */
  onQuantityChange: (id: string, quantity: number) => void;
  /** Callback when item is removed */
  onRemove: (id: string) => void;
}

/**
 * Individual cart item row component
 * @internal
 */
const CartItemRow: React.FC<CartItemRowProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {item.imageUrl && (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="w-12 text-center">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

/**
 * CartDisplay Component
 * 
 * @component
 * @description A comprehensive shopping cart display component that shows all items
 * in the cart with quantity controls, pricing, and checkout functionality.
 * 
 * Features:
 * - Displays all cart items with images, names, and prices
 * - Quantity adjustment controls for each item
 * - Remove item functionality
 * - Total price calculation
 * - Empty cart state
 * - Clear cart functionality
 * - Responsive design
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <CartDisplay />
 * 
 * // Inside a page component
 * function CheckoutPage() {
 *   return (
 *     <div className="container mx-auto">
 *       <h1>Your Shopping Cart</h1>
 *       <CartDisplay />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @requires CartProvider - Must be wrapped in CartProvider to access cart context
 */
export const CartDisplay: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();

  /**
   * Handle checkout button click
   * @todo Implement actual checkout functionality
   */
  const handleCheckout = () => {
    console.log('Checkout clicked with items:', items);
    alert('Checkout functionality to be implemented');
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
        </h2>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear Cart
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {items.map(item => (
          <CartItemRow
            key={item.id}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total:</span>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        
        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDisplay;