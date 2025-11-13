# Product Catalog UI

A modern product catalog interface built with React, TypeScript, and Tailwind CSS, powered by Bun.

## Features

- Browse product catalog
- Search and filter products
- Responsive design
- Modern UI with Tailwind CSS

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

### Backend Integration

This UI is integrated with the `product-catalog-service-java` backend service. The backend should be running on `http://localhost:8080/api` by default.

The API base URL is configured in `src/services/api.ts`. To change it, modify the `API_BASE_URL` constant in that file.

**Note**: Make sure the Java backend service is running before starting the UI, or the product catalog will show an error message.

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
