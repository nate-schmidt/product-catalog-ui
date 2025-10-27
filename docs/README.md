# Project Documentation

This directory contains comprehensive documentation for the Product Catalog UI project.

## Documentation Structure

### Core Documentation
- `/README.md` - Main project overview and getting started guide
- `/src/README.md` - Source code structure and component documentation
- `/src/components/README.md` - Components directory documentation
- `/src/api/README.md` - API endpoints and server configuration
- `/docs/BUILD.md` - Build system documentation (this directory)

## Build System Documentation

See `BUILD.md` in this directory for detailed information about the build configuration, CLI options, and build process.

## Development Guidelines

### Code Organization
- Keep components in `/src/components/`
- API routes are defined in `/src/index.tsx`
- Global styles in `/src/index.css`
- Tests alongside their respective components

### Testing Standards
- Use Bun's built-in test runner
- Follow Testing Library patterns
- Maintain test coverage for all components
- Test files should be named `*.test.tsx`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Avoid custom CSS when possible
- Keep responsive design in mind
- Follow the established color scheme (white text, gray subtitles)

### API Development
- Follow RESTful conventions
- Use appropriate HTTP methods
- Include proper error handling
- Document all endpoints in `/src/api/README.md`