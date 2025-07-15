# Product Catalog UI

This is the frontend application for a modern e-commerce product catalog system, built with React, TypeScript, and Bun.

## Technology Stack

- **Runtime**: Bun (fast all-in-one JavaScript runtime)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Bun's built-in bundler
- **Testing**: Bun test runner with React Testing Library

## Getting Started

### Prerequisites

- Bun 1.1.44 or higher
- Node.js 18+ (for compatibility)

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# The app will be available at http://localhost:3000
```

### Building

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## Documentation

### Component Documentation

Comprehensive documentation for all React components is available:

- **[Components Overview](src/docs/components.md)** - Complete guide to all components
- **Individual Component Docs:**
  - [App Component](src/components/docs/App.md) - Root component and routing
  - [ProductCatalog](src/components/docs/ProductCatalog.md) - Product listing with filters
  - [CartDisplay](src/components/docs/CartDisplay.md) - Shopping cart UI
  - [CartContext](src/components/docs/CartContext.md) - Cart state management

### API Integration

The frontend integrates with the Java backend service. See component documentation for specific API endpoints and data formats.

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
