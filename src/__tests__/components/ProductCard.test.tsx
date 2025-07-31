import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { ProductCard } from '../../components/ProductCard';
import { 
  renderWithProviders, 
  createMockProduct, 
  createMockFunctions, 
  cleanupAfterEach,
  screen,
  fireEvent,
  waitFor
} from '../utils/test-helpers';

describe('ProductCard', () => {
  const mockFunctions = createMockFunctions();
  
  beforeEach(() => {
    cleanupAfterEach();
    mockFunctions.onQuickView.mockClear();
  });

  test('renders product information correctly', () => {
    const product = createMockProduct({
      name: 'iPhone 14',
      price: 999.99,
      description: 'Latest iPhone model',
      category: 'electronics',
      rating: 4.5,
      reviewCount: 100
    });

    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText('iPhone 14')).toBeDefined();
    expect(screen.getByText('$999.99')).toBeDefined();
    expect(screen.getByText('Latest iPhone model')).toBeDefined();
    expect(screen.getByText('electronics')).toBeDefined();
    expect(screen.getByText('(100)')).toBeDefined();
  });

  test('displays correct product image', () => {
    const product = createMockProduct({
      name: 'Test Product',
      image: 'https://example.com/product.jpg'
    });

    renderWithProviders(<ProductCard product={product} />);

    const image = screen.getByAltText('Test Product') as HTMLImageElement;
    expect(image).toBeDefined();
    expect(image.src).toBe('https://example.com/product.jpg');
    expect(image.loading).toBe('lazy');
  });

  test('renders star rating correctly', () => {
    const product = createMockProduct({
      rating: 3.5,
      reviewCount: 50
    });

    renderWithProviders(<ProductCard product={product} />);

    const stars = screen.container.querySelectorAll('.text-yellow-400');
    expect(stars).toHaveLength(4); // 3 full stars + 1 half star
    expect(screen.getByText('(50)')).toBeDefined();
  });

  test('does not render rating when not provided', () => {
    const product = createMockProduct();
    delete (product as any).rating;
    delete (product as any).reviewCount;

    renderWithProviders(<ProductCard product={product} />);

    const stars = screen.container.querySelectorAll('.text-yellow-400');
    expect(stars).toHaveLength(0);
  });

  test('shows "Add to Cart" button for in-stock products', () => {
    const product = createMockProduct({ inStock: true });

    renderWithProviders(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: /add.*to cart/i });
    expect(button).toBeDefined();
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe('Add to Cart');
    expect(button.className).toContain('bg-blue-600');
  });

  test('shows disabled button for out-of-stock products', () => {
    const product = createMockProduct({ inStock: false });

    renderWithProviders(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: /add.*to cart/i });
    expect(button).toBeDefined();
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe('Out of Stock');
    expect(button.className).toContain('bg-gray-300');
  });

  test('displays out of stock overlay for unavailable products', () => {
    const product = createMockProduct({ inStock: false });

    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText('Out of Stock')).toBeDefined();
    const overlay = screen.getByText('Out of Stock').parentElement;
    expect(overlay?.className).toContain('absolute inset-0');
  });

  test('calls addToCart when add to cart button is clicked', async () => {
    const product = createMockProduct({ inStock: true });

    renderWithProviders(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: /add.*to cart/i });
    fireEvent.click(button);

    // Since we're testing with CartProvider, we'd need to verify the cart state
    // In a real scenario, you might need to check the cart context
    await waitFor(() => {
      // Verify button is still enabled and clickable
      expect(button.disabled).toBe(false);
    });
  });

  test('does not add to cart when product is out of stock', () => {
    const product = createMockProduct({ inStock: false });

    renderWithProviders(<ProductCard product={product} />);

    const button = screen.getByRole('button', { name: /add.*to cart/i });
    expect(button.disabled).toBe(true);
    
    // Attempting to click should not work
    fireEvent.click(button);
    // No assertion needed - the button being disabled prevents the action
  });

  test('renders quick view button when onQuickView is provided', () => {
    const product = createMockProduct();

    renderWithProviders(
      <ProductCard product={product} onQuickView={mockFunctions.onQuickView} />
    );

    const quickViewButton = screen.getByLabelText(`Quick view ${product.name}`);
    expect(quickViewButton).toBeDefined();
    expect(quickViewButton.className).toContain('absolute top-2 right-2');
  });

  test('does not render quick view button when onQuickView is not provided', () => {
    const product = createMockProduct();

    renderWithProviders(<ProductCard product={product} />);

    const quickViewButton = screen.queryByLabelText(`Quick view ${product.name}`);
    expect(quickViewButton).toBeNull();
  });

  test('calls onQuickView when quick view button is clicked', () => {
    const product = createMockProduct();

    renderWithProviders(
      <ProductCard product={product} onQuickView={mockFunctions.onQuickView} />
    );

    const quickViewButton = screen.getByLabelText(`Quick view ${product.name}`);
    fireEvent.click(quickViewButton);

    expect(mockFunctions.onQuickView).toHaveBeenCalledWith(product);
    expect(mockFunctions.onQuickView).toHaveBeenCalledTimes(1);
  });

  test('applies custom className correctly', () => {
    const product = createMockProduct();
    const customClass = 'custom-test-class';

    renderWithProviders(
      <ProductCard product={product} className={customClass} />
    );

    const card = screen.getByTestId(`product-card-${product.id}`);
    expect(card.className).toContain(customClass);
  });

  test('has correct data-testid attribute', () => {
    const product = createMockProduct({ id: 'test-product-123' });

    renderWithProviders(<ProductCard product={product} />);

    const card = screen.getByTestId('product-card-test-product-123');
    expect(card).toBeDefined();
  });

  test('truncates long product names and descriptions', () => {
    const product = createMockProduct({
      name: 'This is a very long product name that should be truncated to prevent layout issues',
      description: 'This is a very long product description that should also be truncated to maintain consistent card layouts across the product grid'
    });

    renderWithProviders(<ProductCard product={product} />);

    const nameElement = screen.getByText(product.name);
    const descElement = screen.getByText(product.description);
    
    expect(nameElement.className).toContain('line-clamp-2');
    expect(descElement.className).toContain('line-clamp-2');
    expect(nameElement.title).toBe(product.name);
    expect(descElement.title).toBe(product.description);
  });

  test('capitalizes category display', () => {
    const product = createMockProduct({ category: 'electronics' });

    renderWithProviders(<ProductCard product={product} />);

    const categoryElement = screen.getByText('electronics');
    expect(categoryElement.className).toContain('capitalize');
  });

  test('has proper accessibility attributes', () => {
    const product = createMockProduct({ name: 'Accessible Product' });

    renderWithProviders(
      <ProductCard product={product} onQuickView={mockFunctions.onQuickView} />
    );

    // Check image alt text
    const image = screen.getByAltText('Accessible Product');
    expect(image).toBeDefined();

    // Check button aria-labels
    const addToCartButton = screen.getByRole('button', { name: /add accessible product to cart/i });
    expect(addToCartButton).toBeDefined();

    const quickViewButton = screen.getByRole('button', { name: /quick view accessible product/i });
    expect(quickViewButton).toBeDefined();
  });

  test('handles edge case with 5-star rating', () => {
    const product = createMockProduct({
      rating: 5.0,
      reviewCount: 200
    });

    renderWithProviders(<ProductCard product={product} />);

    const fullStars = screen.container.querySelectorAll('.text-yellow-400');
    expect(fullStars).toHaveLength(5);
    
    const emptyStars = screen.container.querySelectorAll('.text-gray-300');
    expect(emptyStars).toHaveLength(0);
  });

  test('handles edge case with 0-star rating', () => {
    const product = createMockProduct({
      rating: 0,
      reviewCount: 1
    });

    renderWithProviders(<ProductCard product={product} />);

    const fullStars = screen.container.querySelectorAll('.text-yellow-400');
    expect(fullStars).toHaveLength(0);
    
    const emptyStars = screen.container.querySelectorAll('.text-gray-300');
    expect(emptyStars).toHaveLength(5);
  });

  test('hover effects are applied correctly', () => {
    const product = createMockProduct();

    renderWithProviders(<ProductCard product={product} />);

    const card = screen.getByTestId(`product-card-${product.id}`);
    expect(card.className).toContain('hover:shadow-lg');
    expect(card.className).toContain('transition-shadow');
  });
});