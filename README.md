# Bun React Template

A modern React starter template built with Bun, TypeScript, and Tailwind CSS. This template provides a minimal setup to get started with React development using Bun as the runtime and bundler.

## Features

- ⚡ **Bun** - Fast all-in-one JavaScript runtime
- ⚛️ **React 19** - Latest React version with modern features
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 📝 **TypeScript** - Type-safe development
- 🔥 **Hot Module Replacement** - Fast refresh in development
- 🧪 **Testing Setup** - Configured with Bun test runner and React Testing Library
- 🛠️ **Built-in Server** - Bun server with example API routes
- 📦 **Optimized Build** - Production-ready bundling

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

Clone the repository and install dependencies:

```bash
bun install
```

### Development

Start the development server with hot reloading:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

Build the application:

```bash
bun run build
```

This will create an optimized production build in the `dist` directory.

### Running Production Build

Start the production server:

```bash
bun start
```

## Project Structure

```
├── src/
│   ├── App.tsx          # Main React component
│   ├── App.test.tsx     # Component tests
│   ├── index.tsx        # Server entry point and API routes
│   ├── index.html       # HTML template
│   ├── index.css        # Global styles and Tailwind imports
│   └── frontend.tsx     # Client-side React entry point
├── build.ts             # Build configuration script
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── bunfig.toml          # Bun configuration
└── README.md            # This file
```

## API Routes

The template includes example API routes in `src/index.tsx`:

- `GET /api/hello` - Returns a hello message
- `PUT /api/hello` - Returns a hello message with PUT method
- `GET /api/hello/:name` - Returns a personalized hello message

## Testing

Run tests using Bun's built-in test runner:

```bash
bun test
```

Tests are configured with:
- React Testing Library for component testing
- Happy DOM for DOM simulation
- Jest-DOM matchers for assertions

## Build Options

The build script (`build.ts`) supports various options:

```bash
bun run build.ts --help
```

Common build options:
- `--outdir <path>` - Output directory (default: "dist")
- `--minify` - Enable minification
- `--source-map <type>` - Sourcemap generation
- `--target <target>` - Build target (browser|bun|node)
- `--external <packages>` - External packages

Example:
```bash
bun run build.ts --outdir=dist --minify --source-map=linked
```

## Scripts

Available npm scripts:

- `bun dev` - Start development server with hot reloading
- `bun start` - Start production server
- `bun run build` - Build for production
- `bun test` - Run tests

## Tech Stack

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime and toolkit
- **Framework**: [React 19](https://react.dev) - UI library
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) - Utility-first CSS
- **Testing**: [Bun Test](https://bun.sh/docs/cli/test) + [React Testing Library](https://testing-library.com/react)

## Customization

This template is designed to be a starting point. Feel free to:
- Modify the server routes in `src/index.tsx`
- Update the React components starting from `src/App.tsx`
- Adjust the build configuration in `build.ts`
- Add additional dependencies as needed

## Contributing

This is a template project. Fork it and make it your own!

## License

MIT

---

Built with ❤️ using [Bun](https://bun.sh)
