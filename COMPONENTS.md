# Components and Architecture Overview

This document provides a high-level overview of all components and architecture in the Product Catalog UI project.

## Current Architecture

### Frontend Components

#### Main Application Component
**Location**: `src/App.tsx`

The primary React component that renders the application's welcome screen.

**Responsibilities**:
- Displays welcome message and branding
- Provides responsive layout structure
- Serves as the main application entry point

**Dependencies**:
- Tailwind CSS for styling
- No external component dependencies

**Testing**: Comprehensive test suite in `src/App.test.tsx`

#### Frontend Entry Point
**Location**: `src/frontend.tsx`

Browser-side initialization component that mounts the React application.

**Responsibilities**:
- DOM readiness detection
- React root creation and rendering
- Application lifecycle management

### Server Components

#### API Server
**Location**: `src/index.tsx`

Bun-based server that provides both API endpoints and static file serving.

**API Endpoints**:
- `GET /api/hello` - Basic greeting endpoint
- `PUT /api/hello` - Greeting endpoint via PUT
- `GET /api/hello/:name` - Personalized greeting with parameter

**Server Features**:
- Single Page Application (SPA) routing support
- Development hot module replacement
- Console log forwarding in development
- Static asset serving

## Project Structure

```
src/
├── App.tsx              # Main React component
├── App.test.tsx         # Component tests
├── frontend.tsx         # Browser entry point
├── index.tsx            # Server entry point with API
├── index.html           # HTML template
├── index.css            # Global styles
├── components/          # Future React components
└── api/                 # API documentation
```

## Technology Stack

- **Runtime**: Bun (JavaScript runtime and bundler)
- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Bun Test + Testing Library + Happy DOM
- **Build System**: Custom Bun-based build script

## Development Workflow

1. **Development Server**: `bun dev` - Starts development server with HMR
2. **Testing**: `bun test` - Runs test suite
3. **Building**: `bun run build` - Creates production build
4. **Production**: `bun start` - Serves production build

## Future Component Architecture

The application is designed to evolve into a full ecommerce platform with these planned components:

### Product Management
- ProductCatalog - Main product listing
- ProductCard - Individual product display
- ProductDetails - Detailed product view
- ProductSearch - Search functionality

### Shopping Experience
- ShoppingCart - Cart management
- CartItem - Individual cart item
- Checkout - Order completion flow
- OrderSummary - Order review component

### Navigation & UI
- Header - Site navigation
- Footer - Site footer
- CategoryNav - Category navigation
- FilterPanel - Product filtering

## Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **API Tests**: Server endpoint testing
- **E2E Tests**: Full application workflow testing (future)

## Documentation Standards

Each component and module includes:
- Inline JSDoc comments
- TypeScript type definitions
- README files in relevant directories
- Usage examples and API documentation
- Test coverage documentation