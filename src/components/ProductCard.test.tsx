import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/product';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('ProductCard', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 1,
    name: 'Modern Chair',
    description: 'A comfortable and stylish chair',
    category: 'Seating',
    price: 299.99,
    stock: 10,
    dimensions: { width: 50, height: 100, depth: 50, unit: 'cm' },
    material: 'Wood',
    color: 'Brown',
    imageUrl: 'https://example.com/chair.jpg',
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00',
    inStock: true,
    ...overrides,
  });

  describe('Basic Rendering', () => {
    const testCases = {
      'renders without crashing': {
        product: createMockProduct(),
        assertion: (container: HTMLElement) => {
          expect(container).toBeDefined();
        },
      },
      'displays product name': {
        product: createMockProduct({ name: 'Test Product Name' }),
        assertion: (container: HTMLElement, product: Product) => {
          const heading = container.querySelector('h3');
          expect(heading?.textContent).toBe(product.name);
        },
      },
      'displays product description': {
        product: createMockProduct({ description: 'Test description here' }),
        assertion: (container: HTMLElement, product: Product) => {
          const description = container.querySelector('p.text-gray-400');
          expect(description?.textContent).toBe(product.description);
        },
      },
      'displays product category': {
        product: createMockProduct({ category: 'Tables' }),
        assertion: (container: HTMLElement, product: Product) => {
          const categoryBadge = container.querySelector('.bg-blue-600');
          expect(categoryBadge?.textContent).toBe(product.category);
        },
      },
    };

    Object.entries(testCases).forEach(([testName, { product, assertion }]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={product} />);
        assertion(container, product);
      });
    });
  });

  describe('Price Formatting', () => {
    const testCases = {
      'formats whole number prices': {
        product: createMockProduct({ price: 100 }),
        expected: '$100.00',
      },
      'formats decimal prices': {
        product: createMockProduct({ price: 299.99 }),
        expected: '$299.99',
      },
      'formats large prices': {
        product: createMockProduct({ price: 1999.50 }),
        expected: '$1,999.50',
      },
      'formats prices with many decimals': {
        product: createMockProduct({ price: 49.999 }),
        expected: '$50.00',
      },
    };

    Object.entries(testCases).forEach(([testName, { product, expected }]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={product} />);
        const priceElement = container.querySelector('.text-3xl.font-bold');
        expect(priceElement?.textContent).toBe(expected);
      });
    });
  });

  describe('Stock Display', () => {
    const testCases = {
      'shows "In Stock" badge when inStock is true': {
        product: createMockProduct({ inStock: true }),
        expectedBadge: 'In Stock',
        expectedBadgeClass: 'bg-green-600',
      },
      'shows "Out of Stock" badge when inStock is false': {
        product: createMockProduct({ inStock: false }),
        expectedBadge: 'Out of Stock',
        expectedBadgeClass: 'bg-red-600',
      },
      'displays singular "item" for stock of 1': {
        product: createMockProduct({ stock: 1 }),
        expectedText: '1 item available',
      },
      'displays plural "items" for stock greater than 1': {
        product: createMockProduct({ stock: 5 }),
        expectedText: '5 items available',
      },
      'displays plural "items" for stock of 0': {
        product: createMockProduct({ stock: 0 }),
        expectedText: '0 items available',
      },
    };

    Object.entries(testCases).forEach(([testName, testCase]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={testCase.product} />);
        
        if ('expectedBadge' in testCase) {
          const badge = container.querySelector(`.${testCase.expectedBadgeClass}`);
          expect(badge?.textContent?.trim()).toBe(testCase.expectedBadge);
        }
        
        if ('expectedText' in testCase) {
          const stockInfo = container.querySelector('.text-xs.text-gray-500');
          expect(stockInfo?.textContent?.trim()).toBe(testCase.expectedText);
        }
      });
    });
  });

  describe('Image Display', () => {
    const testCases = {
      'displays image when imageUrl is provided': {
        product: createMockProduct({ imageUrl: 'https://example.com/image.jpg' }),
        hasImage: true,
      },
      'displays placeholder when imageUrl is null': {
        product: createMockProduct({ imageUrl: null }),
        hasImage: false,
      },
      'displays placeholder when imageUrl is empty string': {
        product: createMockProduct({ imageUrl: '' }),
        hasImage: false,
      },
    };

    Object.entries(testCases).forEach(([testName, { product, hasImage }]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={product} />);
        const img = container.querySelector('img');
        const placeholderSvg = container.querySelector('svg');

        if (hasImage) {
          expect(img).toBeDefined();
          expect(img?.getAttribute('src')).toBe(product.imageUrl);
          expect(img?.getAttribute('alt')).toBe(product.name);
        } else {
          expect(img).toBeNull();
          expect(placeholderSvg).toBeDefined();
        }
      });
    });
  });

  describe('Product Details', () => {
    const testCases = {
      'displays color when provided': {
        product: createMockProduct({ color: 'Blue' }),
        field: 'color',
        expectedLabel: 'Color:',
        expectedValue: 'Blue',
      },
      'hides color when null': {
        product: createMockProduct({ color: null }),
        field: 'color',
        shouldDisplay: false,
      },
      'displays material when provided': {
        product: createMockProduct({ material: 'Leather' }),
        field: 'material',
        expectedLabel: 'Material:',
        expectedValue: 'Leather',
      },
      'hides material when null': {
        product: createMockProduct({ material: null }),
        field: 'material',
        shouldDisplay: false,
      },
    };

    Object.entries(testCases).forEach(([testName, testCase]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={testCase.product} />);
        
        if ('shouldDisplay' in testCase && !testCase.shouldDisplay) {
          const labels = Array.from(container.querySelectorAll('.text-gray-500'));
          const hasLabel = labels.some(label => 
            label.textContent?.toLowerCase().includes(testCase.field)
          );
          expect(hasLabel).toBe(false);
        } else if ('expectedLabel' in testCase) {
          const labels = Array.from(container.querySelectorAll('.text-gray-500'));
          const labelElement = labels.find(label => 
            label.textContent === testCase.expectedLabel
          );
          expect(labelElement).toBeDefined();
          
          if (labelElement && 'expectedValue' in testCase) {
            const valueElement = labelElement.parentElement?.querySelector('.text-gray-300');
            expect(valueElement?.textContent).toBe(testCase.expectedValue);
          }
        }
      });
    });
  });

  describe('Dimensions Display', () => {
    const testCases = {
      'displays full dimensions': {
        product: createMockProduct({
          dimensions: { width: 50, height: 100, depth: 60, unit: 'cm' },
        }),
        expected: '50 × 100 × 60 cm',
      },
      'displays dimensions with missing width': {
        product: createMockProduct({
          dimensions: { width: null, height: 100, depth: 60, unit: 'cm' },
        }),
        expected: '? × 100 × 60 cm',
      },
      'displays dimensions with missing height': {
        product: createMockProduct({
          dimensions: { width: 50, height: null, depth: 60, unit: 'cm' },
        }),
        expected: '50 × ? × 60 cm',
      },
      'displays dimensions with missing depth': {
        product: createMockProduct({
          dimensions: { width: 50, height: 100, depth: null, unit: 'cm' },
        }),
        expected: '50 × 100 × ? cm',
      },
      'hides dimensions when all values are null': {
        product: createMockProduct({
          dimensions: { width: null, height: null, depth: null, unit: 'cm' },
        }),
        expected: null,
      },
      'hides dimensions when dimensions object is null': {
        product: createMockProduct({ dimensions: null }),
        expected: null,
      },
      'displays dimensions with inches unit': {
        product: createMockProduct({
          dimensions: { width: 20, height: 40, depth: 25, unit: 'in' },
        }),
        expected: '20 × 40 × 25 in',
      },
    };

    Object.entries(testCases).forEach(([testName, { product, expected }]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={product} />);
        const labels = Array.from(container.querySelectorAll('.text-gray-500'));
        const dimensionsLabel = labels.find(label => 
          label.textContent === 'Dimensions:'
        );

        if (expected === null) {
          expect(dimensionsLabel).toBeUndefined();
        } else {
          expect(dimensionsLabel).toBeDefined();
          const dimensionsValue = dimensionsLabel?.parentElement?.querySelector('.text-gray-300');
          expect(dimensionsValue?.textContent).toBe(expected);
        }
      });
    });
  });

  describe('Add to Cart Button', () => {
    const testCases = {
      'enabled when product is in stock': {
        product: createMockProduct({ inStock: true }),
        expectedText: 'Add to Cart',
        disabled: false,
      },
      'disabled when product is out of stock': {
        product: createMockProduct({ inStock: false }),
        expectedText: 'Unavailable',
        disabled: true,
      },
      'has correct styling when enabled': {
        product: createMockProduct({ inStock: true }),
        expectedClass: 'bg-blue-600',
      },
      'has correct styling when disabled': {
        product: createMockProduct({ inStock: false }),
        expectedClass: 'bg-gray-600',
      },
    };

    Object.entries(testCases).forEach(([testName, testCase]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={testCase.product} />);
        const button = container.querySelector('button');
        
        expect(button).toBeDefined();
        
        if ('expectedText' in testCase) {
          expect(button?.textContent).toBe(testCase.expectedText);
        }
        
        if ('disabled' in testCase) {
          expect(button?.disabled).toBe(testCase.disabled);
        }
        
        if ('expectedClass' in testCase) {
          expect(button?.className).toContain(testCase.expectedClass);
        }
      });
    });
  });

  describe('CSS Classes and Styling', () => {
    test('has correct container classes', () => {
      const product = createMockProduct();
      const { container } = render(<ProductCard product={product} />);
      const card = container.firstElementChild;
      
      expect(card?.className).toContain('bg-gray-800');
      expect(card?.className).toContain('rounded-xl');
      expect(card?.className).toContain('shadow-lg');
      expect(card?.className).toContain('border-gray-700');
    });

    test('has correct image container classes', () => {
      const product = createMockProduct();
      const { container } = render(<ProductCard product={product} />);
      const imageContainer = container.querySelector('.h-64');
      
      expect(imageContainer?.className).toContain('bg-gray-700');
      expect(imageContainer?.className).toContain('overflow-hidden');
    });

    test('has correct content section classes', () => {
      const product = createMockProduct();
      const { container } = render(<ProductCard product={product} />);
      const contentSection = container.querySelector('.p-6');
      
      expect(contentSection).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    const testCases = {
      'handles very long product names': {
        product: createMockProduct({
          name: 'This is an extremely long product name that should be truncated or handled appropriately in the UI',
        }),
        assertion: (container: HTMLElement) => {
          const heading = container.querySelector('h3');
          expect(heading?.className).toContain('line-clamp-1');
          expect(heading?.textContent).toBeTruthy();
        },
      },
      'handles very long descriptions': {
        product: createMockProduct({
          description: 'This is a very long description that goes on and on and should be truncated or handled appropriately in the UI to maintain the card layout and prevent overflow issues',
        }),
        assertion: (container: HTMLElement) => {
          const description = container.querySelector('p.text-gray-400');
          expect(description?.className).toContain('line-clamp-2');
          expect(description?.textContent).toBeTruthy();
        },
      },
      'handles zero price': {
        product: createMockProduct({ price: 0 }),
        assertion: (container: HTMLElement) => {
          const priceElement = container.querySelector('.text-3xl.font-bold');
          expect(priceElement?.textContent).toBe('$0.00');
        },
      },
      'handles negative stock (edge case)': {
        product: createMockProduct({ stock: -1 }),
        assertion: (container: HTMLElement) => {
          const stockInfo = container.querySelector('.text-xs.text-gray-500');
          expect(stockInfo?.textContent).toContain('-1');
        },
      },
    };

    Object.entries(testCases).forEach(([testName, { product, assertion }]) => {
      test(testName, () => {
        const { container } = render(<ProductCard product={product} />);
        assertion(container);
      });
    });
  });
});

