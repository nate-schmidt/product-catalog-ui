### Cart

**Purpose**: Displays the user's shopping cart, item list, quantities, pricing breakdown, and actions.

### Props

- **items**: Array<{ id: string | number; name: string; price: number; quantity: number; image?: string }>
- **currency**: string — ISO code (e.g., USD).
- **onIncrement**: (id) => void — Increase quantity.
- **onDecrement**: (id) => void — Decrease quantity.
- **onRemove**: (id) => void — Remove line item.
- **applyCoupon**: (code: string) => Promise<void> | void — Apply coupon.
- **subtotal**: number — Calculated subtotal.
- **discount**: number — Discount amount (optional).
- **tax**: number — Tax amount (optional).
- **shipping**: number — Shipping cost (optional).
- **total**: number — Final total.
- **checkoutDisabled**: boolean — Disable checkout button.
- **onCheckout**: () => void — Checkout action.
- **className**: string — Optional container classes.

### Usage

```tsx
import { Cart } from './Cart';

export function Example() {
  const [items, setItems] = React.useState([
    { id: 1, name: 'Chair', price: 120, quantity: 1 },
    { id: 2, name: 'Lamp', price: 60, quantity: 2 },
  ]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  return (
    <Cart
      items={items}
      currency="USD"
      subtotal={subtotal}
      tax={tax}
      total={total}
      onIncrement={(id) =>
        setItems((xs) => xs.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x)))
      }
      onDecrement={(id) =>
        setItems((xs) => xs.map((x) => (x.id === id && x.quantity > 1 ? { ...x, quantity: x.quantity - 1 } : x)))
      }
      onRemove={(id) => setItems((xs) => xs.filter((x) => x.id !== id))}
      onCheckout={() => console.log('checkout')}
    />
  );
}
```

### Behavior

- Renders list of line items with quantity controls and remove action.
- Shows price breakdown and derived totals.
- Optional coupon input integrates with `applyCoupon`.

### Accessibility

- Buttons have accessible names (increment, decrement, remove, checkout).
- Table/list semantics for items; announce updates via `aria-live` where possible.

### Styling

- Responsive layout with stacked sections on small screens.
- Emphasize `total` and clear action hierarchy.

### Testing

- Verify increment/decrement/remove behavior.
- Edge cases: empty cart, large quantities, rounding.
- Ensure totals recompute when items change.

