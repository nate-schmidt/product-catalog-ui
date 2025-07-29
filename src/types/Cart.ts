/**
 * Cart-related type definitions for the shopping cart functionality
 */

import { Product, ProductVariant } from './Product';

export interface CartItem {
  /** Unique identifier for the cart item */
  id: string;
  /** Reference to the product */
  product: Product;
  /** Selected product variant (if applicable) */
  variant?: ProductVariant;
  /** Quantity of this item in the cart */
  quantity: number;
  /** Timestamp when item was added to cart */
  addedAt: Date;
}

export interface Cart {
  /** Unique cart identifier */
  id: string;
  /** Array of items in the cart */
  items: CartItem[];
  /** Total number of items in cart */
  totalItems: number;
  /** Subtotal price in cents */
  subtotal: number;
  /** Tax amount in cents */
  tax: number;
  /** Shipping cost in cents */
  shipping: number;
  /** Total price including tax and shipping */
  total: number;
  /** Cart creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  payload?: {
    product?: Product;
    variant?: ProductVariant;
    quantity?: number;
    itemId?: string;
  };
}