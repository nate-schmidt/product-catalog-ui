# Developer Guide

Welcome to the **Product Catalog UI** developer documentation.  This guide provides the technical details you need to run, test, and extend the project.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Core Features](#core-features)
4. [API Reference](#api-reference)
5. [Configuration](#configuration)
6. [Code Examples](#code-examples)
7. [Contributing](#contributing)

---

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server with HMR on http://localhost:3000
bun dev

# Run tests
bun test
```

---

## Architecture Overview

| Layer | Technology | Description |
|-------|------------|-------------|
| Runtime | [**Bun**](https://bun.sh) | All‐in‐one JavaScript runtime (bundler, test-runner, npm client). |
| UI     | **React 18** + **TypeScript** | Component-based frontend. |
| Styling | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| Server | **Bun HTTP** | Lightweight HTTP server serving the SPA and demo REST API. |

---

## Core Features

### 1. Browse Product Catalog (coming soon)
* Displays all products in a responsive grid.
* Card layout shows image, name, description, and price.
* Planned: product detail page, variant selection, related items.

### 2. Search & Filter (coming soon)
* Keyword search bar with real-time results.
* Filters for category, price range, rating, and availability.
* Combines multiple filters using logical **AND**.

### 3. Responsive Design
* Uses Tailwind’s responsive utilities (`sm:`, `md:`, `lg:` …) so the layout adapts from mobile to widescreen.
* Images are fluid and cards rearrange automatically.

### 4. Modern UI with Tailwind CSS
* All design tokens defined in `tailwind.config.{js,cjs,ts}` (to be added).
* Easy to override the default color palette to match brand guidelines.

---

## API Reference

> **Base URL:** `http://localhost:3000`

### Hello Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/hello` | Returns a greeting payload. |
| `PUT` | `/api/hello` | Same as GET but illustrates multiple verbs. |
| `GET` | `/api/hello/:name` | Personalised greeting for `:name`. |

#### Example Request

```bash
curl http://localhost:3000/api/hello/Grace
```

#### Example Response

```json
{
  "message": "Hello, Grace!"
}
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Controls dev/production mode. |
| `PORT` | `3000` | (Planned) Port for the HTTP server. |

### Build Script Options

`bun run build.ts [options]`

| Flag | Type | Description |
|------|------|-------------|
| `--outdir` | string | Output directory (default: `dist`). |
| `--minify` | boolean | Enable minification. |
| `--source-map` | `none\|linked\|inline\|external` | Sourcemap type. |
| `--target` | `browser\|bun\|node` | Build target. |
| `--format` | `esm\|cjs\|iife` | Output format. |
| _...and many more_ |  | See `bun run build.ts --help`. |

---

## Code Examples

### Rendering the App Component

```tsx
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

### Fetching from the API

```ts
// src/api.ts
export async function greet(name: string) {
  const res = await fetch(`/api/hello/${name}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<{ message: string }>;
}

// Usage
console.log(await greet("Ada"));
```

---

## Contributing

1. Fork / clone the repository.
2. Install dependencies with `bun install`.
3. Create a feature branch: `git checkout -b feat/your-feature`.
4. Commit your changes and ensure `bun test` passes.
5. Open a pull request — remember to describe **why** and **what**.

Thanks for helping make **Product Catalog UI** awesome! 🎉