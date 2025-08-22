# Development Guide

## 🏴‍☠️ Welcome Aboard, Developer!

This guide will help ye navigate the treacherous waters of developing the Product Catalog UI. Whether ye be a seasoned sailor or a landlubber just starting out, this guide has everything ye need to contribute effectively.

## 🛠️ Development Environment Setup

### Required Tools

- **Bun** (latest): Our trusty JavaScript runtime
- **Git**: For version control
- **VS Code** (recommended): With TypeScript and Tailwind extensions

### Initial Setup

```bash
# Clone and navigate to the project
git clone <repository-url>
cd product-catalog-ui

# Install dependencies
bun install

# Start development server
bun dev
```

## 🏗️ Project Architecture

### File Organization

```
src/
├── App.tsx              # Main React application
├── index.tsx            # Bun server (backend + frontend serving)
├── frontend.tsx         # Frontend-only entry point
├── index.html           # HTML template
├── index.css            # Global styles and Tailwind imports
└── components/          # Reusable React components
    ├── ui/              # Basic UI components (buttons, inputs, etc.)
    ├── layout/          # Layout components (header, footer, etc.)
    └── features/        # Feature-specific components
```

### Technology Decisions

- **Bun over Node.js**: Faster runtime and package manager
- **React 19**: Latest React with concurrent features
- **Tailwind CSS 4.0**: Utility-first styling with improved performance
- **TypeScript**: Type safety and better developer experience
- **Bun Test**: Native testing without additional test runners

## 🎨 Component Development

### Component Structure

Follow this pattern for new components:

```typescript
// src/components/features/ProductCard.tsx
import { FC } from 'react';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export const ProductCard: FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {/* Component content */}
    </div>
  );
};

export default ProductCard;
```

### Styling Guidelines

1. **Use Tailwind CSS classes** for styling
2. **Follow mobile-first approach** with responsive breakpoints
3. **Maintain consistent spacing** using Tailwind's spacing scale
4. **Use semantic color names** from the design system
5. **Keep dark theme compatibility** in mind

### Component Checklist

- [ ] TypeScript interface for props
- [ ] Default props where appropriate
- [ ] Responsive design
- [ ] Accessibility attributes
- [ ] Error boundaries where needed
- [ ] Unit tests
- [ ] Documentation comments

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user flow testing (planned)

### Writing Tests

```typescript
// src/components/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  // ... other properties
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test ProductCard.test.tsx
```

## 🔄 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/product-search

# Start development server
bun dev

# Make changes and test locally
# Visit http://localhost:3000

# Run tests
bun test

# Commit changes
git add .
git commit -m "Add product search functionality"

# Push and create PR
git push origin feature/product-search
```

### 2. Code Quality

#### Linting (Planned)

```bash
# Check code quality
bun run lint

# Fix auto-fixable issues
bun run lint:fix
```

#### Type Checking

```bash
# Check TypeScript types
bun run type-check
```

### 3. Build Testing

```bash
# Test production build
bun run build
bun start

# Verify functionality at http://localhost:3000
```

## 🚀 Performance Considerations

### Bundle Size

- Keep dependencies minimal
- Use dynamic imports for large features
- Monitor bundle size with build output

### Runtime Performance

- Use React.memo for expensive components
- Implement virtualization for long lists
- Optimize images and assets

### Build Performance

- Bun's fast bundler handles most optimizations
- Custom build script allows fine-tuning

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```bash
# .env
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000/api
```

### Tailwind Configuration

Tailwind CSS 4.0 uses automatic configuration, but custom styles can be added in `src/index.css`.

### TypeScript Configuration

The `tsconfig.json` is optimized for modern React development with strict type checking enabled.

## 🐛 Debugging

### Development Tools

1. **React DevTools**: Browser extension for React debugging
2. **Bun Debugger**: Built-in debugging capabilities
3. **Browser DevTools**: Network, console, and performance tabs

### Common Issues

#### Hot Reloading Not Working

```bash
# Restart the dev server
bun dev
```

#### Type Errors

```bash
# Check TypeScript errors
bun run type-check
```

#### Build Failures

```bash
# Clean and rebuild
rm -rf dist/
bun run build
```

## 📊 Code Standards

### Naming Conventions

- **Components**: PascalCase (`ProductCard`)
- **Files**: PascalCase for components (`ProductCard.tsx`)
- **Variables**: camelCase (`productList`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PRODUCTS_PER_PAGE`)

### Import Organization

```typescript
// External libraries
import { FC, useState } from 'react';

// Internal utilities
import { formatPrice } from '../utils/currency';

// Components
import { Button } from './ui/Button';

// Types
import type { Product } from '../types/Product';
```

### File Structure

```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Constants
// 4. Component definition
// 5. Default export
```

## 🎯 Next Steps

### Immediate Tasks

1. Create basic UI components (Button, Input, Card)
2. Implement product data structure
3. Build ProductCatalog container
4. Add routing (React Router)

### Future Considerations

1. State management (Zustand or Redux Toolkit)
2. API client library (axios or fetch wrapper)
3. Authentication system
4. Payment integration
5. Admin dashboard

## 🆘 Getting Help

- Check the console for error messages
- Review this documentation
- Check existing tests for examples
- Look at similar components for patterns

Happy coding, ye scurvy developer! 🏴‍☠️