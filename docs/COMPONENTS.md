# Component Documentation

## Overview

This document describes the React components available in the Product Catalog UI application. Components are organized by category and include usage examples, props documentation, and accessibility notes.

## Current Components

### App Component

**Location**: `src/App.tsx`

The main application component that renders the welcome page.

```typescript
export function App(): JSX.Element
```

**Features:**
- Responsive layout with max-width container
- Centered content with hero messaging
- Dark theme with white text
- Tailwind CSS styling

**Usage:**
```typescript
import { App } from './App';

// Rendered automatically by the application
```

## Planned Components

### Core UI Components

#### Button

**Location**: `src/components/ui/Button.tsx` (planned)

A reusable button component with multiple variants.

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Usage:**
```typescript
<Button variant="primary" size="lg" onClick={handleClick}>
  Add to Cart
</Button>
```

#### Input

**Location**: `src/components/ui/Input.tsx` (planned)

A styled input component with validation support.

```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}
```

#### Card

**Location**: `src/components/ui/Card.tsx` (planned)

A flexible card container component.

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}
```

### Feature Components

#### ProductCard

**Location**: `src/components/features/ProductCard.tsx` (planned)

Displays individual product information in a card format.

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  showAddToCart?: boolean;
  className?: string;
}
```

**Features:**
- Product image with lazy loading
- Price display with currency formatting
- Add to cart functionality
- Responsive design
- Accessibility support

**Usage:**
```typescript
<ProductCard 
  product={product} 
  onAddToCart={handleAddToCart}
  onProductClick={handleProductClick}
  showAddToCart={true}
/>
```

#### ProductCatalog

**Location**: `src/components/features/ProductCatalog.tsx` (planned)

Main container component for displaying products in a grid layout.

```typescript
interface ProductCatalogProps {
  products: Product[];
  loading?: boolean;
  error?: string;
  onProductSelect?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}
```

**Features:**
- Responsive grid layout
- Loading and error states
- Empty state handling
- Virtual scrolling for large datasets
- Search and filter integration

#### SearchBar

**Location**: `src/components/features/SearchBar.tsx` (planned)

Search input with real-time filtering capabilities.

```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
  debounceMs?: number;
  className?: string;
}
```

#### CategoryFilter

**Location**: `src/components/features/CategoryFilter.tsx` (planned)

Category filtering component with multi-select support.

```typescript
interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryIds: string[]) => void;
  className?: string;
}
```

### Layout Components

#### Header

**Location**: `src/components/layout/Header.tsx` (planned)

Application header with navigation and cart icon.

```typescript
interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
}
```

#### Footer

**Location**: `src/components/layout/Footer.tsx` (planned)

Application footer with links and company information.

```typescript
interface FooterProps {
  className?: string;
}
```

## Component Guidelines

### Design Principles

1. **Responsive First**: All components should work on mobile, tablet, and desktop
2. **Accessibility**: Include proper ARIA labels, keyboard navigation, and screen reader support
3. **Performance**: Use React.memo for expensive components, lazy loading for images
4. **Consistency**: Follow established patterns for props and styling
5. **Testability**: Write components that are easy to test and mock

### Props Conventions

- Use TypeScript interfaces for all props
- Include `className` prop for style overrides
- Use optional props with sensible defaults
- Include callback props for user interactions
- Follow React naming conventions (on*, handle*, is*, has*)

### Styling Approach

- Use Tailwind CSS utility classes
- Create component-specific styles only when necessary
- Follow the design system color palette
- Maintain dark theme compatibility
- Use responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### Accessibility Requirements

- Include semantic HTML elements
- Add ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain proper color contrast
- Support screen readers
- Handle focus management

### Testing Requirements

Each component should include:

- **Render tests**: Component renders without crashing
- **Props tests**: Props are handled correctly
- **Interaction tests**: User interactions work as expected
- **Accessibility tests**: Basic a11y requirements met
- **Snapshot tests**: UI consistency (when appropriate)

### Example Component Template

```typescript
import { FC, forwardRef } from 'react';
import { cn } from '../utils/classnames'; // utility for merging classes

interface ComponentNameProps {
  // Required props
  children: React.ReactNode;
  
  // Optional props with defaults
  variant?: 'default' | 'alternate';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  
  // Event handlers
  onClick?: (event: React.MouseEvent) => void;
  
  // Style override
  className?: string;
}

/**
 * ComponentName provides [brief description of functionality]
 * 
 * @example
 * <ComponentName variant="primary" onClick={handleClick}>
 *   Content here
 * </ComponentName>
 */
export const ComponentName: FC<ComponentNameProps> = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  className
}) => {
  return (
    <div 
      className={cn(
        'base-styles',
        variant === 'default' && 'default-styles',
        variant === 'alternate' && 'alternate-styles',
        size === 'sm' && 'small-styles',
        size === 'md' && 'medium-styles',
        size === 'lg' && 'large-styles',
        disabled && 'disabled-styles',
        className
      )}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};

export default ComponentName;
```

## File Organization

### Directory Structure

```
src/components/
├── ui/                    # Basic, reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── index.ts          # Barrel exports
├── layout/               # Layout-specific components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── index.ts
├── features/             # Feature-specific components
│   ├── ProductCard.tsx
│   ├── ProductCatalog.tsx
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx
│   └── index.ts
└── __tests__/           # Component tests
    ├── Button.test.tsx
    ├── ProductCard.test.tsx
    └── ...
```

### Barrel Exports

Each directory should include an `index.ts` file for clean imports:

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Modal } from './Modal';
```

This allows for clean imports:
```typescript
import { Button, Input, Card } from '../components/ui';
```

## Documentation Standards

### Component Documentation

Each component file should include:

1. **TSDoc comments** with description and examples
2. **Props interface** with detailed comments
3. **Usage examples** in the component file or separate examples
4. **Accessibility notes** for complex interactions

### README per Feature

For complex features, consider adding a README:

```
src/components/features/ProductCatalog/
├── ProductCatalog.tsx
├── ProductCard.tsx
├── SearchBar.tsx
├── CategoryFilter.tsx
└── README.md              # Feature overview and usage
```

## Future Enhancements

- **Storybook integration** for component development
- **Visual regression testing** with Chromatic
- **Component performance monitoring**
- **Automated accessibility testing**
- **Design system documentation**