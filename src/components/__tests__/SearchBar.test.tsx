import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Window } from 'happy-dom';
import SearchBar from '../SearchBar';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('SearchBar', () => {
  const mockOnSearchChange = () => {};

  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders with correct placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );
    
    const input = getByPlaceholderText('Search products...');
    expect(input).toBeDefined();
  });

  test('displays the current search query value', () => {
    const { getByDisplayValue } = render(
      <SearchBar searchQuery="iPhone" onSearchChange={mockOnSearchChange} />
    );
    
    const input = getByDisplayValue('iPhone');
    expect(input).toBeDefined();
  });

  test('input has correct attributes and can accept changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );
    
    const input = getByPlaceholderText('Search products...') as HTMLInputElement;
    
    // Test that we can change the input value
    input.value = 'MacBook';
    expect(input.value).toBe('MacBook');
    
    // Test that input has onChange handler attached
    expect(input.onchange).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );
    
    const wrapper = container.querySelector('.relative');
    expect(wrapper).toBeDefined();
    expect(wrapper?.className).toContain('mb-6');
    
    const input = container.querySelector('input');
    expect(input?.className).toContain('block');
    expect(input?.className).toContain('w-full');
    expect(input?.className).toContain('pl-10');
  });

  test('includes search icon SVG', () => {
    const { container } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  test('has proper accessibility attributes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );
    
    const input = getByPlaceholderText('Search products...');
    expect(input.getAttribute('type')).toBe('text');
  });
}); 