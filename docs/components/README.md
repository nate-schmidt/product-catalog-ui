# Component Documentation

This directory contains documentation for all React components in the Product Catalog UI application.

## Component Overview

### Core Components

- **[App](./App.md)** - Root component that orchestrates the application
- **[ProductCatalog](./ProductCatalog.md)** - Main product browsing interface with filtering and sorting

### Cart Components

- **[CartIcon](./CartIcon.md)** - Shopping cart icon with item count badge
- **[CartItem](./CartItem.md)** - Individual item display in the shopping cart
- **[CartSummary](./CartSummary.md)** - Order summary with pricing calculations

## Component Categories

### 1. Layout Components
- `App` - Main application wrapper

### 2. Product Components
- `ProductCatalog` - Product grid with filters

### 3. Cart Components
- `CartIcon` - Cart status indicator
- `CartItem` - Cart item management
- `CartSummary` - Checkout summary

## Design Principles

All components follow these principles:

1. **TypeScript First** - Fully typed props and interfaces
2. **Accessibility** - WCAG compliant with proper ARIA labels
3. **Responsive Design** - Mobile-first approach using Tailwind CSS
4. **Performance** - Optimized rendering and lazy loading
5. **Reusability** - Composable and configurable through props

## Common Props

Most components support these common props:
- `className` - For custom styling
- `loading` - Loading state indicators
- `error` - Error state handling

## State Management

Components integrate with:
- React Context for global state (cart, user)
- Local state for UI interactions
- Custom hooks for business logic

## Styling

All components use:
- Tailwind CSS for utility-first styling
- CSS modules for component-specific styles (when needed)
- Consistent design tokens for colors, spacing, and typography

## Testing

Each component should have:
- Unit tests for logic
- Integration tests for user interactions
- Accessibility tests
- Visual regression tests (planned)

## Contributing

When adding new components:
1. Create the component in `src/components/`
2. Add TypeScript interfaces in `src/types/`
3. Write comprehensive documentation here
4. Include usage examples
5. Add tests

## Future Components

Planned components to be implemented:
- `ProductCard` - Individual product display
- `SearchBar` - Product search functionality
- `FilterPanel` - Advanced filtering options
- `Pagination` - Results pagination
- `ProductDetails` - Detailed product view
- `CheckoutForm` - Payment and shipping forms