# Test Suite Documentation

This document describes the comprehensive unit test suite setup for the Product Catalog UI project.

## Overview

The test suite is built using:
- **Bun Test Runner**: Fast JavaScript test runner with built-in coverage
- **@testing-library/react**: Simple and complete testing utilities for React
- **happy-dom**: Lightweight DOM implementation for testing
- **TypeScript**: Full TypeScript support in tests

## Project Structure

```
src/__tests__/
├── README.md                      # This documentation file
├── setup.ts                       # Global test configuration
├── test-utils.tsx                 # Shared testing utilities
├── api.test.ts                    # API endpoint tests
├── frontend.test.tsx              # Frontend rendering tests
└── templates/                     # Reusable test templates
    ├── component.template.test.tsx # React component test template
    ├── hook.template.test.ts       # React hook test template
    └── utils.template.test.ts      # Utility function test template
```

## Running Tests

### Basic Commands

```bash
# Run all tests
bun test

# Run tests in watch mode (re-runs on file changes)
bun run test:watch

# Run tests with coverage report
bun run test:coverage

# Run only UI component tests
bun run test:ui

# Run only API tests
bun run test:api

# Run only frontend tests
bun run test:frontend
```

### Test Configuration

Test configuration is managed in `bunfig.toml`:

```toml
[test]
timeout = 5000
coverage = true
bail = 1
preload = ["./src/__tests__/setup.ts"]
include = ["src/**/*.test.{ts,tsx}"]
exclude = ["node_modules/**", "dist/**", "build/**"]
coverageThreshold = 80
```

## Writing Tests

### Using Test Templates

1. **React Components**: Copy `templates/component.template.test.tsx`
2. **React Hooks**: Copy `templates/hook.template.test.ts`
3. **Utility Functions**: Copy `templates/utils.template.test.ts`

### Test File Naming Convention

- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Utility tests: `utilityName.test.ts`
- API tests: `api.test.ts`

### Example: Testing a React Component

```typescript
import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, fireEvent } from '@testing-library/react';
import { setupTest } from '../test-utils';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
  beforeEach(() => {
    setupTest();
  });

  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDefined();
  });

  test('handles click events', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(clicked).toBe(true);
  });
});
```

### Example: Testing a Utility Function

```typescript
import { test, expect, describe } from 'bun:test';
import { formatPrice } from '../../utils/formatPrice';

describe('formatPrice', () => {
  test('formats price correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(999.9)).toBe('$999.90');
  });

  test('handles edge cases', () => {
    expect(() => formatPrice(-1)).toThrow();
    expect(() => formatPrice(NaN)).toThrow();
  });
});
```

## Test Utilities

The `test-utils.tsx` file provides helpful utilities:

### Available Utilities

- `setupTest()`: Reset DOM and global state between tests
- `teardownTest()`: Clean up after tests
- `createMockElement()`: Create mock DOM elements
- `waitForElement()`: Wait for elements to appear
- `createMockResponse()`: Create mock fetch responses
- `renderWithCleanup()`: Enhanced render function

### Usage Example

```typescript
import { setupTest, createMockElement, waitForElement } from '../test-utils';

beforeEach(() => {
  setupTest(); // Clean slate for each test
});

test('element creation', () => {
  const element = createMockElement('div', { id: 'test' });
  document.body.appendChild(element);
  
  const found = document.getElementById('test');
  expect(found).toBeDefined();
});
```

## Best Practices

### 1. Test Structure
- Use descriptive test names that explain what is being tested
- Group related tests with `describe` blocks
- Use `beforeEach` for setup that applies to multiple tests

### 2. Assertions
- Use specific assertions (`toBe`, `toEqual`, `toContain`)
- Test both positive and negative cases
- Include edge cases and error conditions

### 3. Component Testing
- Test user interactions, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test accessibility features

### 4. API Testing
- Test request/response formats
- Test error handling
- Mock external dependencies

### 5. Performance
- Keep tests fast and focused
- Mock expensive operations
- Use `bail = 1` to stop on first failure during development

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- `coverage/html/index.html`: Interactive HTML report
- `coverage/lcov.info`: LCOV format for CI/CD integration
- Console output shows coverage summary

### Coverage Thresholds

The project aims for 80% code coverage across:
- Statements
- Branches  
- Functions
- Lines

## Continuous Integration

Tests are designed to run in CI environments:

```bash
# CI test command
bun test --coverage --bail

# Check coverage threshold
bun test --coverage --threshold=80
```

## Troubleshooting

### Common Issues

1. **DOM not available**: Ensure `setupTest()` is called in `beforeEach`
2. **React components not rendering**: Check that test-utils are imported
3. **Async tests failing**: Use `await` with async assertions
4. **Coverage too low**: Add tests for uncovered branches

### Debug Mode

```bash
# Run single test file
bun test src/__tests__/ComponentName.test.tsx

# Verbose output
bun test --verbose

# Debug with console output
bun test --debug
```

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Use existing templates as starting points
3. Ensure tests pass and coverage remains above threshold
4. Update this documentation if adding new testing patterns

## Resources

- [Bun Test Runner](https://bun.sh/docs/cli/test)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [happy-dom](https://github.com/capricorn86/happy-dom)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)