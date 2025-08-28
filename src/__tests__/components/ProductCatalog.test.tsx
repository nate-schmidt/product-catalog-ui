/**
 * Comprehensive test suite for ProductCatalog component
 * Note: This component doesn't exist yet, but this demonstrates testing patterns
 */

import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { customRender, testDataFactories, createMockFetch, waitFor } from '../helpers/test-utils';

// Mock ProductCatalog component
const MockProductCatalog = ({ 
  products = [], 
  loading = false, 
  error = null, 
  onAddToCart,
  searchTerm = '',
  onSearch,
  selectedCategory = 'all',
  onCategoryChange 
}: any) => (
  <div data-testid="product-catalog">
    <div data-testid="catalog-header">
      <h1>Product Catalog</h1>
      <input 
        data-testid="search-input"
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <select 
        data-testid="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange?.(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
    </div>

    {loading && <div data-testid="loading-spinner">Loading...</div>}
    {error && <div data-testid="error-message">Error: {error}</div>}

    <div data-testid="products-grid" className="products-grid">
      {products.map((product: any) => (
        <div key={product.id} data-testid={`product-${product.id}`} className="product-card">
          <img src={product.image} alt={product.name} data-testid="product-image" />
          <h3 data-testid="product-name">{product.name}</h3>
          <p data-testid="product-description">{product.description}</p>
          <span data-testid="product-price">${product.price}</span>
          <span data-testid="product-category">{product.category}</span>
          <button 
            data-testid="add-to-cart-button"
            onClick={() => onAddToCart?.(product)}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      ))}
    </div>

    {products.length === 0 && !loading && !error && (
      <div data-testid="no-products">No products found</div>
    )}
  </div>
);

describe('ProductCatalog Component', () => {
  const mockProducts = [
    testDataFactories.product({ id: 1, name: 'Laptop', category: 'electronics', price: 999.99 }),
    testDataFactories.product({ id: 2, name: 'T-Shirt', category: 'clothing', price: 29.99 }),
    testDataFactories.product({ id: 3, name: 'Phone', category: 'electronics', price: 699.99 }),
  ];

  beforeEach(() => {
    mock.restore();
  });

  test('renders catalog header correctly', () => {
    const { getByTestId, getByRole } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    expect(getByRole('heading', { level: 1 })).toBeDefined();
    expect(getByTestId('search-input')).toBeDefined();
    expect(getByTestId('category-filter')).toBeDefined();
  });

  test('displays products in grid layout', () => {
    const { getByTestId, getAllByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    expect(getByTestId('products-grid')).toBeDefined();
    expect(getAllByTestId(/^product-\d+$/).length).toBe(3);
  });

  test('renders product information correctly', () => {
    const { getByTestId, getAllByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    const productNames = getAllByTestId('product-name');
    const productPrices = getAllByTestId('product-price');
    
    expect(productNames[0].textContent).toBe('Laptop');
    expect(productPrices[0].textContent).toBe('$999.99');
  });

  test('handles search functionality', () => {
    const mockOnSearch = mock(() => {});
    const { getByTestId } = customRender(
      <MockProductCatalog 
        products={mockProducts} 
        onSearch={mockOnSearch}
        searchTerm=""
      />
    );

    const searchInput = getByTestId('search-input') as HTMLInputElement;
    searchInput.value = 'laptop';
    searchInput.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnSearch).toHaveBeenCalledWith('laptop');
  });

  test('handles category filtering', () => {
    const mockOnCategoryChange = mock(() => {});
    const { getByTestId } = customRender(
      <MockProductCatalog 
        products={mockProducts} 
        onCategoryChange={mockOnCategoryChange}
        selectedCategory="all"
      />
    );

    const categoryFilter = getByTestId('category-filter') as HTMLSelectElement;
    categoryFilter.value = 'electronics';
    categoryFilter.dispatchEvent(new Event('change', { bubbles: true }));

    expect(mockOnCategoryChange).toHaveBeenCalledWith('electronics');
  });

  test('shows loading state', () => {
    const { getByTestId, queryByTestId } = customRender(
      <MockProductCatalog products={[]} loading={true} />
    );

    expect(getByTestId('loading-spinner')).toBeDefined();
    expect(queryByTestId('products-grid')).toBeDefined();
  });

  test('shows error state', () => {
    const errorMessage = 'Failed to load products';
    const { getByTestId } = customRender(
      <MockProductCatalog products={[]} error={errorMessage} />
    );

    expect(getByTestId('error-message').textContent).toBe(`Error: ${errorMessage}`);
  });

  test('shows no products message when empty', () => {
    const { getByTestId } = customRender(
      <MockProductCatalog products={[]} loading={false} error={null} />
    );

    expect(getByTestId('no-products')).toBeDefined();
  });

  test('handles add to cart action', () => {
    const mockOnAddToCart = mock(() => {});
    const { getAllByTestId } = customRender(
      <MockProductCatalog 
        products={mockProducts} 
        onAddToCart={mockOnAddToCart}
      />
    );

    const addToCartButtons = getAllByTestId('add-to-cart-button');
    addToCartButtons[0].click();

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[0]);
  });

  test('disables add to cart for out of stock items', () => {
    const outOfStockProduct = testDataFactories.product({ 
      id: 1, 
      name: 'Out of Stock Item', 
      inStock: false 
    });

    const { getByTestId } = customRender(
      <MockProductCatalog products={[outOfStockProduct]} />
    );

    const addToCartButton = getByTestId('add-to-cart-button') as HTMLButtonElement;
    expect(addToCartButton.disabled).toBe(true);
    expect(addToCartButton.textContent).toBe('Out of Stock');
  });

  test('displays correct category options', () => {
    const { getByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    const categoryFilter = getByTestId('category-filter') as HTMLSelectElement;
    const options = Array.from(categoryFilter.options).map(option => option.value);
    
    expect(options).toContain('all');
    expect(options).toContain('electronics');
    expect(options).toContain('clothing');
  });

  test('maintains search term in input', () => {
    const searchTerm = 'laptop';
    const { getByTestId } = customRender(
      <MockProductCatalog products={mockProducts} searchTerm={searchTerm} />
    );

    const searchInput = getByTestId('search-input') as HTMLInputElement;
    expect(searchInput.value).toBe(searchTerm);
  });

  test('maintains selected category in filter', () => {
    const selectedCategory = 'electronics';
    const { getByTestId } = customRender(
      <MockProductCatalog products={mockProducts} selectedCategory={selectedCategory} />
    );

    const categoryFilter = getByTestId('category-filter') as HTMLSelectElement;
    expect(categoryFilter.value).toBe(selectedCategory);
  });

  test('accessibility: search input has proper placeholder', () => {
    const { getByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    const searchInput = getByTestId('search-input') as HTMLInputElement;
    expect(searchInput.placeholder).toBe('Search products...');
  });

  test('accessibility: images have alt text', () => {
    const { getAllByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    const productImages = getAllByTestId('product-image') as HTMLImageElement[];
    productImages.forEach((img, index) => {
      expect(img.alt).toBe(mockProducts[index].name);
    });
  });

  test('performance: handles large product lists', () => {
    const manyProducts = Array.from({ length: 100 }, (_, i) => 
      testDataFactories.product({ id: i, name: `Product ${i}` })
    );

    const startTime = performance.now();
    customRender(<MockProductCatalog products={manyProducts} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(200);
  });

  test('responsive design: has proper grid classes', () => {
    const { getByTestId } = customRender(
      <MockProductCatalog products={mockProducts} />
    );

    const productsGrid = getByTestId('products-grid');
    expect(productsGrid.className).toContain('products-grid');
  });
});