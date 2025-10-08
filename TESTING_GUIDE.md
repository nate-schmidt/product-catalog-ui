# Testing Guide

A comprehensive guide for writing and running tests in the Product Catalog UI project.

---

## Quick Start

```bash
# Install dependencies
bun install

# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/App.test.tsx
```

---

## Test Framework

This project uses **Bun Test**, a fast built-in test runner that comes with Bun.

### Key Features

- ⚡ **Fast execution** - Native performance
- 🔧 **Built-in** - No additional installation needed
- 🎯 **TypeScript support** - First-class TypeScript support
- 🧪 **Jest-compatible API** - Familiar syntax

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect, describe } from 'bun:test';

describe('Component Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Component Testing Setup

```typescript
import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { Window } from 'happy-dom';

// Setup DOM environment
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('MyComponent', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeDefined();
  });
});
```

---

## Test Categories

### 1. Unit Tests

Test individual components or functions in isolation.

**Example:**

```typescript
test('formats price correctly', () => {
  const price = formatPrice(19.99);
  expect(price).toBe('$19.99');
});
```

### 2. Component Tests

Test React components' rendering and behavior.

**Example:**

```typescript
test('button handles click events', () => {
  const { getByRole } = render(<Button onClick={handleClick} />);
  const button = getByRole('button');
  button.click();
  expect(handleClick).toHaveBeenCalled();
});
```

### 3. API Tests

Test server endpoints and responses.

**Example:**

```typescript
test('GET /api/users returns user list', async () => {
  const response = await fetch('http://localhost:3000/api/users');
  expect(response.status).toBe(200);
  
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
});
```

### 4. Integration Tests

Test multiple components or layers working together.

**Example:**

```typescript
test('user can submit form and see confirmation', async () => {
  const { getByRole, getByText } = render(<FormPage />);
  
  const input = getByRole('textbox');
  input.value = 'test data';
  
  const button = getByRole('button');
  button.click();
  
  // Wait for async operation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  expect(getByText('Success!')).toBeDefined();
});
```

---

## Testing Patterns

### Testing Async Operations

```typescript
test('loads data asynchronously', async () => {
  const promise = fetchData();
  const data = await promise;
  
  expect(data).toBeDefined();
  expect(data.length).toBeGreaterThan(0);
});
```

### Testing Error Handling

```typescript
test('handles errors gracefully', () => {
  expect(() => {
    throw new Error('Test error');
  }).toThrow('Test error');
});
```

### Testing API Responses

```typescript
test('API returns correct format', async () => {
  const response = await fetch('/api/hello');
  const data = await response.json();
  
  expect(data).toHaveProperty('message');
  expect(typeof data.message).toBe('string');
});
```

### Testing Concurrent Requests

```typescript
test('handles concurrent requests', async () => {
  const requests = Array.from({ length: 10 }, (_, i) =>
    fetch(`/api/user/${i}`)
  );
  
  const responses = await Promise.all(requests);
  
  responses.forEach(response => {
    expect(response.status).toBe(200);
  });
});
```

---

## Common Matchers

### Equality

```typescript
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).not.toBe(expected);          // Negation
```

### Truthiness

```typescript
expect(value).toBeTruthy();                // Truthy value
expect(value).toBeFalsy();                 // Falsy value
expect(value).toBeNull();                  // null
expect(value).toBeUndefined();             // undefined
expect(value).toBeDefined();               // Not undefined
```

### Numbers

```typescript
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(5);
expect(value).toBeLessThanOrEqual(5);
```

### Strings

```typescript
expect(string).toContain('substring');
expect(string).toMatch(/regex/);
```

### Arrays

```typescript
expect(array).toContain(item);
expect(array.length).toBe(5);
```

### Exceptions

```typescript
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('error message');
```

### Async/Promises

```typescript
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

---

## Best Practices

### 1. Test File Naming

- ✅ Place tests next to the code: `Component.test.tsx`
- ✅ Use descriptive names: `userAuth.test.ts`
- ✅ Match source file names: `utils.ts` → `utils.test.ts`

### 2. Test Organization

```typescript
describe('FeatureName', () => {
  describe('SubFeature', () => {
    test('specific behavior', () => {
      // Test implementation
    });
  });
});
```

### 3. Setup and Teardown

```typescript
describe('MyComponent', () => {
  beforeEach(() => {
    // Runs before each test
  });

  afterEach(() => {
    // Runs after each test
  });

  beforeAll(() => {
    // Runs once before all tests
  });

  afterAll(() => {
    // Runs once after all tests
  });
});
```

### 4. Descriptive Test Names

```typescript
// ❌ Bad
test('test1', () => {});

// ✅ Good
test('should display error message when login fails', () => {});
```

### 5. AAA Pattern

```typescript
test('example test', () => {
  // Arrange - Setup test data
  const input = 'test';
  
  // Act - Perform the action
  const result = process(input);
  
  // Assert - Verify the result
  expect(result).toBe('expected');
});
```

### 6. Test One Thing

```typescript
// ❌ Bad - Testing multiple things
test('user operations', () => {
  expect(createUser()).toBeDefined();
  expect(updateUser()).toBe(true);
  expect(deleteUser()).toBe(true);
});

// ✅ Good - Separate tests
test('creates user successfully', () => {
  expect(createUser()).toBeDefined();
});

test('updates user successfully', () => {
  expect(updateUser()).toBe(true);
});
```

### 7. Avoid Test Interdependence

```typescript
// ❌ Bad - Tests depend on each other
let sharedState;

test('test1', () => {
  sharedState = 'modified';
});

test('test2', () => {
  expect(sharedState).toBe('modified'); // Fragile!
});

// ✅ Good - Independent tests
test('test1', () => {
  const state = 'initial';
  expect(state).toBe('initial');
});

test('test2', () => {
  const state = 'initial';
  expect(state).toBe('initial');
});
```

---

## Testing React Components

### Basic Component Test

```typescript
import { render } from '@testing-library/react';

test('renders component', () => {
  const { container } = render(<MyComponent />);
  expect(container).toBeDefined();
});
```

### Testing Props

```typescript
test('displays prop value', () => {
  const { getByText } = render(<Greeting name="Alice" />);
  expect(getByText('Hello, Alice!')).toBeDefined();
});
```

### Testing User Interactions

```typescript
test('handles button click', () => {
  const { getByRole } = render(<Counter />);
  const button = getByRole('button');
  
  button.click();
  
  expect(getByText('Count: 1')).toBeDefined();
});
```

### Testing Conditional Rendering

```typescript
test('shows content when visible prop is true', () => {
  const { getByText } = render(<Modal visible={true} />);
  expect(getByText('Modal content')).toBeDefined();
});

test('hides content when visible prop is false', () => {
  const { queryByText } = render(<Modal visible={false} />);
  expect(queryByText('Modal content')).toBeNull();
});
```

---

## Testing API Routes

### GET Request

```typescript
test('GET endpoint returns data', async () => {
  const response = await fetch('http://localhost:3000/api/data');
  
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  
  const data = await response.json();
  expect(data).toBeDefined();
});
```

### POST Request

```typescript
test('POST endpoint creates resource', async () => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice' }),
  });
  
  expect(response.status).toBe(201);
});
```

### Error Handling

```typescript
test('returns 404 for non-existent resource', async () => {
  const response = await fetch('http://localhost:3000/api/nonexistent');
  expect(response.status).toBe(404);
});
```

---

## Performance Testing

### Response Time

```typescript
test('API responds within acceptable time', async () => {
  const start = Date.now();
  await fetch('http://localhost:3000/api/data');
  const duration = Date.now() - start;
  
  expect(duration).toBeLessThan(1000); // 1 second
});
```

### Concurrent Load

```typescript
test('handles concurrent requests', async () => {
  const requests = Array.from({ length: 100 }, () =>
    fetch('http://localhost:3000/api/data')
  );
  
  const responses = await Promise.all(requests);
  
  responses.forEach(response => {
    expect(response.status).toBe(200);
  });
});
```

---

## Debugging Tests

### Console Output

```typescript
test('debug test', () => {
  console.log('Debug info:', someValue);
  expect(someValue).toBe(expected);
});
```

### Test.only - Run Single Test

```typescript
test.only('this test will run alone', () => {
  // Only this test runs
});

test('this test will be skipped', () => {
  // Skipped
});
```

### Test.skip - Skip Test

```typescript
test.skip('this test will be skipped', () => {
  // Skipped
});
```

---

## Coverage Goals

### Target Coverage

- **Unit Tests**: `100%` of utility functions
- **Component Tests**: `100%` of components
- **API Tests**: `100%` of endpoints
- **Integration Tests**: Critical user flows

### Running with Coverage

```bash
# Once Bun supports coverage reporting
bun test --coverage
```

---

## Troubleshooting

### Tests Failing Randomly

- Ensure tests are independent
- Check for timing issues with async operations
- Verify cleanup in `afterEach`

### DOM Not Available

```typescript
// Ensure DOM setup is correct
const window = new Window();
(global as any).window = window;
(global as any).document = window.document;
```

### Async Test Timeouts

```typescript
test('long running test', async () => {
  // Increase timeout if needed
  await longOperation();
}, 10000); // 10 second timeout
```

---

## Resources

- [Bun Test Documentation](https://bun.sh/docs/test)
- [Testing Library](https://testing-library.com/)
- [Happy DOM](https://github.com/capricorn86/happy-dom)

---

## Summary

This testing guide covers:

- ✅ Running tests with Bun
- ✅ Writing unit, component, and integration tests
- ✅ Common testing patterns and best practices
- ✅ React component testing
- ✅ API endpoint testing
- ✅ Performance testing
- ✅ Debugging techniques

Follow these guidelines to maintain high-quality, reliable tests.