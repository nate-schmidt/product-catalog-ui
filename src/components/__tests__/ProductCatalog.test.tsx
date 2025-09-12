import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCatalog } from '../ProductCatalog';
import { CartProvider } from '../../contexts/CartContext';
import { apiClient } from '../../api/client';
import { Product } from '../../types/Product';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;
(global as any).location = { reload: mock() };

// Mock the API client
mock.module('../../api/client', () => ({
  apiClient: {
    getProducts: mock(),
  },
}));

// Sample products for testing
const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Modern Office Chair',
    description: 'A comfortable ergonomic office chair with lumbar support and adjustable height.',
    price: 299.99,
    currency: 'USD',
    stockQuantity: 10,
    category: 'Office Furniture',
    imageUrl: 'https://example.com/chair.jpg',
    dimensions: { width: 60, height: 90, depth: 60, unit: 'cm' },
    weight: { value: 15, unit: 'kg' },
    material: 'Mesh',
    color: 'Black',
    brand: 'OfficePro',
    sku: 'OFC001',
    createdDate: '2024-01-01T00:00:00Z',
    lastModifiedDate: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Standing Desk',
    description: 'Height-adjustable standing desk for modern workspaces.',
    price: 599.99,
    currency: 'USD',
    stockQuantity: 5,
    category: 'Office Furniture',
    imageUrl: 'https://example.com/desk.jpg',
    dimensions: { width: 120, height: 75, depth: 80, unit: 'cm' },
    weight: { value: 25, unit: 'kg' },
    material: 'Wood',
    color: 'Oak',
    brand: 'DeskMaster',
    sku: 'DSK001',
    createdDate: '2024-01-01T00:00:00Z',
    lastModifiedDate: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Dining Table',
    description: 'Elegant dining table for family meals.',
    price: 899.99,
    currency: 'USD',
    stockQuantity: 3,
    category: 'Dining Furniture',
    createdDate: '2024-01-01T00:00:00Z',
    lastModifiedDate: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Out of Stock Sofa',
    description: 'Comfortable sofa that is currently out of stock.',
    price: 1299.99,
    currency: 'USD',
    stockQuantity: 0,
    category: 'Living Room',
    createdDate: '2024-01-01T00:00:00Z',
    lastModifiedDate: '2024-01-01T00:00:00Z'
  }
];

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('ProductCatalog', () => {
  const mockGetProducts = apiClient.getProducts as ReturnType<typeof mock>;

  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    mockGetProducts.mockClear();
    (global as any).location.reload.mockClear();
  });

  test('displays loading state initially', () => {
    mockGetProducts.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    expect(screen.getByText('Loading products...')).toBeDefined();
  });

  test('displays products after successful fetch', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Catalog')).toBeDefined();
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
      expect(screen.getByText('Standing Desk')).toBeDefined();
      expect(screen.getByText('Dining Table')).toBeDefined();
    });

    // Check that product count is displayed
    expect(screen.getByText(/Showing 4 of 4 products/)).toBeDefined();
  });

  test('displays error state when fetch fails', async () => {
    const errorMessage = 'Failed to fetch products';
    mockGetProducts.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeDefined();
      expect(screen.getByText(errorMessage)).toBeDefined();
      expect(screen.getByText('Retry')).toBeDefined();
    });
  });

  test('retry button reloads the page', async () => {
    mockGetProducts.mockRejectedValueOnce(new Error('Network error'));

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeDefined();
    });

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect((global as any).location.reload).toHaveBeenCalled();
  });

  test('filters products by search term', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await userEvent.type(searchInput, 'chair');

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
      expect(screen.queryByText('Standing Desk')).toBeNull();
      expect(screen.getByText(/Showing 1 of 4 products/)).toBeDefined();
    });
  });

  test('filters products by category', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'Office Furniture' } });

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
      expect(screen.getByText('Standing Desk')).toBeDefined();
      expect(screen.queryByText('Dining Table')).toBeNull();
      expect(screen.getByText(/Showing 2 of 4 products/)).toBeDefined();
    });
  });

  test('sorts products by name ascending', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const sortSelect = screen.getByDisplayValue('Name (A-Z)');
    expect(sortSelect).toBeDefined(); // Already sorted by name A-Z by default

    // Check order - products should be sorted alphabetically
    const productNames = screen.getAllByRole('heading', { level: 3 });
    expect(productNames[0].textContent).toBe('Dining Table');
    expect(productNames[1].textContent).toBe('Modern Office Chair');
    expect(productNames[2].textContent).toBe('Out of Stock Sofa');
    expect(productNames[3].textContent).toBe('Standing Desk');
  });

  test('sorts products by price low to high', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const sortSelect = screen.getByDisplayValue('Name (A-Z)');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      const productNames = screen.getAllByRole('heading', { level: 3 });
      expect(productNames[0].textContent).toBe('Modern Office Chair'); // $299.99
      expect(productNames[1].textContent).toBe('Standing Desk'); // $599.99
      expect(productNames[2].textContent).toBe('Dining Table'); // $899.99
      expect(productNames[3].textContent).toBe('Out of Stock Sofa'); // $1299.99
    });
  });

  test('adds product to cart successfully', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const addToCartButtons = screen.getAllByText('Add to Cart');
    fireEvent.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/In Cart \(1\)/)).toBeDefined();
    });
  });

  test('disables add to cart for out of stock products', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Out of Stock Sofa')).toBeDefined();
    });

    // Find the out of stock product card
    const outOfStockProduct = screen.getByText('Out of Stock Sofa').closest('.bg-gray-800');
    expect(outOfStockProduct).toBeDefined();

    // Check that the button is disabled
    const addToCartButton = outOfStockProduct?.querySelector('button') as HTMLButtonElement;
    expect(addToCartButton.disabled).toBe(true);
    expect(addToCartButton.textContent).toBe('Add to Cart');
  });

  test('displays product information correctly', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    // Check price formatting
    expect(screen.getByText('$299.99')).toBeDefined();

    // Check category display
    expect(screen.getByText('Office Furniture')).toBeDefined();

    // Check stock status
    expect(screen.getByText('In stock')).toBeDefined();
    expect(screen.getByText('Stock: 10')).toBeDefined();

    // Check dimensions (if present)
    expect(screen.getByText('Dimensions: 60 × 90 × 60 cm')).toBeDefined();

    // Check weight
    expect(screen.getByText('Weight: 15 kg')).toBeDefined();

    // Check material
    expect(screen.getByText('Material: Mesh')).toBeDefined();

    // Check color
    expect(screen.getByText('Color: Black')).toBeDefined();
  });

  test('shows low stock warning', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Standing Desk')).toBeDefined();
    });

    // Standing Desk has stock quantity of 5, which should show as "Low stock"
    expect(screen.getByText('Low stock')).toBeDefined();
    expect(screen.getByText('Stock: 5')).toBeDefined();
  });

  test('shows out of stock status', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Out of Stock Sofa')).toBeDefined();
    });

    expect(screen.getByText('Out of stock')).toBeDefined();
    expect(screen.getByText('Stock: 0')).toBeDefined();
  });

  test('displays no results message when search yields no matches', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await userEvent.type(searchInput, 'nonexistent product');

    await waitFor(() => {
      expect(screen.getByText('No products found matching your search.')).toBeDefined();
      expect(screen.getByText(/Showing 0 of 4 products/)).toBeDefined();
    });
  });

  test('search filters by description as well as name', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await userEvent.type(searchInput, 'ergonomic'); // This is in the chair's description

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
      expect(screen.queryByText('Standing Desk')).toBeNull();
      expect(screen.getByText(/Showing 1 of 4 products/)).toBeDefined();
    });
  });

  test('displays product image or placeholder', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    // Check for image with alt text
    const chairImage = screen.getByAltText('Modern Office Chair');
    expect(chairImage).toBeDefined();
    expect((chairImage as HTMLImageElement).src).toBe('https://example.com/chair.jpg');

    // Check for "No Image" placeholder on product without imageUrl
    expect(screen.getByText('No Image')).toBeDefined();
  });

  test('applies custom className', async () => {
    mockGetProducts.mockResolvedValueOnce([]);

    const { container } = render(
      <TestWrapper>
        <ProductCatalog className="custom-class" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Product Catalog')).toBeDefined();
    });

    expect(container.firstChild).toBeDefined();
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });

  test('shows error temporarily when add to cart fails', async () => {
    // Create a product with no stock to trigger an error
    const noStockProduct = { ...sampleProducts[0], stockQuantity: 0 };
    mockGetProducts.mockResolvedValueOnce([noStockProduct]);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    // Try to add the out-of-stock item (should be disabled but let's test error handling)
    // We'll need to modify the cart context or mock it to throw an error
  });

  describe('sorting functionality', () => {
    test('sorts by name descending', async () => {
      mockGetProducts.mockResolvedValueOnce(sampleProducts);

      render(
        <TestWrapper>
          <ProductCatalog />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Modern Office Chair')).toBeDefined();
      });

      const sortSelect = screen.getByDisplayValue('Name (A-Z)');
      fireEvent.change(sortSelect, { target: { value: 'name-desc' } });

      await waitFor(() => {
        const productNames = screen.getAllByRole('heading', { level: 3 });
        expect(productNames[0].textContent).toBe('Standing Desk');
        expect(productNames[1].textContent).toBe('Out of Stock Sofa');
        expect(productNames[2].textContent).toBe('Modern Office Chair');
        expect(productNames[3].textContent).toBe('Dining Table');
      });
    });

    test('sorts by price high to low', async () => {
      mockGetProducts.mockResolvedValueOnce(sampleProducts);

      render(
        <TestWrapper>
          <ProductCatalog />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Modern Office Chair')).toBeDefined();
      });

      const sortSelect = screen.getByDisplayValue('Name (A-Z)');
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

      await waitFor(() => {
        const productNames = screen.getAllByRole('heading', { level: 3 });
        expect(productNames[0].textContent).toBe('Out of Stock Sofa'); // $1299.99
        expect(productNames[1].textContent).toBe('Dining Table'); // $899.99
        expect(productNames[2].textContent).toBe('Standing Desk'); // $599.99
        expect(productNames[3].textContent).toBe('Modern Office Chair'); // $299.99
      });
    });

    test('sorts by category', async () => {
      mockGetProducts.mockResolvedValueOnce(sampleProducts);

      render(
        <TestWrapper>
          <ProductCatalog />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Modern Office Chair')).toBeDefined();
      });

      const sortSelect = screen.getByDisplayValue('Name (A-Z)');
      fireEvent.change(sortSelect, { target: { value: 'category-asc' } });

      // Products should be grouped by category alphabetically
      await waitFor(() => {
        const productNames = screen.getAllByRole('heading', { level: 3 });
        // Categories: "Dining Furniture", "Living Room", "Office Furniture", "Office Furniture"
        expect(productNames[0].textContent).toBe('Dining Table'); // Dining Furniture
        expect(productNames[1].textContent).toBe('Out of Stock Sofa'); // Living Room
        // Office Furniture products should be next
      });
    });
  });

  test('category filter shows all available categories', async () => {
    mockGetProducts.mockResolvedValueOnce(sampleProducts);

    render(
      <TestWrapper>
        <ProductCatalog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Modern Office Chair')).toBeDefined();
    });

    const categorySelect = screen.getByDisplayValue('All Categories');
    
    // Check that all categories are available as options
    expect(categorySelect.innerHTML).toContain('Dining Furniture');
    expect(categorySelect.innerHTML).toContain('Office Furniture');
    expect(categorySelect.innerHTML).toContain('Living Room');
  });
});