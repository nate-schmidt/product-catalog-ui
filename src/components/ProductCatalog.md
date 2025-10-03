# ProductCatalog Component

## Overview

The `ProductCatalog` component serves as the main product listing page, displaying a grid of furniture products available for purchase. It's a presentational component that renders a collection of product cards.

## Purpose

- Display all available products in a responsive grid layout
- Provide a clean, organized view of the product catalog
- Serve as the main landing page for browsing products

## Props

This component accepts no props. It uses a static array of products defined internally.

## Data Structure

The component uses a hardcoded array of `Product` objects with the following structure:

```typescript
Product {
  id: string;        // Unique product identifier (e.g., "prod-001")
  name: string;      // Product name (e.g., "Premium Sofa")
  manufacturer: string;  // Manufacturer name (e.g., "ComfortWorks")
  price: number;     // Product price in decimal format (e.g., 199.99)
}
```

## Current Products

The catalog currently displays `3` products:

1. **Premium Sofa** - ComfortWorks - `$199.99`
2. **Modern Chair** - UrbanSeating - `$99.99`
3. **Stylish Table** - TableMakers - `$149.99`

## Layout

- **Container**: Centered with automatic margins
- **Title**: Large (`4xl`), bold, white text, centered with bottom margin
- **Grid**: 
  - `1` column on mobile
  - `2` columns on medium screens (`md` breakpoint)
  - `3` columns on large screens (`lg` breakpoint)
  - `6` unit gap between cards

## Dependencies

- `Card` component - Renders individual product cards
- `Product` type from `../types/cart`

## Usage Example

```tsx
import ProductCatalog from './components/ProductCatalog';

function App() {
  return (
    <main>
      <ProductCatalog />
    </main>
  );
}
```

## Future Enhancements

- Replace hardcoded product data with API calls
- Add filtering and sorting capabilities
- Implement pagination or infinite scroll for larger catalogs
- Add search functionality
- Support for product categories

## Styling

Uses Tailwind CSS utility classes for responsive design and modern aesthetics.
