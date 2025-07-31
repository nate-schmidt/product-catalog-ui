import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { QuantitySelector } from '../../components/QuantitySelector';
import { 
  renderWithProviders, 
  createMockFunctions, 
  cleanupAfterEach,
  screen,
  fireEvent
} from '../utils/test-helpers';

describe('QuantitySelector', () => {
  const mockFunctions = createMockFunctions();
  
  beforeEach(() => {
    cleanupAfterEach();
    mockFunctions.onQuantityChange.mockClear();
  });

  test('renders with default props', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const selector = screen.getByTestId('quantity-selector');
    const input = screen.getByTestId('quantity-input') as HTMLInputElement;
    const decrementBtn = screen.getByTestId('decrement-button');
    const incrementBtn = screen.getByTestId('increment-button');

    expect(selector).toBeDefined();
    expect(input.value).toBe('5');
    expect(decrementBtn).toBeDefined();
    expect(incrementBtn).toBeDefined();
  });

  test('increment button increases quantity', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const incrementBtn = screen.getByTestId('increment-button');
    fireEvent.click(incrementBtn);

    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(6);
  });

  test('decrement button decreases quantity', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const decrementBtn = screen.getByTestId('decrement-button');
    fireEvent.click(decrementBtn);

    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(4);
  });

  test('input change updates quantity', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    fireEvent.change(input, { target: { value: '10' } });

    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(10);
  });

  test('respects minimum quantity constraint', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={1} 
        min={1}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const decrementBtn = screen.getByTestId('decrement-button');
    expect(decrementBtn.disabled).toBe(true);
    expect(decrementBtn.className).toContain('cursor-not-allowed');

    fireEvent.click(decrementBtn);
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalled();
  });

  test('respects maximum quantity constraint', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={99} 
        max={99}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const incrementBtn = screen.getByTestId('increment-button');
    expect(incrementBtn.disabled).toBe(true);
    expect(incrementBtn.className).toContain('cursor-not-allowed');

    fireEvent.click(incrementBtn);
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalled();
  });

  test('custom min and max values work correctly', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        min={3}
        max={10}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input') as HTMLInputElement;
    expect(input.min).toBe('3');
    expect(input.max).toBe('10');

    // Test input below min
    fireEvent.change(input, { target: { value: '2' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(2);

    // Test input above max
    fireEvent.change(input, { target: { value: '15' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(15);

    // Test valid input
    fireEvent.change(input, { target: { value: '7' } });
    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(7);
  });

  test('handles disabled state correctly', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        disabled={true}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input') as HTMLInputElement;
    const decrementBtn = screen.getByTestId('decrement-button');
    const incrementBtn = screen.getByTestId('increment-button');

    expect(input.disabled).toBe(true);
    expect(decrementBtn.disabled).toBe(true);
    expect(incrementBtn.disabled).toBe(true);

    expect(input.className).toContain('cursor-not-allowed');
    expect(decrementBtn.className).toContain('cursor-not-allowed');
    expect(incrementBtn.className).toContain('cursor-not-allowed');

    // Verify no interactions work when disabled
    fireEvent.click(incrementBtn);
    fireEvent.click(decrementBtn);
    fireEvent.change(input, { target: { value: '10' } });

    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalled();
  });

  test('different sizes render correctly', () => {
    const { rerender } = renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        size="sm"
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    let input = screen.getByTestId('quantity-input');
    let buttons = screen.getAllByRole('button');
    
    expect(input.className).toContain('w-12 h-6 text-sm');
    expect(buttons[0].className).toContain('w-6 h-6 text-sm');

    rerender(
      <QuantitySelector 
        quantity={5} 
        size="lg"
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    input = screen.getByTestId('quantity-input');
    buttons = screen.getAllByRole('button');
    
    expect(input.className).toContain('w-20 h-10 text-lg');
    expect(buttons[0].className).toContain('w-10 h-10 text-lg');
  });

  test('handles empty input correctly', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        min={1}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    fireEvent.change(input, { target: { value: '' } });

    // Should fall back to minimum value when empty
    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(1);
  });

  test('rejects invalid input values', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    
    // Test non-numeric input
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(NaN);

    // Test decimal input
    fireEvent.change(input, { target: { value: '5.5' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(5.5);

    // Test negative input
    fireEvent.change(input, { target: { value: '-1' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(-1);
  });

  test('applies custom className correctly', () => {
    const customClass = 'custom-quantity-selector';
    
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        className={customClass}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const selector = screen.getByTestId('quantity-selector');
    expect(selector.className).toContain(customClass);
  });

  test('has proper accessibility attributes', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const decrementBtn = screen.getByTestId('decrement-button');
    const incrementBtn = screen.getByTestId('increment-button');
    const input = screen.getByTestId('quantity-input');

    expect(decrementBtn.getAttribute('aria-label')).toBe('Decrease quantity');
    expect(incrementBtn.getAttribute('aria-label')).toBe('Increase quantity');
    expect(input.getAttribute('aria-label')).toBe('Quantity: 5');
  });

  test('prevents arrow keys from affecting input number', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    
    // Check that appearance is set to textfield to hide spinners
    expect(input.className).toContain('[appearance:textfield]');
    expect(input.className).toContain('[&::-webkit-outer-spin-button]:appearance-none');
    expect(input.className).toContain('[&::-webkit-inner-spin-button]:appearance-none');
  });

  test('button focus styles are applied', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const decrementBtn = screen.getByTestId('decrement-button');
    const incrementBtn = screen.getByTestId('increment-button');

    expect(decrementBtn.className).toContain('focus:outline-none');
    expect(decrementBtn.className).toContain('focus:ring-2');
    expect(decrementBtn.className).toContain('focus:ring-blue-500');

    expect(incrementBtn.className).toContain('focus:outline-none');
    expect(incrementBtn.className).toContain('focus:ring-2');
    expect(incrementBtn.className).toContain('focus:ring-blue-500');
  });

  test('input focus styles are applied', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    expect(input.className).toContain('focus:outline-none');
    expect(input.className).toContain('focus:ring-2');
    expect(input.className).toContain('focus:ring-blue-500');
  });

  test('validates quantity using validation utility', () => {
    renderWithProviders(
      <QuantitySelector 
        quantity={5} 
        max={100}
        onQuantityChange={mockFunctions.onQuantityChange} 
      />
    );

    const input = screen.getByTestId('quantity-input');
    
    // Test boundary value (should be valid)
    fireEvent.change(input, { target: { value: '99' } });
    expect(mockFunctions.onQuantityChange).toHaveBeenCalledWith(99);

    // Test value above validation limit (should be rejected by validateQuantity)
    fireEvent.change(input, { target: { value: '100' } });
    expect(mockFunctions.onQuantityChange).not.toHaveBeenCalledWith(100);
  });
});