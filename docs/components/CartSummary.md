# CartSummary Component

## Overview

The `CartSummary` component displays a summary of the shopping cart including subtotal, taxes, shipping, and total amount. It typically appears in the cart page or checkout flow.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CartItemType[]` | - | Array of cart items |
| `shipping` | `number` | `0` | Shipping cost |
| `taxRate` | `number` | `0` | Tax rate as decimal (e.g., 0.08 for 8%) |
| `onCheckout` | `() => void` | - | Handler for checkout button click |
| `coupon` | `CouponType?` | `null` | Applied coupon information |

## Type Definitions

```typescript
interface CouponType {
  code: string;
  discount: number; // Amount or percentage
  type: 'fixed' | 'percentage';
}
```

## Usage

```tsx
import { CartSummary } from './components/CartSummary';

function CartPage() {
  const handleCheckout = () => {
    // Navigate to checkout
  };

  return (
    <CartSummary
      items={cartItems}
      shipping={5.99}
      taxRate={0.08}
      onCheckout={handleCheckout}
      coupon={appliedCoupon}
    />
  );
}
```

## Features

- Calculates and displays subtotal
- Shows applied discounts/coupons
- Calculates tax based on subtotal
- Displays shipping costs
- Shows final total
- Checkout call-to-action button
- Coupon code input field

## Calculations

1. **Subtotal**: Sum of (item.price × item.quantity) for all items
2. **Discount**: Applied based on coupon type
3. **Tax**: (Subtotal - Discount) × taxRate
4. **Total**: Subtotal - Discount + Tax + Shipping

## Component Structure

```
CartSummary
├── Order Summary Title
├── Line Items
│   ├── Subtotal
│   ├── Discount (if applicable)
│   ├── Shipping
│   └── Tax
├── Divider
├── Total Amount
├── Coupon Input (optional)
└── Checkout Button
```

## Styling

- Clean, minimal design with clear hierarchy
- Uses Tailwind CSS for styling
- Responsive layout
- Prominent total and CTA button

## Additional Features

- Loading state during checkout
- Error handling for invalid coupons
- Free shipping threshold indicator
- Estimated delivery date display