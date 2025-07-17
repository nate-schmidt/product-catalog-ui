# Product Catalog UI - Test Suite

This directory contains test utilities and helpers for the Product Catalog UI application.

## Test Structure

```
src/
├── test-utils/
│   ├── setup.ts          # Global test setup and DOM configuration
│   ├── render.tsx        # Custom render function with providers
│   ├── mocks.ts          # Mock data and API utilities
│   └── README.md         # This file
├── App.test.tsx          # App component tests
├── components/
│   ├── ProductCard.test.tsx    # Product card component tests (example)
│   └── SearchForm.test.tsx     # Search form component tests (example)
├── contexts/
│   └── CartContext.test.tsx    # Cart context provider tests (example)
├── hooks/
│   └── useProducts.test.tsx    # Custom hooks tests (example)
└── services/
    └── api.test.ts            # API service tests (example)
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Run specific test file
bun test src/App.test.tsx

# Run tests matching pattern
bun test --pattern="Cart"
```

## Writing Tests

### Basic Component Test

```typescript
import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, cleanup } from '../test-utils/render';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    cleanup();
  });

  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { userEvent } from '../test-utils/render';

test('handles click', async () => {
  const user = userEvent.setup();
  const mockFn = { fn: () => {} };
  const spy = spyOn(mockFn, 'fn');
  
  render(<Button onClick={mockFn.fn}>Click me</Button>);
  
  await user.click(screen.getByText('Click me'));
  expect(spy).toHaveBeenCalledTimes(1);
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '../test-utils/render';

test('custom hook', () => {
  const { result } = renderHook(() => useCounter());
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

### Testing API Calls

```typescript
import { mockFetch, restoreFetch, createMockResponse } from '../test-utils/mocks';

beforeEach(() => {
  mockFetch({
    '/api/products': () => createMockResponse([{ id: 1, name: 'Product' }])
  });
});

afterEach(() => {
  restoreFetch();
});

test('fetches data', async () => {
  const data = await api.getProducts();
  expect(data).toHaveLength(1);
});
```

## Test Utilities

### setup.ts
- Configures happy-dom for testing React components
- Sets up global DOM APIs
- Mocks browser APIs (matchMedia, IntersectionObserver, etc.)

### render.tsx
- Custom render function that wraps components with providers
- Re-exports all testing-library utilities
- Exports userEvent for simulating user interactions

### mocks.ts
- Mock product, user, and cart data
- Mock fetch implementation
- Helper functions for creating mock responses

## Best Practices

1. **Organize tests by feature**: Group related tests using `describe` blocks
2. **Clean up after tests**: Always call `cleanup()` in `beforeEach`
3. **Test user behavior**: Focus on testing what users see and do, not implementation details
4. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
5. **Mock external dependencies**: Use the mock utilities for API calls
6. **Test accessibility**: Include tests for keyboard navigation and ARIA attributes
7. **Keep tests focused**: Each test should verify one specific behavior

## Common Testing Patterns

### Testing Loading States
```typescript
test('shows loading state', async () => {
  render(<ProductList />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### Testing Error States
```typescript
test('handles errors', async () => {
  mockFetch({
    '/api/products': () => new Response('Error', { status: 500 })
  });
  
  render(<ProductList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Form Validation
```typescript
test('validates required fields', async () => {
  const user = userEvent.setup();
  render(<ContactForm />);
  
  await user.click(screen.getByText('Submit'));
  
  expect(screen.getByText('Email is required')).toBeInTheDocument();
});
```

## Coverage Goals

We aim for:
- 70%+ code coverage for all metrics
- 100% coverage for critical business logic
- Focus on meaningful tests over coverage numbers