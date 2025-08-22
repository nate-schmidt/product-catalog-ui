# Product Catalog UI

A modern, high-performance starter template for building ecommerce product catalogs. Built with React 19, TypeScript, and Tailwind CSS 4.0, powered by the blazing-fast Bun runtime.

## 🚀 Current Status

This is currently a **starter template** with foundational infrastructure in place. The application displays a welcome page with the message "One day I hope to be an ecommerce website" - ready for you to build upon!

## ✨ Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Ultra-fast JavaScript runtime
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Bun's built-in bundler with custom build script
- **Development**: Hot Module Replacement (HMR) enabled
- **Testing**: Bun test with Testing Library

## 🎯 Features (Planned)

- [ ] Product catalog browsing
- [ ] Search and filtering
- [ ] Responsive design
- [ ] Shopping cart functionality
- [ ] Product detail views
- [ ] Modern, accessible UI

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd product-catalog-ui

# Install dependencies
bun install
```

### Development

```bash
# Start development server with hot reloading
bun dev

# The app will be available at http://localhost:3000
```

### Building

```bash
# Build for production
bun run build

# Run production build
bun start
```

### Testing

```bash
# Run tests
bun test
```

## 📁 Project Structure

```
product-catalog-ui/
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Bun server with API routes
│   ├── index.html           # HTML template
│   ├── index.css            # Global styles with Tailwind
│   ├── frontend.tsx         # Frontend entry point
│   └── components/          # React components (to be built)
├── build.ts                 # Advanced build configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── bunfig.toml             # Bun configuration
```

## 🔧 Build System

This project includes a sophisticated build system (`build.ts`) with CLI argument support:

```bash
# Basic build
bun run build

# Custom output directory
bun run build --outdir=dist

# Minified build with source maps
bun run build --minify --source-map=linked

# External dependencies (useful for micro-frontends)
bun run build --external=react,react-dom

# See all options
bun run build --help
```

## 🌐 API Endpoints

The development server includes basic API routes:

- `GET /api/hello` - Returns a hello world message
- `PUT /api/hello` - Returns a hello world message (PUT method)
- `GET /api/hello/:name` - Returns personalized greeting

## 🎨 Styling

Uses Tailwind CSS 4.0 with a dark theme by default. The base configuration includes:

- Dark background (`#242424`)
- White text with transparency
- Responsive grid layout
- Reduced motion support for accessibility

## 🚧 Development Roadmap

### Phase 1: Core Components
- [ ] Create `ProductCard` component
- [ ] Build `ProductCatalog` container
- [ ] Implement basic grid layout

### Phase 2: Data & State
- [ ] Set up product data structure
- [ ] Implement state management
- [ ] Add mock product data

### Phase 3: Features
- [ ] Search functionality
- [ ] Category filtering
- [ ] Product detail views
- [ ] Shopping cart

### Phase 4: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🧪 Testing

The project is configured with:
- Bun's native test runner
- React Testing Library
- Jest DOM matchers
- Happy DOM for browser simulation

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ⚡ Bun** - The fast all-in-one JavaScript runtime that makes development a breeze!
