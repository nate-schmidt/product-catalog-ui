# CartIcon Component

## Overview

The `CartIcon` component displays a shopping cart icon with a badge showing the number of items in the cart. It serves as a visual indicator and quick access point to the user's shopping cart.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `itemCount` | `number` | `0` | The number of items currently in the cart |
| `onClick` | `() => void` | - | Handler function called when the cart icon is clicked |
| `className` | `string` | `''` | Additional CSS classes to apply to the component |

## Usage

```tsx
import { CartIcon } from './components/CartIcon';

function Header() {
  const handleCartClick = () => {
    // Navigate to cart or open cart drawer
  };

  return (
    <CartIcon 
      itemCount={3} 
      onClick={handleCartClick}
      className="text-white"
    />
  );
}
```

## Features

- Displays a shopping cart icon (SVG)
- Shows item count badge when items > 0
- Badge automatically hides when cart is empty
- Accessible with proper ARIA labels
- Customizable styling through className prop

## Styling

The component uses Tailwind CSS classes by default but can be customized through the `className` prop. The badge uses absolute positioning relative to the icon.

## Accessibility

- Uses semantic HTML button element
- Includes proper ARIA labels
- Keyboard navigable
- Screen reader friendly item count announcement