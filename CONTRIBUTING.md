# Contributing to Product Catalog UI

Ahoy and welcome aboard, contributor! 🏴‍☠️ We're thrilled that ye want to help build this mighty ecommerce vessel. This guide will help ye navigate our development process and contribute effectively.

## 🧭 Getting Started

### Prerequisites

Before ye start contributing, make sure ye have:

- [Bun](https://bun.sh) installed (latest version)
- [Git](https://git-scm.com/) for version control
- [VS Code](https://code.visualstudio.com/) (recommended) with TypeScript extension
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/yourusername/product-catalog-ui.git
   cd product-catalog-ui
   ```
3. **Install dependencies:**
   ```bash
   bun install
   ```
4. **Start development server:**
   ```bash
   bun dev
   ```
5. **Verify setup** by visiting `http://localhost:3000`

## 🗺️ Project Structure

Before making changes, familiarize yourself with our project structure:

```
product-catalog-ui/
├── docs/                    # Documentation (you are here!)
├── src/
│   ├── App.tsx             # Main React application
│   ├── index.tsx           # Bun server with API routes
│   ├── components/         # React components (to be built)
│   └── ...
├── build.ts                # Advanced build configuration
└── README.md               # Main project documentation
```

## 🛠️ Development Workflow

### 1. Creating Issues

Before starting work:

- Check existing issues to avoid duplicates
- Create a detailed issue describing the problem or feature
- Use the appropriate issue template
- Add relevant labels (bug, feature, documentation, etc.)

### 2. Working on Features

```bash
# Create and switch to a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test your changes locally
bun dev

# Run tests
bun test

# Commit your changes (see commit guidelines below)
git add .
git commit -m "feat: add product search functionality"

# Push to your fork
git push origin feature/your-feature-name
```

### 3. Submitting Pull Requests

1. **Push to your fork** and create a pull request
2. **Fill out the PR template** completely
3. **Link related issues** using keywords (closes #123, fixes #456)
4. **Request review** from maintainers
5. **Address feedback** and update your PR as needed

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
# Good commits
git commit -m "feat: add product search with real-time filtering"
git commit -m "fix: resolve cart total calculation error"
git commit -m "docs: update API documentation for new endpoints"
git commit -m "refactor: simplify product card component logic"

# Bad commits
git commit -m "fix stuff"
git commit -m "update"
git commit -m "WIP"
```

## 🧪 Testing Requirements

### Before Submitting

All contributions must include:

- **Unit tests** for new functionality
- **Updated tests** for modified functionality
- **All tests passing** (`bun test`)
- **TypeScript** compilation without errors

### Writing Tests

```typescript
// Example test structure
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    // ... other required properties
  };

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('handles add to cart interaction', () => {
    const handleAddToCart = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={handleAddToCart} 
      />
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(handleAddToCart).toHaveBeenCalledWith('1');
  });
});
```

## 📋 Code Standards

### TypeScript

- Use strict TypeScript settings
- Define interfaces for all props and data structures
- Avoid `any` type unless absolutely necessary
- Use proper generics where applicable

### React Components

```typescript
// Component structure template
import { FC } from 'react';

interface ComponentProps {
  // Define all props with proper types
}

/**
 * Component description and usage example
 */
export const Component: FC<ComponentProps> = ({ 
  prop1, 
  prop2 = 'default' 
}) => {
  // Component logic
  
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  );
};

export default Component;
```

### Styling

- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Maintain **dark theme** compatibility
- Use **semantic color names** from the design system
- Keep **accessibility** in mind (contrast, focus states)

### File Naming

- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **Types**: PascalCase (`Product.ts`)
- **Tests**: Match component name (`ProductCard.test.tsx`)

## 🎨 Design Guidelines

### UI/UX Principles

1. **Simple and Clean**: Avoid clutter, focus on content
2. **Consistent**: Use established patterns and components
3. **Accessible**: Support keyboard navigation and screen readers
4. **Responsive**: Work well on all device sizes
5. **Fast**: Optimize for performance and loading speed

### Component Design

- **Single Responsibility**: Each component should have one clear purpose
- **Composition**: Prefer composition over inheritance
- **Props Interface**: Clear, well-documented props
- **Default Values**: Provide sensible defaults
- **Error Handling**: Handle edge cases gracefully

## 🔍 Code Review Process

### For Contributors

1. **Self-review** your code before submitting
2. **Test thoroughly** on different screen sizes
3. **Check accessibility** with keyboard navigation
4. **Update documentation** if needed
5. **Keep PRs focused** - one feature per PR

### Review Criteria

Reviewers will check for:

- Code quality and maintainability
- Test coverage and quality
- Performance implications
- Accessibility compliance
- Documentation updates
- Design consistency

## 🐛 Reporting Bugs

### Bug Report Template

When reporting bugs, include:

1. **Environment details** (OS, browser, Bun version)
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** or error messages
5. **Additional context** that might be helpful

### Example Bug Report

```markdown
**Environment:**
- OS: macOS 14.0
- Browser: Chrome 120
- Bun: 1.0.20

**Steps to Reproduce:**
1. Navigate to product catalog
2. Click on search bar
3. Type "laptop"
4. Press Enter

**Expected Behavior:**
Should filter products to show laptops only

**Actual Behavior:**
Nothing happens, no filtering occurs

**Error Message:**
Console shows: "TypeError: Cannot read property 'filter' of undefined"
```

## 💡 Feature Requests

### Proposing New Features

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with examples
4. **Consider alternatives** and trade-offs
5. **Discuss implementation** approach

### Feature Template

```markdown
**Problem:**
As a user, I want to [specific need] so that [benefit/outcome].

**Proposed Solution:**
Implement [solution] by [approach].

**Alternatives Considered:**
- Option A: [description]
- Option B: [description]

**Implementation Notes:**
- New components needed: [list]
- API changes required: [list]
- Dependencies to add: [list]
```

## 📚 Documentation

### What to Document

- **New components**: Props, usage, examples
- **API changes**: Endpoints, request/response formats
- **Configuration changes**: Environment variables, build options
- **Breaking changes**: Migration guides

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI components
- Keep it up to date with code changes

## 🎯 Areas for Contribution

### High Priority

1. **Core UI Components**: Button, Input, Modal, Card
2. **Product Components**: ProductCard, ProductCatalog
3. **Search & Filter**: SearchBar, CategoryFilter
4. **State Management**: Context or external library integration
5. **Testing**: Component and integration tests

### Medium Priority

1. **Shopping Cart**: Cart functionality and persistence
2. **Product Details**: Detailed product view pages
3. **User Authentication**: Login and registration flows
4. **Admin Interface**: Product management interface
5. **Performance**: Optimization and lazy loading

### Lower Priority

1. **Internationalization**: Multi-language support
2. **Advanced Filtering**: Price ranges, ratings, etc.
3. **Wishlist**: Save products for later
4. **Reviews**: Product rating and review system
5. **Social Features**: Sharing and recommendations

## 🤝 Community Guidelines

### Code of Conduct

- **Be respectful** and professional in all interactions
- **Help others** learn and grow
- **Provide constructive feedback** during reviews
- **Stay focused** on the project goals
- **Have fun** building something awesome together!

### Communication

- **Issues**: Use GitHub issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Pull Requests**: Keep discussions focused on the code changes
- **Documentation**: Update docs alongside code changes

## 🏆 Recognition

Contributors will be:

- **Listed in the README** contributors section
- **Mentioned in release notes** for significant contributions
- **Thanked publicly** on social media (with permission)
- **Invited to join** the core team for ongoing contributors

## 📞 Getting Help

### Resources

- **Documentation**: Check `/docs` folder first
- **Examples**: Look at existing components for patterns
- **Tests**: Examine test files for usage examples
- **Issues**: Search existing issues for similar problems

### Contact

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: Tag maintainers in pull requests

---

Thank ye for contributing to our product catalog adventure! Together, we'll build something truly seaworthy! ⚓

## 🏴‍☠️ Developer's Code

*"A developer's code is more what you'd call 'guidelines' than actual rules."*

- Write code like ye mean it
- Test like yer life depends on it
- Document like ye won't remember tomorrow
- Review like ye care about yer shipmates
- Deploy like a seasoned captain

Happy sailing, developer! 🌊