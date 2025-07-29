# Component Library Documentation

A comprehensive, well-documented component library for the Product Catalog UI built with React, TypeScript, and Tailwind CSS.

## 📁 Structure

```
src/components/
├── ui/           # Reusable UI components
├── product/      # Product-specific components  
├── layout/       # Layout and navigation components
├── cart/         # Shopping cart components
├── index.ts      # Main export file
└── README.md     # This file
```

## 🚀 Getting Started

### Import Components

You can import components in several ways:

```tsx
// Method 1: Import from specific categories (recommended for tree-shaking)
import { Button, Card, Input } from '@/components/ui';
import { ProductCard, ProductGrid } from '@/components/product';
import { Header, Footer } from '@/components/layout';
import { CartItem, CartSummary } from '@/components/cart';

// Method 2: Import from main index
import { Button, ProductCard, Header, CartItem } from '@/components';

// Method 3: Import individual components
import { Button } from '@/components/ui/Button';
```

### TypeScript Support

All components include comprehensive TypeScript interfaces:

```tsx
import { ButtonProps, ProductCardProps } from '@/components/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## 📋 Component Categories

### 🎨 UI Components (`/ui`)

Core reusable components for building interfaces:

- **Button** - Multiple variants (primary, secondary, outline, ghost, destructive)
- **Card** - Container component with Header, Body, Footer sections
- **Input** - Form input with label, error states, and icons
- **Badge** - Status indicators and labels

**Features:**
- Multiple size variants (sm, md, lg, xl)
- Consistent styling with Tailwind CSS
- Loading states and disabled states
- Accessibility support (ARIA labels, focus management)
- Comprehensive prop interfaces

### 🛍️ Product Components (`/product`)

Specialized components for product catalog functionality:

- **ProductCard** - Display individual products with images, pricing, ratings
- **ProductGrid** - Responsive grid layout for product listings

**Features:**
- Responsive design (1-6 columns)
- Wishlist functionality
- Add to cart integration
- Loading skeletons
- Empty states
- Product badges (New, Sale, Out of Stock)
- Star ratings display

### 🏗️ Layout Components (`/layout`)

Components for page structure and navigation:

- **Header** - Site navigation with search, cart, user menu
- **Footer** - Site footer with links, social media, newsletter

**Features:**
- Responsive mobile/desktop layouts
- Search functionality
- Cart item counter with badge
- User authentication states
- Social media integration
- Newsletter signup

### 🛒 Cart Components (`/cart`)

Shopping cart and checkout related components:

- **CartItem** - Individual cart item with quantity controls
- **CartSummary** - Order summary with totals and checkout

**Features:**
- Quantity increment/decrement
- Price calculations (subtotal, tax, shipping)
- Discount support
- Empty cart states
- Remove item functionality
- Checkout integration

## 🎯 Design Principles

### Consistency
- Uniform spacing and typography using Tailwind CSS
- Consistent color palette and component variants
- Standardized prop naming conventions

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Semantic HTML structure

### Performance
- Tree-shaking friendly exports
- Lazy loading for images
- Optimized re-renders with React best practices

### Developer Experience
- Comprehensive TypeScript interfaces
- JSDoc documentation with examples
- Clear prop descriptions
- Consistent API patterns

## 📖 Usage Examples

### Basic Product Listing

```tsx
import { ProductGrid } from '@/components/product';
import { Header, Footer } from '@/components/layout';

function ProductListingPage() {
  return (
    <>
      <Header 
        siteName="My Store"
        cartItemCount={3}
        onCartClick={() => openCart()}
      />
      
      <main className="container mx-auto py-8">
        <ProductGrid 
          products={products}
          columns={4}
          onProductClick={(product) => navigate(`/products/${product.slug}`)}
          onAddToCart={(product) => addToCart(product)}
        />
      </main>
      
      <Footer siteName="My Store" />
    </>
  );
}
```

### Shopping Cart Page

```tsx
import { CartItem, CartSummary } from '@/components/cart';
import { Button } from '@/components/ui';

function CartPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        ))}
      </div>
      
      <div>
        <CartSummary
          cart={cart}
          onCheckout={() => proceedToCheckout()}
          onContinueShopping={() => navigate('/products')}
        />
      </div>
    </div>
  );
}
```

## 🎨 Theming & Customization

### Tailwind CSS Classes
All components use Tailwind CSS classes and can be customized by:

1. **className prop** - Add custom classes to any component
2. **CSS overrides** - Override component styles in your CSS
3. **Tailwind config** - Modify colors, spacing, etc. in `tailwind.config.js`

### Component Variants
Most components support multiple variants:

```tsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// Card variants  
<Card variant="elevated">Elevated</Card>
<Card variant="outlined">Outlined</Card>
```

## 🔧 Development

### Adding New Components

1. Create component file in appropriate category directory
2. Include comprehensive TypeScript interfaces
3. Add JSDoc documentation with examples
4. Export from category index file
5. Update main components index
6. Add usage examples to README

### Component Template

```tsx
import React from 'react';

/**
 * Props interface for the MyComponent component
 */
export interface MyComponentProps {
  /** Component description */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MyComponent description and purpose
 * 
 * @example
 * ```tsx
 * <MyComponent>
 *   Example usage
 * </MyComponent>
 * ```
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`base-classes ${className}`} {...props}>
      {children}
    </div>
  );
};

export default MyComponent;
```

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)