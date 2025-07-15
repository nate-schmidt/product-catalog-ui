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

---

Built with [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime.

## Backend Integration

The Product Catalog UI is designed to work hand-in-hand with the accompanying FastAPI backend located in `../product-catalog-service`.  
Follow the steps below to run the full stack locally:

### 1. Start the API service

```bash
# From the repository root
cd ../product-catalog-service

# Using the built-in dev server
source .venv/bin/activate       # or `python -m venv .venv && source .venv/bin/activate`
pip install -r requirements.txt # if not installed
uvicorn main:app --reload --port 8000
```

Alternatively you can start everything with Docker:

```bash
docker compose up --build
```

The API will then be available on `http://localhost:8000`.

### 2. Point the UI at the API

The frontend looks for the environment variable `VITE_API_URL` (or falls back to `http://localhost:8000`).  
Set it once when you start the dev server:

```bash
VITE_API_URL=http://localhost:8000 bun dev
```

For production builds you can inject the same variable at runtime with a reverse-proxy or a static `.env` file.

### 3. Available endpoints used by the UI

| HTTP method | Endpoint                | Purpose                   |
|-------------|-------------------------|---------------------------|
| GET         | /products               | Fetch the product catalog |
| GET         | /products/{id}          | Fetch a single product    |
| POST        | /cart                   | Add a product to cart     |
| GET         | /cart                   | Fetch current cart        |

*(See `product-catalog-service/main.py` for the authoritative list.)*

### 4. Typical development workflow

1. Run the backend as described above.  
2. In a separate terminal start the UI with `bun dev`.  
3. Open `http://localhost:3000` and interact with the catalog – all product data will be served by the API.

---

Need help? Open an issue or start a discussion 🚀
