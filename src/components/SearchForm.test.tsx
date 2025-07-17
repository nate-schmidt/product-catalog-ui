import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, cleanup, userEvent, waitFor } from '../test-utils/render';

// Example SearchForm component for reference
const SearchForm = ({ 
  onSearch,
  placeholder = 'Search products...',
  initialValue = ''
}: { 
  onSearch: (query: string) => void,
  placeholder?: string,
  initialValue?: string
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="relative">
        <input
          type="search"
          name="search"
          placeholder={placeholder}
          defaultValue={initialValue}
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800"
          aria-label="Submit search"
        >
          🔍
        </button>
      </div>
    </form>
  );
};

describe('SearchForm Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders search input with default placeholder', () => {
      render(<SearchForm onSearch={() => {}} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'search');
    });

    test('renders with custom placeholder', () => {
      render(<SearchForm onSearch={() => {}} placeholder="Find items..." />);
      
      const input = screen.getByPlaceholderText('Find items...');
      expect(input).toBeInTheDocument();
    });

    test('renders with initial value', () => {
      render(<SearchForm onSearch={() => {}} initialValue="Electronics" />);
      
      const input = screen.getByDisplayValue('Electronics');
      expect(input).toBeInTheDocument();
    });

    test('renders submit button', () => {
      render(<SearchForm onSearch={() => {}} />);
      
      const button = screen.getByRole('button', { name: 'Submit search' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('calls onSearch with input value on form submission', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, 'laptop');
      
      const form = screen.getByRole('search') || input.closest('form')!;
      await user.type(input, '{Enter}');
      
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('laptop');
    });

    test('trims whitespace from search query', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, '  shoes  ');
      await user.type(input, '{Enter}');
      
      expect(spy).toHaveBeenCalledWith('shoes');
    });

    test('calls onSearch when clicking submit button', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, 'phone');
      
      const button = screen.getByRole('button', { name: 'Submit search' });
      await user.click(button);
      
      expect(spy).toHaveBeenCalledWith('phone');
    });

    test('handles empty search', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, '{Enter}');
      
      expect(spy).toHaveBeenCalledWith('');
    });

    test('clears input when typing and clearing', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={() => {}} />);
      
      const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
      
      await user.type(input, 'test');
      expect(input.value).toBe('test');
      
      await user.clear(input);
      expect(input.value).toBe('');
    });
  });

  describe('Keyboard Navigation', () => {
    test('submits form on Enter key', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, 'keyboard{Enter}');
      
      expect(spy).toHaveBeenCalledWith('keyboard');
    });

    test('input is focusable via keyboard', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={() => {}} />);
      
      await user.tab();
      
      const input = screen.getByPlaceholderText('Search products...');
      expect(input).toHaveFocus();
    });

    test('button is reachable via keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SearchForm onSearch={() => {}} />);
      
      await user.tab(); // Focus input
      await user.tab(); // Focus button
      
      const button = screen.getByRole('button', { name: 'Submit search' });
      expect(button).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('input has accessible label', () => {
      render(<SearchForm onSearch={() => {}} />);
      
      const input = screen.getByLabelText('Search');
      expect(input).toBeInTheDocument();
    });

    test('button has accessible label', () => {
      render(<SearchForm onSearch={() => {}} />);
      
      const button = screen.getByLabelText('Submit search');
      expect(button).toBeInTheDocument();
    });

    test('form has proper structure', () => {
      const { container } = render(<SearchForm onSearch={() => {}} />);
      
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
      
      const input = form?.querySelector('input[type="search"]');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    test('applies correct CSS classes', () => {
      const { container } = render(<SearchForm onSearch={() => {}} />);
      
      const form = container.querySelector('.search-form');
      expect(form).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText('Search products...');
      expect(input).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'pr-10',
        'border',
        'rounded-lg',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-blue-500'
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'absolute',
        'right-2',
        'top-1/2',
        '-translate-y-1/2',
        'p-1',
        'text-gray-600',
        'hover:text-gray-800'
      );
    });
  });

  describe('Edge Cases', () => {
    test('handles special characters in search', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, 'test@#$%{Enter}');
      
      expect(spy).toHaveBeenCalledWith('test@#$%');
    });

    test('handles very long search queries', async () => {
      const mockOnSearch = { fn: (query: string) => {} };
      const spy = spyOn(mockOnSearch, 'fn');
      const user = userEvent.setup();

      render(<SearchForm onSearch={mockOnSearch.fn} />);
      
      const longQuery = 'a'.repeat(100);
      const input = screen.getByPlaceholderText('Search products...');
      await user.type(input, longQuery + '{Enter}');
      
      expect(spy).toHaveBeenCalledWith(longQuery);
    });
  });
});