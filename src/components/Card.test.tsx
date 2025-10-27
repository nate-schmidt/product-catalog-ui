import { test, expect, describe } from 'bun:test';
import { render } from '@testing-library/react';
import Card from './Card';
import { Window } from 'happy-dom';

// Setup DOM environment
const window = new Window();
(global as any).window = window;
(global as any).document = window.document;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).Node = window.Node;

describe('Card', () => {
  test('renders basic card with children', () => {
    const { getByText, container } = render(
      <Card>
        <div>Card content</div>
      </Card>
    );

    expect(getByText('Card content')).toBeDefined();
    
    const cardElement = container.querySelector('.bg-white');
    expect(cardElement).toBeDefined();
    expect(cardElement?.className).toContain('rounded-lg');
    expect(cardElement?.className).toContain('shadow-lg');
    expect(cardElement?.className).toContain('overflow-hidden');
  });

  test('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    );

    const cardElement = container.querySelector('.custom-class');
    expect(cardElement).toBeDefined();
    expect(cardElement?.className).toContain('bg-white');
    expect(cardElement?.className).toContain('custom-class');
  });

  test('renders without additional className', () => {
    const { container } = render(
      <Card>
        <div>Content</div>
      </Card>
    );

    const cardElement = container.querySelector('.bg-white');
    expect(cardElement?.className).toBe('bg-white rounded-lg shadow-lg overflow-hidden ');
  });

  describe('Card.Header', () => {
    test('renders header with correct styling', () => {
      const { getByText, container } = render(
        <Card>
          <Card.Header>Header content</Card.Header>
        </Card>
      );

      expect(getByText('Header content')).toBeDefined();
      
      const headerElement = container.querySelector('.border-b');
      expect(headerElement).toBeDefined();
      expect(headerElement?.className).toContain('px-6');
      expect(headerElement?.className).toContain('py-4');
      expect(headerElement?.className).toContain('border-gray-200');
    });

    test('applies custom className to header', () => {
      const { container } = render(
        <Card>
          <Card.Header className="custom-header">Header</Card.Header>
        </Card>
      );

      const headerElement = container.querySelector('.custom-header');
      expect(headerElement).toBeDefined();
      expect(headerElement?.className).toContain('custom-header');
      expect(headerElement?.className).toContain('px-6');
    });
  });

  describe('Card.Content', () => {
    test('renders content with correct styling', () => {
      const { getByText, container } = render(
        <Card>
          <Card.Content>Content text</Card.Content>
        </Card>
      );

      expect(getByText('Content text')).toBeDefined();
      
      const contentElement = container.querySelector('.px-6.py-4');
      expect(contentElement).toBeDefined();
      expect(contentElement?.className).toContain('px-6');
      expect(contentElement?.className).toContain('py-4');
    });

    test('applies custom className to content', () => {
      const { container } = render(
        <Card>
          <Card.Content className="custom-content">Content</Card.Content>
        </Card>
      );

      const contentElement = container.querySelector('.custom-content');
      expect(contentElement).toBeDefined();
      expect(contentElement?.className).toContain('custom-content');
      expect(contentElement?.className).toContain('px-6');
    });
  });

  describe('Card.Footer', () => {
    test('renders footer with correct styling', () => {
      const { getByText, container } = render(
        <Card>
          <Card.Footer>Footer content</Card.Footer>
        </Card>
      );

      expect(getByText('Footer content')).toBeDefined();
      
      const footerElement = container.querySelector('.border-t');
      expect(footerElement).toBeDefined();
      expect(footerElement?.className).toContain('px-6');
      expect(footerElement?.className).toContain('py-4');
      expect(footerElement?.className).toContain('border-gray-200');
      expect(footerElement?.className).toContain('bg-gray-50');
    });

    test('applies custom className to footer', () => {
      const { container } = render(
        <Card>
          <Card.Footer className="custom-footer">Footer</Card.Footer>
        </Card>
      );

      const footerElement = container.querySelector('.custom-footer');
      expect(footerElement).toBeDefined();
      expect(footerElement?.className).toContain('custom-footer');
      expect(footerElement?.className).toContain('px-6');
    });
  });

  describe('Complete card layout', () => {
    test('renders complete card with header, content, and footer', () => {
      const { getByText } = render(
        <Card className="test-card">
          <Card.Header>Product Title</Card.Header>
          <Card.Content>
            <p>Product description</p>
            <p>Price: $99.99</p>
          </Card.Content>
          <Card.Footer>
            <button>Add to Cart</button>
          </Card.Footer>
        </Card>
      );

      expect(getByText('Product Title')).toBeDefined();
      expect(getByText('Product description')).toBeDefined();
      expect(getByText('Price: $99.99')).toBeDefined();
      expect(getByText('Add to Cart')).toBeDefined();
    });

    test('maintains proper structure and styling hierarchy', () => {
      const { container } = render(
        <Card>
          <Card.Header>Header</Card.Header>
          <Card.Content>Content</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );

      const cardElement = container.querySelector('.bg-white');
      expect(cardElement).toBeDefined();
      
      const headerElement = cardElement?.querySelector('.border-b.border-gray-200');
      expect(headerElement).toBeDefined();
      
      const contentElement = cardElement?.querySelector('.px-6.py-4:not(.border-t):not(.border-b)');
      expect(contentElement).toBeDefined();
      
      const footerElement = cardElement?.querySelector('.border-t.bg-gray-50');
      expect(footerElement).toBeDefined();
    });
  });

  describe('Accessibility and semantic structure', () => {
    test('uses appropriate semantic HTML structure', () => {
      const { container } = render(
        <Card>
          <Card.Header>
            <h2>Product Title</h2>
          </Card.Header>
          <Card.Content>
            <p>Description</p>
          </Card.Content>
          <Card.Footer>
            <button>Action</button>
          </Card.Footer>
        </Card>
      );

      const headingElement = container.querySelector('h2');
      expect(headingElement?.textContent).toBe('Product Title');
      
      const paragraphElement = container.querySelector('p');
      expect(paragraphElement?.textContent).toBe('Description');
      
      const buttonElement = container.querySelector('button');
      expect(buttonElement?.textContent).toBe('Action');
    });

    test('handles complex content structure', () => {
      const { getByText } = render(
        <Card>
          <Card.Header className="flex justify-between">
            <h3>Product Name</h3>
            <span className="badge">New</span>
          </Card.Header>
          <Card.Content>
            <div className="product-details">
              <p>Complex product information</p>
              <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
              </ul>
            </div>
          </Card.Content>
          <Card.Footer>
            <div className="actions">
              <button className="primary">Buy Now</button>
              <button className="secondary">Add to Wishlist</button>
            </div>
          </Card.Footer>
        </Card>
      );

      expect(getByText('Product Name')).toBeDefined();
      expect(getByText('New')).toBeDefined();
      expect(getByText('Complex product information')).toBeDefined();
      expect(getByText('Feature 1')).toBeDefined();
      expect(getByText('Feature 2')).toBeDefined();
      expect(getByText('Buy Now')).toBeDefined();
      expect(getByText('Add to Wishlist')).toBeDefined();
    });
  });
});