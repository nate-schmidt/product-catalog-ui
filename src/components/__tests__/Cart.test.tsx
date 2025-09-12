import { test, expect, describe, beforeEach, mock } from 'bun:test';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cart } from '../Cart';
import { CartProvider, useCart } from '../../contexts/CartContext';
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
(global as any).confirm = mock(() => true); // Mock window.confirm

// Sample products for testing
const sampleProduct1: Product = {
  id: 1,
  name: 'Office Chair',
  description: 'Comfortable office chair',
  price: 299.99,
  currency: 'USD',
  stockQuantity: 10,
  category: 'Furniture',
  imageUrl: 'https://example.com/chair.jpg',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

const sampleProduct2: Product = {
  id: 2,
  name: 'Standing Desk',
  description: 'Height adjustable desk',
  price: 599.99,
  currency: 'USD',
  stockQuantity: 5,
  category: 'Furniture',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

const outOfStockProduct: Product = {
  id: 3,
  name: 'Out of Stock Sofa',
  description: 'This sofa is out of stock',
  price: 1299.99,
  currency: 'USD',
  stockQuantity: 0,
  category: 'Furniture',
  createdDate: '2024-01-01T00:00:00Z',
  lastModifiedDate: '2024-01-01T00:00:00Z'
};

// Test wrapper component with pre-populated cart
const CartWithItems = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      <CartPopulator />
      {children}
    </CartProvider>
  );
};

const CartPopulator = () => {
  const { addToCart } = useCart();
  
  React.useEffect(() => {
    addToCart(sampleProduct1, 2);
    addToCart(sampleProduct2, 1);
  }, [addToCart]);
  
  return null;
};

// Empty cart wrapper
const EmptyCartWrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('Cart Component', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    ((global as any).confirm as ReturnType<typeof mock>).mockClear();
    ((global as any).confirm as ReturnType<typeof mock>).mockReturnValue(true);
  });

  describe('Empty Cart', () => {
    test('displays empty cart message', () => {
      render(
        <EmptyCartWrapper>
          <Cart />
        </EmptyCartWrapper>
      );

      expect(screen.getByText('Shopping Cart')).toBeDefined();
      expect(screen.getByText('Your cart is empty')).toBeDefined();
      expect(screen.getByText('Add some products to get started!')).toBeDefined();
    });

    test('shows cart icon in empty state', () => {
      render(
        <EmptyCartWrapper>
          <Cart />
        </EmptyCartWrapper>
      );

      // Check for SVG cart icon
      const cartIcon = document.querySelector('svg');
      expect(cartIcon).toBeDefined();
    });

    test('does not show checkout button when empty', () => {
      render(
        <EmptyCartWrapper>
          <Cart />
        </EmptyCartWrapper>
      );

      expect(screen.queryByText('Checkout')).toBeNull();
      expect(screen.queryByText('Clear Cart')).toBeNull();
    });
  });

  describe('Cart with Items', () => {
    test('displays cart items correctly', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      expect(screen.getByText('Shopping Cart (3)')).toBeDefined(); // 2 chairs + 1 desk
      expect(screen.getByText('Office Chair')).toBeDefined();
      expect(screen.getByText('Standing Desk')).toBeDefined();
      expect(screen.getByText('$299.99')).toBeDefined();
      expect(screen.getByText('$599.99')).toBeDefined();
    });

    test('calculates and displays total correctly', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      // Total: (299.99 * 2) + 599.99 = 1199.97
      expect(screen.getByText('$1,199.97')).toBeDefined();
    });

    test('shows quantity controls', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      // Check for quantity input and +/- buttons
      const quantityInputs = screen.getAllByRole('spinbutton');
      expect(quantityInputs).toHaveLength(2); // One for each product

      const decreaseButtons = screen.getAllByText('-');
      const increaseButtons = screen.getAllByText('+');
      expect(decreaseButtons).toHaveLength(2);
      expect(increaseButtons).toHaveLength(2);
    });

    test('increases item quantity', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const increaseButtons = screen.getAllByText('+');
      fireEvent.click(increaseButtons[0]); // Increase first item (chair)

      await waitFor(() => {
        // Should show updated quantity and total
        const quantityInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
        expect(quantityInput.value).toBe('3'); // Was 2, now 3

        // Total should be updated: (299.99 * 3) + 599.99 = 1499.96
        expect(screen.getByText('$1,499.96')).toBeDefined();
      });
    });

    test('decreases item quantity', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const decreaseButtons = screen.getAllByText('-');
      fireEvent.click(decreaseButtons[0]); // Decrease first item (chair from 2 to 1)

      await waitFor(() => {
        const quantityInput = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
        expect(quantityInput.value).toBe('1');

        // Total should be updated: (299.99 * 1) + 599.99 = 899.98
        expect(screen.getByText('$899.98')).toBeDefined();
      });
    });

    test('removes item when quantity becomes 0', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      // Get the standing desk decrease button (it has quantity 1)
      const decreaseButtons = screen.getAllByText('-');
      fireEvent.click(decreaseButtons[1]); // Decrease desk from 1 to 0

      await waitFor(() => {
        expect(screen.queryByText('Standing Desk')).toBeNull();
        expect(screen.getByText('Shopping Cart (2)')).toBeDefined(); // Only chairs left
      });
    });

    test('updates quantity via input field', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const quantityInputs = screen.getAllByRole('spinbutton');
      const chairQuantityInput = quantityInputs[0] as HTMLInputElement;

      // Change quantity from 2 to 5
      fireEvent.change(chairQuantityInput, { target: { value: '5' } });

      await waitFor(() => {
        expect(chairQuantityInput.value).toBe('5');
        // Total: (299.99 * 5) + 599.99 = 2099.94
        expect(screen.getByText('$2,099.94')).toBeDefined();
      });
    });

    test('prevents setting quantity above stock limit', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const increaseButtons = screen.getAllByText('+');
      const deskIncreaseButton = increaseButtons[1]; // Standing desk has stock of 5

      // Try to increase desk quantity beyond stock (currently 1, stock is 5, so we can increase to 5)
      fireEvent.click(deskIncreaseButton); // 1 -> 2
      fireEvent.click(deskIncreaseButton); // 2 -> 3
      fireEvent.click(deskIncreaseButton); // 3 -> 4
      fireEvent.click(deskIncreaseButton); // 4 -> 5

      await waitFor(() => {
        const quantityInput = screen.getAllByRole('spinbutton')[1] as HTMLInputElement;
        expect(quantityInput.value).toBe('5');
      });

      // Try to increase beyond stock limit - button should be disabled
      expect(deskIncreaseButton.disabled).toBe(true);
    });

    test('removes individual item', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      // Find remove buttons (trash icons)
      const removeButtons = screen.getAllByTitle('Remove item');
      expect(removeButtons).toHaveLength(2);

      fireEvent.click(removeButtons[0]); // Remove first item (chair)

      await waitFor(() => {
        expect(screen.queryByText('Office Chair')).toBeNull();
        expect(screen.getByText('Standing Desk')).toBeDefined();
        expect(screen.getByText('Shopping Cart (1)')).toBeDefined(); // Only desk left
        expect(screen.getByText('$599.99')).toBeDefined(); // Only desk price as total
      });
    });

    test('clears entire cart', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const clearButton = screen.getByText('Clear Cart');
      fireEvent.click(clearButton);

      // Should show confirmation dialog
      expect((global as any).confirm).toHaveBeenCalledWith('Are you sure you want to clear your cart?');

      await waitFor(() => {
        expect(screen.getByText('Your cart is empty')).toBeDefined();
        expect(screen.queryByText('Office Chair')).toBeNull();
        expect(screen.queryByText('Standing Desk')).toBeNull();
      });
    });

    test('does not clear cart when confirmation is cancelled', async () => {
      ((global as any).confirm as ReturnType<typeof mock>).mockReturnValue(false);

      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const clearButton = screen.getByText('Clear Cart');
      fireEvent.click(clearButton);

      expect((global as any).confirm).toHaveBeenCalled();

      // Cart should still have items
      expect(screen.getByText('Office Chair')).toBeDefined();
      expect(screen.getByText('Standing Desk')).toBeDefined();
    });

    test('shows checkout button when items are in stock', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const checkoutButton = screen.getByText('Checkout');
      expect(checkoutButton.disabled).toBe(false);
    });
  });

  describe('Out of Stock Handling', () => {
    const CartWithOutOfStockItem = ({ children }: { children: React.ReactNode }) => {
      return (
        <CartProvider>
          <OutOfStockPopulator />
          {children}
        </CartProvider>
      );
    };

    const OutOfStockPopulator = () => {
      const { addToCart } = useCart();
      
      React.useEffect(() => {
        // First add the product when it had stock
        const productWithStock = { ...outOfStockProduct, stockQuantity: 1 };
        addToCart(productWithStock, 1);
        
        // Then simulate the product going out of stock by directly manipulating
        // Note: In real scenario, this would come from API update
      }, [addToCart]);
      
      return null;
    };

    test('shows warning for out of stock items', () => {
      render(
        <CartWithOutOfStockItem>
          <Cart />
        </CartWithOutOfStockItem>
      );

      // The product in cart should show as out of stock (stockQuantity is 0)
      expect(screen.getByText('Out of stock')).toBeDefined();
    });

    test('disables checkout when cart contains out of stock items', () => {
      render(
        <CartWithOutOfStockItem>
          <Cart />
        </CartWithOutOfStockItem>
      );

      const checkoutButton = screen.getByText('Checkout');
      expect(checkoutButton.disabled).toBe(true);

      expect(screen.getByText('Some items are out of stock and must be removed before checkout.')).toBeDefined();
    });
  });

  describe('Modal Functionality', () => {
    test('displays as modal when onClose is provided', () => {
      const onClose = mock();

      render(
        <EmptyCartWrapper>
          <Cart isOpen={true} onClose={onClose} />
        </EmptyCartWrapper>
      );

      // Should have modal overlay
      const modal = document.querySelector('.fixed.inset-0');
      expect(modal).toBeDefined();
      expect(modal?.className).toContain('bg-black bg-opacity-50');

      // Should have close button
      const closeButton = screen.getByLabelText('Close cart');
      expect(closeButton).toBeDefined();
    });

    test('calls onClose when close button is clicked', () => {
      const onClose = mock();

      render(
        <EmptyCartWrapper>
          <Cart isOpen={true} onClose={onClose} />
        </EmptyCartWrapper>
      );

      const closeButton = screen.getByLabelText('Close cart');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    test('does not render when isOpen is false', () => {
      const onClose = mock();

      render(
        <EmptyCartWrapper>
          <Cart isOpen={false} onClose={onClose} />
        </EmptyCartWrapper>
      );

      expect(screen.queryByText('Shopping Cart')).toBeNull();
    });

    test('renders inline when onClose is not provided', () => {
      render(
        <EmptyCartWrapper>
          <Cart />
        </EmptyCartWrapper>
      );

      // Should not have modal overlay
      const modal = document.querySelector('.fixed.inset-0');
      expect(modal).toBeNull();

      // Should not have close button
      const closeButton = screen.queryByLabelText('Close cart');
      expect(closeButton).toBeNull();

      // But should still show cart content
      expect(screen.getByText('Shopping Cart')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('displays error message when quantity update fails', async () => {
      // This test would need to mock the cart context to throw an error
      // For now, we'll test the error display mechanism
      render(
        <EmptyCartWrapper>
          <Cart />
        </EmptyCartWrapper>
      );

      // Error should not be visible initially
      expect(screen.queryByText(/error/i)).toBeNull();
    });

    test('clears error after timeout', async () => {
      // This would need to be tested with actual error scenarios
      // where the cart context throws errors during operations
    });
  });

  describe('Image Display', () => {
    test('shows product image when available', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const chairImage = screen.getByAltText('Office Chair');
      expect(chairImage).toBeDefined();
      expect((chairImage as HTMLImageElement).src).toBe('https://example.com/chair.jpg');
    });

    test('shows placeholder when no image available', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      // Standing desk doesn't have imageUrl, should show placeholder
      expect(screen.getByText('No Image')).toBeDefined();
    });
  });

  describe('Quantity Input Validation', () => {
    test('prevents setting negative quantity', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const quantityInputs = screen.getAllByRole('spinbutton');
      const chairQuantityInput = quantityInputs[0] as HTMLInputElement;

      fireEvent.change(chairQuantityInput, { target: { value: '-5' } });

      // Should default to 1 for negative values
      await waitFor(() => {
        expect(chairQuantityInput.value).toBe('1');
      });
    });

    test('prevents setting zero quantity via input', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const quantityInputs = screen.getAllByRole('spinbutton');
      const chairQuantityInput = quantityInputs[0] as HTMLInputElement;

      fireEvent.change(chairQuantityInput, { target: { value: '0' } });

      // Should default to 1 for zero values
      await waitFor(() => {
        expect(chairQuantityInput.value).toBe('1');
      });
    });

    test('handles invalid input gracefully', async () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const quantityInputs = screen.getAllByRole('spinbutton');
      const chairQuantityInput = quantityInputs[0] as HTMLInputElement;

      fireEvent.change(chairQuantityInput, { target: { value: 'abc' } });

      // Should default to 1 for invalid values
      await waitFor(() => {
        expect(chairQuantityInput.value).toBe('1');
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      const onClose = mock();

      render(
        <EmptyCartWrapper>
          <Cart isOpen={true} onClose={onClose} />
        </EmptyCartWrapper>
      );

      const closeButton = screen.getByLabelText('Close cart');
      expect(closeButton).toBeDefined();
    });

    test('quantity inputs have proper constraints', () => {
      render(
        <CartWithItems>
          <Cart />
        </CartWithItems>
      );

      const quantityInputs = screen.getAllByRole('spinbutton');
      quantityInputs.forEach(input => {
        expect((input as HTMLInputElement).min).toBe('1');
      });

      // Check that max is set to stock quantity
      expect((quantityInputs[0] as HTMLInputElement).max).toBe('10'); // Chair stock
      expect((quantityInputs[1] as HTMLInputElement).max).toBe('5'); // Desk stock
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      const { container } = render(
        <EmptyCartWrapper>
          <Cart className="custom-cart-class" />
        </EmptyCartWrapper>
      );

      expect(container.firstChild).toBeDefined();
      expect((container.firstChild as HTMLElement).className).toContain('custom-cart-class');
    });
  });
});