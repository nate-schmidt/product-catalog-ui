# Configuration Documentation

This document describes all configuration files and settings used in the Product Catalog UI project.

## Configuration Files

### Package Configuration (`package.json`)

**Purpose**: Defines project metadata, dependencies, and npm scripts.

**Key Sections**:
- **Project Info**: Name, version, and type configuration
- **Entry Points**: Main module and entry point definitions
- **Scripts**: Development, build, and test commands
- **Dependencies**: Runtime dependencies (React, Tailwind CSS)
- **Dev Dependencies**: Development and testing tools

**Scripts**:
- `dev`: Hot-reloaded development server
- `start`: Production server
- `build`: Production build process
- `test`: Test suite execution

### TypeScript Configuration (`tsconfig.json`)

**Purpose**: TypeScript compiler and IDE configuration.

**Key Settings**:
- Modern ES target and module system
- Strict type checking enabled
- JSX support for React
- Path resolution configuration

### Bun Configuration (`bunfig.toml`)

**Purpose**: Bun runtime and package manager configuration.

**Features**:
- Package manager settings
- Runtime optimization flags
- Development server configuration

### Build Configuration (`build.ts`)

**Purpose**: Custom build system with extensive CLI options.

**Key Features**:
- Automatic HTML entry point discovery
- Flexible CLI argument parsing
- Production optimization settings
- Development vs production mode handling

**Default Build Settings**:
```typescript
{
  outdir: "dist",
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": "production"
  }
}
```

## Environment Configuration

### Development Environment
- **Server**: Bun development server with HMR
- **Port**: Default Bun port (typically 3000)
- **Hot Reloading**: Enabled for all file types
- **Console Forwarding**: Browser logs appear in server console

### Production Environment
- **Minification**: Enabled for all assets
- **Source Maps**: Linked for debugging
- **Environment Variables**: NODE_ENV set to production
- **Asset Optimization**: Automatic optimization for web delivery

## Styling Configuration

### Tailwind CSS
- **Version**: 4.0.6
- **Integration**: Via bun-plugin-tailwind
- **Configuration**: Uses Tailwind defaults
- **Classes**: Utility-first CSS framework

### CSS Processing
- **Global Styles**: Defined in `src/index.css`
- **Component Styles**: Inline Tailwind classes
- **Build Processing**: Automatic purging and optimization

## Testing Configuration

### Test Environment
- **Runner**: Bun's built-in test runner
- **DOM Environment**: Happy DOM for browser simulation
- **Testing Library**: React Testing Library for component testing
- **Assertion Library**: Bun's built-in expect assertions

### Test Files
- **Location**: Alongside source files
- **Naming**: `*.test.tsx` pattern
- **Setup**: Global DOM setup in test files

## Development Tools

### Hot Module Replacement (HMR)
- **Frontend**: Automatic React component reloading
- **Server**: API route reloading
- **Assets**: CSS and static asset reloading

### Development Server Features
- **File Watching**: Automatic file change detection
- **Error Handling**: Detailed error messages in development
- **Console Integration**: Browser and server console synchronization

## Deployment Configuration

### Build Artifacts
- **Output Directory**: `dist/`
- **Entry Points**: All HTML files in `src/`
- **Asset Handling**: Automatic asset optimization and copying
- **Source Maps**: Generated for debugging

### Production Optimizations
- **Code Minification**: JavaScript and CSS minification
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and SVG optimization
- **Chunking**: Automatic code splitting (when enabled)

## Configuration Customization

### CLI Build Options
The build script supports extensive customization via CLI flags. See `/docs/BUILD.md` for complete options list.

### Environment Variables
- **NODE_ENV**: Automatically set based on build mode
- **Custom Variables**: Can be defined via `--define` flags

### Plugin System
- **Tailwind Plugin**: Integrated for CSS processing
- **Extensible**: Additional plugins can be added to the build configuration