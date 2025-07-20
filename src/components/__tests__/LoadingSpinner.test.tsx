import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup } from '@testing-library/react';
import { Window } from 'happy-dom';
import LoadingSpinner from '../LoadingSpinner';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('LoadingSpinner', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing', () => {
    render(<LoadingSpinner />);
  });

  test('renders with default medium size', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
    expect(spinner?.className).toContain('h-8');
    expect(spinner?.className).toContain('w-8');
  });

  test('renders with small size when specified', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner?.className).toContain('h-4');
    expect(spinner?.className).toContain('w-4');
  });

  test('renders with large size when specified', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner?.className).toContain('h-12');
    expect(spinner?.className).toContain('w-12');
  });

  test('displays message when provided', () => {
    const { getByText } = render(
      <LoadingSpinner message="Loading products..." />
    );
    
    expect(getByText('Loading products...')).toBeDefined();
  });

  test('does not display message when not provided', () => {
    const { container } = render(<LoadingSpinner />);
    
    const message = container.querySelector('p');
    expect(message).toBeNull();
  });

  test('has correct CSS classes for container', () => {
    const { container } = render(<LoadingSpinner />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.className).toContain('flex');
    expect(wrapper?.className).toContain('flex-col');
    expect(wrapper?.className).toContain('items-center');
    expect(wrapper?.className).toContain('justify-center');
    expect(wrapper?.className).toContain('p-8');
  });

  test('has correct CSS classes for spinner', () => {
    const { container } = render(<LoadingSpinner />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner?.className).toContain('rounded-full');
    expect(spinner?.className).toContain('border-2');
    expect(spinner?.className).toContain('border-gray-300');
    expect(spinner?.className).toContain('border-t-blue-600');
  });

  test('message has correct CSS classes', () => {
    const { getByText } = render(
      <LoadingSpinner message="Loading..." />
    );
    
    const message = getByText('Loading...');
    expect(message.className).toContain('mt-2');
    expect(message.className).toContain('text-sm');
    expect(message.className).toContain('text-gray-600');
  });
}); 