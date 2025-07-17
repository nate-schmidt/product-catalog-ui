import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, cleanup, userEvent } from './test-utils/render';
import { App } from './App';

describe('App Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders without crashing', () => {
      const { container } = render(<App />);
      expect(container).toBeTruthy();
    });

    test('displays the main heading with correct text', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Hello World! 👋');
    });

    test('displays the subtitle with correct text', () => {
      render(<App />);
      const subtitle = screen.getByText('One day I hope to be an ecommerce website.');
      expect(subtitle).toBeInTheDocument();
    });

    test('renders with correct DOM structure', () => {
      const { container } = render(<App />);
      
      // Check main container exists
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
      
      // Check flex container exists
      const flexContainer = container.querySelector('.flex.flex-col');
      expect(flexContainer).toBeInTheDocument();
      
      // Check that heading and subtitle are siblings
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText('One day I hope to be an ecommerce website.');
      expect(heading.parentElement).toBe(subtitle.parentElement);
    });
  });

  describe('Styling', () => {
    test('applies correct CSS classes to main container', () => {
      const { container } = render(<App />);
      const mainContainer = container.querySelector('.max-w-7xl');
      
      expect(mainContainer).toHaveClass(
        'max-w-7xl',
        'mx-auto',
        'p-8',
        'text-center',
        'relative',
        'z-10'
      );
    });

    test('applies correct CSS classes to flex container', () => {
      const { container } = render(<App />);
      const flexContainer = container.querySelector('.flex');
      
      expect(flexContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-[60vh]',
        'gap-8'
      );
    });

    test('applies correct text styling to heading', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(heading).toHaveClass(
        'text-6xl',
        'font-bold',
        'text-white',
        'mb-4'
      );
    });

    test('applies correct text styling to subtitle', () => {
      render(<App />);
      const subtitle = screen.getByText('One day I hope to be an ecommerce website.');
      
      expect(subtitle).toHaveClass(
        'text-2xl',
        'text-gray-300',
        'max-w-2xl',
        'leading-relaxed'
      );
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<App />);
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveProperty('tagName', 'H1');
    });

    test('uses semantic HTML elements', () => {
      const { container } = render(<App />);
      
      // Check for div containers (should exist)
      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(0);
      
      // Check for proper text elements
      const h1 = container.querySelector('h1');
      const p = container.querySelector('p');
      expect(h1).toBeInTheDocument();
      expect(p).toBeInTheDocument();
    });

    test('has sufficient color contrast', () => {
      render(<App />);
      
      // These tests would ideally use a contrast checking library
      // For now, we're verifying the classes that should provide good contrast
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText('One day I hope to be an ecommerce website.');
      
      expect(heading).toHaveClass('text-white');
      expect(subtitle).toHaveClass('text-gray-300');
    });
  });

  describe('Responsive Design', () => {
    test('uses responsive utility classes', () => {
      const { container } = render(<App />);
      
      // Check for responsive max-width
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
      
      // Check for responsive padding
      expect(mainContainer).toHaveClass('p-8');
      
      // Check for responsive text sizing
      const heading = screen.getByRole('heading', { level: 1 });
      const subtitle = screen.getByText('One day I hope to be an ecommerce website.');
      expect(heading).toHaveClass('text-6xl');
      expect(subtitle).toHaveClass('text-2xl');
    });
  });
}); 