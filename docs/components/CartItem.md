# CartItem Component

## Overview

The `CartItem` component represents a single item in the shopping cart. It displays product information, quantity controls, and allows for item removal.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `CartItemType` | - | The cart item data object |
| `onQuantityChange` | `(id: string, quantity: number) => void` | - | Handler for quantity updates |
| `onRemove` | `(id: string) => void` | - | Handler for item removal |

## Type Definitions

```typescript
interface CartItemType {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}
```

## Usage

```tsx
import { CartItem } from './components/CartItem';

function ShoppingCart() {
  const handleQuantityChange = (id: string, quantity: number) => {
    // Update cart item quantity
  };

  const handleRemove = (id: string) => {
    // Remove item from cart
  };

  return (
    <CartItem
      item={cartItem}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
    />
  );
}
```

## Features

- Product image display (with fallback)
- Product name and variant information
- Price display (individual and total)
- Quantity selector with increment/decrement buttons
- Remove item button
- Responsive layout

## Component Structure

```
CartItem
├── Product Image
├── Product Details
│   ├── Name
│   ├── Variant (if applicable)
│   └── Unit Price
├── Quantity Controls
│   ├── Decrement Button
│   ├── Quantity Display
│   └── Increment Button
├── Line Total
└── Remove Button
```

## Styling

Uses Tailwind CSS with a card-like appearance. The layout is responsive, stacking on mobile and displaying horizontally on larger screens.

## Behavior

- Quantity cannot go below 1 (remove item instead)
- Shows loading state during updates
- Displays error states if update fails
- Smooth animations for quantity changes