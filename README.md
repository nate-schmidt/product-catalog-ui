# Product Catalog UI (with Cart, Coupons, and Checkout)

A modern product catalog interface built with React, TypeScript, and Tailwind CSS, powered by Bun.

## Features

- Browse product catalog
- Search and filter products
- Responsive design
- Modern UI with Tailwind CSS
- Cart with quantity controls and live totals
- Coupon codes: percent or fixed amount discounts
- Checkout endpoint (demo) returning confirmation

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

## API Endpoints

- `GET /api/products` — Returns a list of products
- `POST /api/coupons/validate` — Body: `{ code: string, items: {productId, quantity}[] }`. Returns `valid` and a computed price `summary`
- `POST /api/checkout` — Body: `{ items: {productId, quantity}[], couponCode?: string }`. Returns `{ ok, orderId?, summary }`

Example:

```bash
curl -X POST http://localhost:3000/api/coupons/validate \
  -H 'Content-Type: application/json' \
  -d '{"code":"WELCOME10","items":[{"productId":"sku_basic_tee","quantity":2}]}'
```

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Bun's built-in bundler

## Development

The development server runs on `http://localhost:3000` by default.

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.
