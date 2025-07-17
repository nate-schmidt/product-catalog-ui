import { test, expect, describe, beforeEach } from 'bun:test';
import { render, screen, cleanup, userEvent } from '../test-utils/render';
import { mockProducts } from '../test-utils/mocks';

// Example ProductCard component for reference
// This shows what the component might look like
const ProductCard = ({ 
  product, 
  onAddToCart,
  onViewDetails 
}: { 
  product: typeof mockProducts[0],
  onAddToCart?: (productId: number) => void,
  onViewDetails?: (productId: number) => void
}) => {
  return (
    <article className="product-card bg-white rounded-lg shadow-md p-4">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onAddToCart?.(product.id)}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={() => onViewDetails?.(product.id)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Details
        </button>
      </div>
    </article>
  );
};

describe('ProductCard Component', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    test('renders product information correctly', () => {
      render(<ProductCard product={mockProducts[0]} />);
      
      // Check product name
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
      
      // Check product description
      expect(screen.getByText(mockProducts[0].description)).toBeInTheDocument();
      
      // Check price
      expect(screen.getByText(`$${mockProducts[0].price}`)).toBeInTheDocument();
      
      // Check stock
      expect(screen.getByText(`Stock: ${mockProducts[0].stock}`)).toBeInTheDocument();
    });

    test('renders product image with correct attributes', () => {
      render(<ProductCard product={mockProducts[0]} />);
      
      const image = screen.getByAltText(mockProducts[0].name);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockProducts[0].image);
    });

    test('renders buttons correctly', () => {
      render(<ProductCard product={mockProducts[0]} />);
      
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    test('shows out of stock message when stock is 0', () => {
      const outOfStockProduct = { ...mockProducts[0], stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);
      
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
      expect(screen.queryByText('Add to Cart')).not.toBeInTheDocument();
    });

    test('disables add to cart button when out of stock', () => {
      const outOfStockProduct = { ...mockProducts[0], stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);
      
      const button = screen.getByText('Out of Stock');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    test('calls onAddToCart when add to cart button is clicked', async () => {
      const mockAddToCart = { fn: (id: number) => {} };
      const spy = spyOn(mockAddToCart, 'fn');
      
      const user = userEvent.setup();
      render(<ProductCard product={mockProducts[0]} onAddToCart={mockAddToCart.fn} />);
      
      const addButton = screen.getByText('Add to Cart');
      await user.click(addButton);
      
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(mockProducts[0].id);
    });

    test('calls onViewDetails when details button is clicked', async () => {
      const mockViewDetails = { fn: (id: number) => {} };
      const spy = spyOn(mockViewDetails, 'fn');
      
      const user = userEvent.setup();
      render(<ProductCard product={mockProducts[0]} onViewDetails={mockViewDetails.fn} />);
      
      const detailsButton = screen.getByText('Details');
      await user.click(detailsButton);
      
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(mockProducts[0].id);
    });

    test('does not call onAddToCart when button is disabled', async () => {
      const mockAddToCart = { fn: (id: number) => {} };
      const spy = spyOn(mockAddToCart, 'fn');
      
      const outOfStockProduct = { ...mockProducts[0], stock: 0 };
      const user = userEvent.setup();
      render(<ProductCard product={outOfStockProduct} onAddToCart={mockAddToCart.fn} />);
      
      const button = screen.getByText('Out of Stock');
      await user.click(button);
      
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    test('applies correct CSS classes', () => {
      const { container } = render(<ProductCard product={mockProducts[0]} />);
      
      const card = container.querySelector('.product-card');
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-4');
      
      const image = screen.getByAltText(mockProducts[0].name);
      expect(image).toHaveClass('w-full', 'h-48', 'object-cover', 'rounded');
      
      const addButton = screen.getByText('Add to Cart');
      expect(addButton).toHaveClass('bg-blue-500', 'text-white');
    });
  });

  describe('Accessibility', () => {
    test('uses semantic HTML elements', () => {
      const { container } = render(<ProductCard product={mockProducts[0]} />);
      
      // Should use article for product card
      expect(container.querySelector('article')).toBeInTheDocument();
      
      // Should use heading for product name
      expect(container.querySelector('h3')).toBeInTheDocument();
    });

    test('provides alt text for images', () => {
      render(<ProductCard product={mockProducts[0]} />);
      
      const image = screen.getByAltText(mockProducts[0].name);
      expect(image).toBeInTheDocument();
    });

    test('buttons are keyboard accessible', async () => {
      const mockAddToCart = { fn: (id: number) => {} };
      const spy = spyOn(mockAddToCart, 'fn');
      
      const user = userEvent.setup();
      render(<ProductCard product={mockProducts[0]} onAddToCart={mockAddToCart.fn} />);
      
      // Tab to first button
      await user.tab();
      expect(screen.getByText('Add to Cart')).toHaveFocus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      expect(spy).toHaveBeenCalledWith(mockProducts[0].id);
    });
  });
});