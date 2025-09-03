# Source Code Documentation

This directory contains the source code for the Product Catalog UI application.

## Directory Structure

```
src/
├── App.tsx           # Main React application component
├── App.test.tsx      # Tests for the App component
├── frontend.tsx      # Frontend entry point for browser rendering
├── index.tsx         # Server entry point with API routes
├── index.html        # HTML template
├── index.css         # Global styles and Tailwind CSS imports
├── logo.svg          # Application logo
└── react.svg         # React logo
```

## Components

### App Component (`App.tsx`)
The main application component that renders the welcome page.

**Purpose**: Displays a simple landing page with a welcome message indicating this will become an ecommerce website.

**Features**:
- Responsive design using Tailwind CSS
- Centered layout with maximum width container
- Welcome heading with emoji
- Subtitle explaining future plans

**Styling**:
- Uses Tailwind CSS utility classes
- White text on transparent background
- Maximum width of 7xl (80rem)
- Responsive padding and margins

## Entry Points

### Frontend Entry Point (`frontend.tsx`)
Browser-side entry point that renders the React app to the DOM.

**Purpose**: Initializes the React application in the browser environment.

**Features**:
- Waits for DOM to be ready before rendering
- Creates React root and renders App component
- Handles both immediate and deferred DOM loading

### Server Entry Point (`index.tsx`)
Server-side entry point using Bun's built-in server.

**Purpose**: Serves the application and provides API endpoints.

**API Routes**:
- `GET /api/hello` - Returns a simple hello message
- `PUT /api/hello` - Returns a hello message via PUT method
- `GET /api/hello/:name` - Returns personalized greeting with URL parameter
- `/*` - Serves the main HTML file for all other routes (SPA routing)

**Development Features**:
- Hot Module Replacement (HMR) in development
- Browser console log echoing to server
- Automatic production/development mode detection

## Testing

### Test Setup (`App.test.tsx`)
Comprehensive test suite for the App component using Bun's test runner and Testing Library.

**Test Environment**:
- Uses Happy DOM for browser environment simulation
- Testing Library React for component testing utilities
- Bun's built-in test runner

**Test Coverage**:
- Component renders without crashing
- Main heading text and content validation
- Subtitle text presence and content
- CSS class application verification
- Layout structure validation
- Text color styling verification

## Styling

### Global Styles (`index.css`)
Contains Tailwind CSS imports and any global styling rules.

## Build System

The application uses a custom build script (`../build.ts`) that:
- Processes all HTML files as entry points
- Uses Bun's built-in bundler
- Includes Tailwind CSS plugin
- Supports production minification
- Generates source maps
- Provides detailed build output information

## Development Workflow

1. **Development**: Run `bun dev` for hot-reloaded development server
2. **Testing**: Run `bun test` to execute the test suite
3. **Building**: Run `bun run build` to create production build
4. **Production**: Run `bun start` to serve production build