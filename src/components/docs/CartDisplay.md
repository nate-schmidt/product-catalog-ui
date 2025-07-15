# CartDisplay Component

## Overview

The `CartDisplay` component renders the shopping cart interface, allowing users to view, modify, and manage items in their cart. It can be displayed as a slide-out drawer, modal, or inline component.

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **required** | Controls the visibility of the cart |
| `onClose` | `() => void` | **required** | Callback when cart is closed |
| `displayMode` | `'drawer' \| 'modal' \| 'inline'` | `'drawer'` | Display style of the cart |
| `showCheckoutButton` | `boolean` | `true` | Show/hide checkout button |
| `onCheckout` | `() => void` | `undefined` | Callback for checkout action |
| `emptyCartMessage` | `string` | `'Your cart is empty'` | Message shown when cart is empty |

### Example Usage

```tsx
import { CartDisplay } from './components/CartDisplay';
import { useState } from 'react';

function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <button onClick={() => setCartOpen(true)}>
        Cart (3)
      </button>
      
      <CartDisplay 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        displayMode="drawer"
        showCheckoutButton={true}
        onCheckout={() => navigate('/checkout')}
      />
    </>
  );
}
```

## Features

### 1. Cart Item Display
- Product image thumbnail
- Product name and variant details
- Unit price and line total
- Quantity selector
- Remove item button

### 2. Cart Summary
- Subtotal calculation
- Tax estimation
- Shipping cost display
- Total amount
- Savings/discount display

### 3. Interactive Elements
- Quantity increment/decrement buttons
- Remove item with confirmation
- Clear cart option
- Continue shopping link
- Checkout button

## Internal Components

### CartItem
```tsx
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}
```

### CartSummary
```tsx
interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}
```

## State Integration

The component integrates with `CartContext` for state management:

```tsx
const {
  items,
  totalItems,
  totalPrice,
  updateQuantity,
  removeFromCart,
  clearCart
} = useCart();
```

## Styling Variants

### Drawer Mode (Default)
```css
- Slides in from right
- Fixed position overlay
- Responsive width (100% mobile, 400px desktop)
- Smooth animation transitions
```

### Modal Mode
```css
- Centered overlay
- Fixed dimensions
- Backdrop blur effect
- ESC key to close
```

### Inline Mode
```css
- No overlay
- Fits within parent container
- Suitable for cart pages
- Full width responsive
```

## Animations

```typescript
const animations = {
  drawer: {
    enter: 'transform transition ease-in-out duration-300',
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leave: 'transform transition ease-in-out duration-300',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full'
  }
};
```

## Accessibility Features

- Focus trap when open
- ESC key to close
- Proper ARIA labels
- Screen reader announcements
- Keyboard navigation for all controls

## Event Handling

```typescript
// Quantity Update
const handleQuantityChange = (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) {
    handleRemoveItem(itemId);
  } else {
    updateQuantity(itemId, newQuantity);
  }
};

// Remove Item
const handleRemoveItem = (itemId: string) => {
  if (confirmRemoval) {
    const confirmed = window.confirm('Remove this item?');
    if (confirmed) {
      removeFromCart(itemId);
    }
  } else {
    removeFromCart(itemId);
  }
};
```

## Performance Optimizations

1. **Memoized Calculations**: Total price calculations are memoized
2. **Optimistic Updates**: UI updates before API confirmation
3. **Image Lazy Loading**: Product thumbnails load on demand
4. **Debounced Updates**: Quantity changes are debounced

## Testing Scenarios

```typescript
describe('CartDisplay', () => {
  it('displays cart items correctly');
  it('calculates totals accurately');
  it('handles quantity updates');
  it('removes items from cart');
  it('shows empty cart state');
  it('closes on overlay click');
  it('prevents body scroll when open');
  it('handles checkout action');
});
```

## Error States

| State | UI Response |
|-------|-------------|
| Failed quantity update | Show error toast, revert to previous value |
| Remove item failure | Show error message, keep item in cart |
| Invalid coupon code | Display inline error message |
| Network error | Show retry button |

## Customization Examples

### Custom Item Renderer
```tsx
<CartDisplay
  renderItem={(item) => (
    <CustomCartItem item={item} />
  )}
/>
```

### Custom Empty State
```tsx
<CartDisplay
  emptyCartComponent={
    <EmptyCart 
      onShopNow={() => navigate('/products')}
    />
  }
/>
```

## Best Practices

1. **Optimistic Updates**: Update UI immediately for better UX
2. **Persistent Cart**: Save cart state to localStorage
3. **Stock Validation**: Check stock before checkout
4. **Price Verification**: Validate prices on server
5. **Loading States**: Show spinners during updates