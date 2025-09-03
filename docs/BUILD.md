# Build System Documentation

This document describes the custom build system used in the Product Catalog UI project.

## Overview

The project uses a custom build script (`build.ts`) built on top of Bun's bundler, providing a flexible and powerful build system with extensive CLI options.

## Build Script (`build.ts`)

### Features
- **Automatic HTML Discovery**: Scans for all HTML files in the `src` directory
- **Flexible CLI Options**: Supports extensive command-line configuration
- **Production Optimization**: Minification and source map generation
- **Clean Builds**: Automatically removes previous build artifacts
- **Build Analytics**: Displays detailed build output and timing information

### CLI Options

The build script accepts numerous CLI arguments that map directly to Bun's BuildConfig:

#### Common Options
```bash
--outdir <path>          # Output directory (default: "dist")
--minify                 # Enable minification
--minify.whitespace      # Enable whitespace minification only
--minify.syntax          # Enable syntax minification only
--source-map <type>      # Sourcemap type: none|linked|inline|external
--target <target>        # Build target: browser|bun|node
--format <format>        # Output format: esm|cjs|iife
--splitting              # Enable code splitting
--packages <type>        # Package handling: bundle|external
--public-path <path>     # Public path for assets
```

#### Environment Options
```bash
--env <mode>             # Environment handling: inline|disable|prefix*
--define.KEY=VALUE       # Define global constants
--external <list>        # External packages (comma separated)
--conditions <list>      # Package.json export conditions
```

#### Advanced Options
```bash
--banner <text>          # Add banner text to output
--footer <text>          # Add footer text to output
--no-<option>            # Disable any boolean option
```

### Usage Examples

#### Basic Build
```bash
bun run build
```

#### Production Build with Custom Output
```bash
bun run build.ts --outdir=production --minify --source-map=linked
```

#### Development Build with External Dependencies
```bash
bun run build.ts --no-minify --external=react,react-dom --source-map=inline
```

#### Advanced Configuration
```bash
bun run build.ts \
  --outdir=custom-dist \
  --minify.syntax \
  --define.VERSION=1.0.0 \
  --define.API_URL=https://api.example.com \
  --external=react,react-dom \
  --banner="/* Custom Build Banner */"
```

## Build Process

1. **Argument Parsing**: CLI arguments are parsed and converted to BuildConfig
2. **Clean Previous Build**: Existing output directory is removed
3. **Entry Point Discovery**: All HTML files in `src` are found automatically
4. **Build Execution**: Bun's bundler processes all entry points
5. **Result Display**: Build output is displayed in a formatted table

## Default Configuration

The build script includes these default settings:
- **Output Directory**: `dist/`
- **Minification**: Enabled
- **Target**: `browser`
- **Source Maps**: `linked`
- **Environment Variables**: `NODE_ENV` set to `production`
- **Plugins**: Tailwind CSS plugin included

## Build Output

The build process generates:
- **JavaScript Bundles**: Minified and optimized
- **CSS Files**: Tailwind CSS compiled and optimized
- **HTML Files**: Processed HTML with asset references
- **Source Maps**: For debugging (when enabled)
- **Asset Files**: SVGs and other static assets

## Performance Features

- **File Size Reporting**: Human-readable file sizes (B, KB, MB, GB)
- **Build Timing**: Precise build time measurement
- **Output Table**: Organized display of all generated files
- **Efficient Bundling**: Leverages Bun's fast bundler

## Integration with Package Scripts

The build system integrates with npm/bun scripts:
- `bun run build` - Executes the custom build script
- `bun dev` - Development server with hot reloading
- `bun start` - Production server
- `bun test` - Test runner

## Extending the Build System

To add new build features:
1. Modify `build.ts` to accept new CLI options
2. Update the argument parser to handle new flags
3. Extend the BuildConfig with new options
4. Update this documentation with new options