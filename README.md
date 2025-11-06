# Product Catalog UI

A modern furniture product catalog interface built with React, TypeScript, and Tailwind CSS, powered by Bun.

## Features

- **Beautiful Product Cards**: Modern, responsive cards displaying product information
- **Product Details**: Images, prices, dimensions, materials, colors, and stock status
- **Stock Indicators**: Visual badges showing product availability
- **Loading States**: Elegant loading animations while fetching data
- **Error Handling**: User-friendly error messages with retry functionality
- **Empty States**: Helpful messaging when no products are available
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Modern UI**: Clean, dark theme with smooth animations and hover effects

## Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh) installed on your system.

### Installation

To install dependencies:

```bash
bun install
```

### Development

To start the development server:

```bash
bun dev
```

The app will be available at `http://localhost:3000`

**Note**: The app expects the backend API to be running at `http://localhost:8080`. Make sure to start the product catalog service first.

### Testing

To run tests:

```bash
bun test
```

### Production

To build for production:

```bash
bun run build
```

To run the production build:

```bash
bun start
```

## Project Structure

```
src/
├── components/
│   └── ProductCard.tsx    # Individual product card component
├── types/
│   └── product.ts         # TypeScript interfaces for products
├── App.tsx                # Main application component
├── index.tsx             # Application entry point
├── index.css             # Global styles and Tailwind imports
└── index.html            # HTML template
```

## Product Card Features

Each product card displays:

- Product image (or placeholder if no image is available)
- Category badge
- Stock status badge (In Stock / Out of Stock)
- Product name
- Description (truncated to 2 lines)
- Color (if available)
- Material (if available)
- Dimensions in cm (if available)
- Price formatted as USD currency
- Available stock quantity
- "Add to Cart" button (disabled when out of stock)

The cards feature:
- Hover animations with scale and shadow effects
- Responsive grid layout (1 column on mobile, 2 on tablet, 3 on desktop)
- Consistent heights with proper text truncation
- Accessibility considerations

## API Integration

The app connects to the backend API at `http://localhost:8080/products` and expects the following response format:

```typescript
{
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  dimensions: {
    width: number | null;
    height: number | null;
    depth: number | null;
    unit: string;
  } | null;
  material: string | null;
  color: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Bun's built-in bundler
- **Testing**: Bun Test with Happy DOM

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
