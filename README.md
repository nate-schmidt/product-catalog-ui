# Product Catalog UI

A modern product catalog interface built with React, TypeScript, and Tailwind CSS, powered by Bun.

## Features

- Browse product catalog
- Search and filter products
- Responsive design
- Modern UI with Tailwind CSS

### Browse Product Catalog
The catalog view presents all available products in a clean, card-based layout. Each card displays the product image, name, short description, and price. Clicking on a product card navigates to a detailed view (coming soon) where customers will be able to see full specifications and related items.

### Search and Filter Products
A global search bar lets customers quickly find products by keyword. In addition, filter controls (category, price range, rating, availability) appear above the catalog grid. Filters can be combined, and results update in real-time for a seamless discovery experience.

### Responsive Design
The entire UI is fully responsive out of the box. We rely on Tailwind’s responsive utilities to ensure that the catalog grid, navigation, and interactive controls adapt gracefully from mobile phones all the way up to ultra-wide desktops. No separate code paths are required.

### Modern UI with Tailwind CSS
All styling is powered by Tailwind CSS. Utility classes keep component code concise while maintaining full design flexibility. The default color palette provides a sleek, modern aesthetic, but you can easily customize it via the Tailwind configuration file to match any brand guidelines.

## Getting Started

To install dependencies:

```bash
bun install
```

To start the development server:

```bash
bun dev
```

To build for production:

```bash
bun run build
```

To run the production build:

```bash
bun start
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Bun's built-in bundler

## Development

The development server runs on `http://localhost:3000` by default.

> For a detailed technical deep-dive (API reference, configuration, contribution
> guidelines, etc.) see the [Developer Guide](./DEVELOPER_GUIDE.md).

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
