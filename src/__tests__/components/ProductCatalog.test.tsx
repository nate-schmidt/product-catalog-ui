import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { ProductCatalog } from '../../components/ProductCatalog';
import { 
  renderWithProviders, 
  createMockProducts, 
  createMockProduct,
  createMockFunctions, 
  cleanupAfterEach,
  screen,
  fireEvent,
  waitFor
} from '../utils/test-helpers';

describe('ProductCatalog', () => {
  const mockFunctions = createMockFunctions();
  
  beforeEach(() => {
    cleanupAfterEach();
    mockFunctions.onProductQuickView.mockClear();
  });

  test('renders products correctly', () => {
    const products = createMockProducts(3);

    renderWithProviders(<ProductCatalog products={products} />);

    products.forEach(product => {
      expect(screen.getByText(product.name)).toBeDefined();
    });
    expect(screen.getByText('3 products found')).toBeDefined();
  });

  test('displays loading state', () => {
    const products = createMockProducts(5);

    renderWithProviders(<ProductCatalog products={products} loading={true} />);

    expect(screen.getByText('Loading products...')).toBeDefined();
    
    // Check for loading skeletons
    const skeletons = screen.container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('displays error state', () => {
    const products = createMockProducts(5);
    const errorMessage = 'Failed to load products';

    renderWithProviders(
      <ProductCatalog products={products} error={errorMessage} />
    );

    expect(screen.getByText(errorMessage)).toBeDefined();
    expect(screen.container.querySelector('.text-red-600')).toBeDefined();
  });

  test('handles empty product list', () => {
    renderWithProviders(<ProductCatalog products={[]} />);

    expect(screen.getByText('0 products found')).toBeDefined();
    expect(screen.getByText('No products found matching your criteria.')).toBeDefined();
  });

  test('search functionality works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', name: 'iPhone 14', description: 'Latest smartphone' }),
      createMockProduct({ id: '2', name: 'Samsung Galaxy', description: 'Android device' }),
      createMockProduct({ id: '3', name: 'MacBook Pro', description: 'Laptop computer' }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });

    await waitFor(() => {
      expect(screen.getByText('iPhone 14')).toBeDefined();
      expect(screen.queryByText('Samsung Galaxy')).toBeNull();
      expect(screen.queryByText('MacBook Pro')).toBeNull();
      expect(screen.getByText('1 product found')).toBeDefined();
    });
  });

  test('category filter works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', category: 'electronics', name: 'Phone' }),
      createMockProduct({ id: '2', category: 'clothing', name: 'Shirt' }),
      createMockProduct({ id: '3', category: 'electronics', name: 'Laptop' }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const categoryFilter = screen.getByTestId('category-filter');
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } });

    await waitFor(() => {
      expect(screen.getByText('Phone')).toBeDefined();
      expect(screen.getByText('Laptop')).toBeDefined();
      expect(screen.queryByText('Shirt')).toBeNull();
      expect(screen.getByText('2 products found')).toBeDefined();
    });
  });

  test('sort by name works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', name: 'Zebra Product' }),
      createMockProduct({ id: '2', name: 'Alpha Product' }),
      createMockProduct({ id: '3', name: 'Beta Product' }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const sortFilter = screen.getByTestId('sort-filter');
    fireEvent.change(sortFilter, { target: { value: 'name' } });

    await waitFor(() => {
      const productCards = screen.container.querySelectorAll('[data-testid^="product-card-"]');
      const firstCard = productCards[0];
      const lastCard = productCards[productCards.length - 1];
      
      expect(firstCard.textContent).toContain('Alpha Product');
      expect(lastCard.textContent).toContain('Zebra Product');
    });
  });

  test('sort by price works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', name: 'Expensive', price: 100 }),
      createMockProduct({ id: '2', name: 'Cheap', price: 10 }),
      createMockProduct({ id: '3', name: 'Medium', price: 50 }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const sortFilter = screen.getByTestId('sort-filter');
    fireEvent.change(sortFilter, { target: { value: 'price' } });

    await waitFor(() => {
      const productCards = screen.container.querySelectorAll('[data-testid^="product-card-"]');
      const firstCard = productCards[0];
      const lastCard = productCards[productCards.length - 1];
      
      expect(firstCard.textContent).toContain('Cheap');
      expect(lastCard.textContent).toContain('Expensive');
    });
  });

  test('sort order toggle works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', name: 'Alpha', price: 100 }),
      createMockProduct({ id: '2', name: 'Beta', price: 50 }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    // Set sort by price
    const sortFilter = screen.getByTestId('sort-filter');
    fireEvent.change(sortFilter, { target: { value: 'price' } });

    // Change to descending order
    await waitFor(() => {
      const sortOrderFilter = screen.getByTestId('sort-order-filter');
      fireEvent.change(sortOrderFilter, { target: { value: 'desc' } });
    });

    await waitFor(() => {
      const productCards = screen.container.querySelectorAll('[data-testid^="product-card-"]');
      const firstCard = productCards[0];
      
      expect(firstCard.textContent).toContain('Alpha'); // Higher price first
    });
  });

  test('in-stock filter works correctly', async () => {
    const products = [
      createMockProduct({ id: '1', name: 'Available', inStock: true }),
      createMockProduct({ id: '2', name: 'Out of Stock', inStock: false }),
      createMockProduct({ id: '3', name: 'Also Available', inStock: true }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const stockFilter = screen.getByTestId('stock-filter');
    fireEvent.click(stockFilter);

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeDefined();
      expect(screen.getByText('Also Available')).toBeDefined();
      expect(screen.queryByText('Out of Stock')).toBeNull();
      expect(screen.getByText('2 products found')).toBeDefined();
    });
  });

  test('clear filters works correctly', async () => {
    const products = createMockProducts(5);

    renderWithProviders(<ProductCatalog products={products} />);

    // Apply some filters
    const searchInput = screen.getByTestId('search-input');
    const categoryFilter = screen.getByTestId('category-filter');
    const stockFilter = screen.getByTestId('stock-filter');

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } });
    fireEvent.click(stockFilter);

    // Clear filters
    const clearButton = screen.getByTestId('clear-filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect((searchInput as HTMLInputElement).value).toBe('');
      expect((categoryFilter as HTMLSelectElement).value).toBe('');
      expect((stockFilter as HTMLInputElement).checked).toBe(false);
      expect(screen.getByText('5 products found')).toBeDefined();
    });
  });

  test('generates categories list correctly', () => {
    const products = [
      createMockProduct({ category: 'electronics' }),
      createMockProduct({ category: 'clothing' }),
      createMockProduct({ category: 'electronics' }),
      createMockProduct({ category: 'books' }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    const categoryFilter = screen.getByTestId('category-filter');
    const options = categoryFilter.querySelectorAll('option');
    
    // Should have "All Categories" + 3 unique categories
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe('All Categories');
    expect(options[1].textContent).toBe('Books'); // Sorted alphabetically
    expect(options[2].textContent).toBe('Clothing');
    expect(options[3].textContent).toBe('Electronics');
  });

  test('passes onProductQuickView to ProductCard components', () => {
    const products = createMockProducts(2);

    renderWithProviders(
      <ProductCatalog 
        products={products} 
        onProductQuickView={mockFunctions.onProductQuickView} 
      />
    );

    // Find and click a quick view button
    const quickViewButton = screen.getByLabelText(`Quick view ${products[0].name}`);
    fireEvent.click(quickViewButton);

    expect(mockFunctions.onProductQuickView).toHaveBeenCalledWith(products[0]);
  });

  test('applies initial filters correctly', () => {
    const products = createMockProducts(5);
    const initialFilters = {
      category: 'electronics',
      inStockOnly: true,
      sortBy: 'price' as const,
      sortOrder: 'desc' as const,
    };

    renderWithProviders(
      <ProductCatalog products={products} initialFilters={initialFilters} />
    );

    const categoryFilter = screen.getByTestId('category-filter') as HTMLSelectElement;
    const stockFilter = screen.getByTestId('stock-filter') as HTMLInputElement;
    const sortFilter = screen.getByTestId('sort-filter') as HTMLSelectElement;
    const sortOrderFilter = screen.getByTestId('sort-order-filter') as HTMLSelectElement;

    expect(categoryFilter.value).toBe('electronics');
    expect(stockFilter.checked).toBe(true);
    expect(sortFilter.value).toBe('price');
    expect(sortOrderFilter.value).toBe('desc');
  });

  test('applies custom className correctly', () => {
    const products = createMockProducts(3);
    const customClass = 'custom-catalog-class';

    renderWithProviders(
      <ProductCatalog products={products} className={customClass} />
    );

    const catalog = screen.container.firstChild as HTMLElement;
    expect(catalog.className).toContain(customClass);
  });

  test('handles combined filters correctly', async () => {
    const products = [
      createMockProduct({ 
        id: '1', 
        name: 'iPhone 14', 
        category: 'electronics', 
        inStock: true, 
        price: 999 
      }),
      createMockProduct({ 
        id: '2', 
        name: 'Samsung Galaxy', 
        category: 'electronics', 
        inStock: false, 
        price: 899 
      }),
      createMockProduct({ 
        id: '3', 
        name: 'T-Shirt', 
        category: 'clothing', 
        inStock: true, 
        price: 25 
      }),
    ];

    renderWithProviders(<ProductCatalog products={products} />);

    // Apply search and category filter
    const searchInput = screen.getByTestId('search-input');
    const categoryFilter = screen.getByTestId('category-filter');
    const stockFilter = screen.getByTestId('stock-filter');

    fireEvent.change(searchInput, { target: { value: 'samsung' } });
    fireEvent.change(categoryFilter, { target: { value: 'electronics' } });
    fireEvent.click(stockFilter); // In stock only

    await waitFor(() => {
      // Samsung Galaxy should be filtered out because it's out of stock
      expect(screen.queryByText('Samsung Galaxy')).toBeNull();
      expect(screen.queryByText('iPhone 14')).toBeNull(); // Doesn't match search
      expect(screen.queryByText('T-Shirt')).toBeNull(); // Different category
      expect(screen.getByText('0 products found')).toBeDefined();
    });
  });

  test('singular vs plural products text', () => {
    // Test singular
    const singleProduct = [createMockProduct()];
    const { rerender } = renderWithProviders(<ProductCatalog products={singleProduct} />);
    expect(screen.getByText('1 product found')).toBeDefined();

    // Test plural
    rerender(<ProductCatalog products={createMockProducts(3)} />);
    expect(screen.getByText('3 products found')).toBeDefined();
  });
});