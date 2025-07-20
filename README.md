# ShopHub - E-Commerce Product Catalog

A modern e-commerce product catalog interface with full shopping cart functionality, built with React, TypeScript, and Tailwind CSS, powered by Bun.

## Features

### 🛒 Add to Cart Functionality (OPS-32)
- **Add to Cart Buttons**: Present on all product cards with visual feedback
- **Quantity Selectors**: Adjust quantity before adding (1-10 items)
- **Visual Confirmation**: Green success feedback when items are added
- **Real-time Cart Updates**: Cart count badge updates instantly
- **Product Variants**: Support for size, color, and other product variations
- **Stock Validation**: Prevents adding out-of-stock items
- **Session Persistence**: Cart data persists for 30 days in localStorage
- **Maximum Quantity Validation**: Enforces max 10 items per product

### 📦 Product Catalog
- Browse product catalog with responsive grid layout
- Product cards with images, descriptions, and pricing
- Stock level indicators and low-stock warnings
- Product variant selection with price modifiers

### 🛍️ Shopping Cart Management
- Dropdown cart view with item details
- Update quantities directly in cart
- Remove individual items
- Clear entire cart with confirmation
- Real-time price calculations
- Variant-aware cart items

### 🎨 Modern UI/UX
- Responsive design for all devices
- Smooth animations and transitions
- Accessible components
- Beautiful gradient hero section
- Clean, modern interface with Tailwind CSS

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Bun's built-in bundler

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed on your system

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-directory>

# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun dev
```

The development server runs on `http://localhost:3000` by default.

### Production Build

```bash
# Build for production
bun run build

# Run the production build
bun start
```

## Project Structure

```
src/
├── components/
│   ├── CartIcon.tsx      # Cart icon with dropdown
│   ├── ProductCard.tsx   # Product display card
│   └── ProductGrid.tsx   # Product grid layout
├── contexts/
│   └── CartContext.tsx   # Cart state management
├── types/
│   └── product.ts        # TypeScript interfaces
├── data/
│   └── mockProducts.ts   # Sample product data
├── App.tsx               # Main application component
├── index.tsx             # Server entry point with API
├── frontend.tsx          # React entry point
└── index.css            # Tailwind CSS styles
```

## API Endpoints

The application includes RESTful API endpoints for cart operations:

- `GET /api/cart/:sessionId` - Retrieve cart for session
- `POST /api/cart/:sessionId` - Update entire cart
- `DELETE /api/cart/:sessionId` - Clear cart
- `POST /api/cart/:sessionId/items` - Add item to cart

## Key Components

### CartContext
Manages all cart state and operations:
- Add to cart with quantity and variants
- Remove items
- Update quantities
- Clear cart
- Persist to localStorage
- Calculate totals

### ProductCard
Displays individual products with:
- Product images and details
- Variant selection
- Quantity selector
- Add to cart button
- Stock indicators
- Price calculations

### CartIcon
Shows cart status and dropdown:
- Item count badge
- Dropdown cart view
- Item management
- Checkout button

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

Built with ❤️ using [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
