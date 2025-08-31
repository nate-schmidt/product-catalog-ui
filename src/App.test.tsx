import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
    // Clear any persisted coupon code between tests
    try {
      localStorage.clear();
    } catch {}
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the main heading', () => {
    const { getByRole } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toBe('Hello World! 👋');
  });

  test('displays the subtitle text', () => {
    const { getByText } = render(<App />);
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    expect(subtitle).toBeDefined();
  });

  test('has correct CSS classes for styling', () => {
    const { container } = render(<App />);
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
    expect(mainContainer?.className).toContain('p-8');
    expect(mainContainer?.className).toContain('text-center');
  });

  test('has correct text color classes', () => {
    const { getByRole, getByText } = render(<App />);
    const heading = getByRole('heading', { level: 1 });
    const subtitle = getByText('One day I hope to be an ecommerce website.');
    
    expect(heading.className).toContain('text-white');
    expect(subtitle.className).toContain('text-gray-300');
  });

  test('has proper layout structure', () => {
    const { getByRole } = render(<App />);
    const flexContainer = getByRole('heading', { level: 1 }).parentElement;
    expect(flexContainer).toBeDefined();
    expect(flexContainer?.className).toContain('flex');
    expect(flexContainer?.className).toContain('flex-col');
    expect(flexContainer?.className).toContain('items-center');
  });

  test('shows order summary with subtotal and total', () => {
    const { getByLabelText } = render(<App />);
    const subtotal = getByLabelText('subtotal-amount');
    const total = getByLabelText('total-amount');
    expect(subtotal.textContent).toBeDefined();
    expect(total.textContent).toBeDefined();
  });

  test('applies valid percent coupon and updates totals', () => {
    const { getByLabelText, getByText, queryByLabelText } = render(<App />);
    const input = getByLabelText('Coupon code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(getByText('Apply'));

    expect(queryByLabelText('discount-amount')).toBeTruthy();
    const subtotalText = (getByLabelText('subtotal-amount') as HTMLElement).textContent!;
    const totalText = (getByLabelText('total-amount') as HTMLElement).textContent!;
    expect(subtotalText.startsWith('$')).toBe(true);
    expect(totalText.startsWith('$')).toBe(true);
    // Total should be less than subtotal after discount
    const subtotal = Number(subtotalText.replace('$', ''));
    const total = Number(totalText.replace('$', ''));
    expect(total).toBeLessThan(subtotal);
  });

  test('rejects invalid coupon with error', () => {
    const { getByLabelText, getByText, getByRole } = render(<App />);
    const input = getByLabelText('Coupon code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'NOTREAL' } });
    fireEvent.click(getByText('Apply'));
    const alert = getByRole('alert');
    expect(alert.textContent).toContain('Invalid coupon code');
  });

  test('removes applied coupon and restores total', () => {
    const { getByLabelText, getByText, queryByLabelText } = render(<App />);
    const subtotalText = (getByLabelText('subtotal-amount') as HTMLElement).textContent!;
    const baselineTotal = Number(subtotalText.replace('$', ''));

    const input = getByLabelText('Coupon code') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(getByText('Apply'));

    // Coupon applied
    expect(queryByLabelText('discount-amount')).toBeTruthy();
    const discountedTotal = Number((getByLabelText('total-amount') as HTMLElement).textContent!.replace('$', ''));
    expect(discountedTotal).toBeLessThan(baselineTotal);

    // Remove coupon
    fireEvent.click(getByText('Remove'));
    expect(queryByLabelText('discount-amount')).toBeFalsy();
    const restoredTotal = Number((getByLabelText('total-amount') as HTMLElement).textContent!.replace('$', ''));
    expect(restoredTotal).toBeCloseTo(baselineTotal, 2);
  });
}); 