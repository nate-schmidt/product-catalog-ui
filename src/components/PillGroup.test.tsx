import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import PillGroup from './PillGroup';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('PillGroup', () => {
  const mockOptions = ['Option 1', 'Option 2', 'Option 3'];
  
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders with correct label', () => {
    const { getByText } = render(
      <PillGroup
        label="Test Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
      />
    );
    expect(getByText('Test Categories')).toBeDefined();
  });

  test('renders all options as pills', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
      />
    );
    
    mockOptions.forEach(option => {
      expect(getByText(option)).toBeDefined();
    });
  });

  test('renders "All" pill when allowDeselect is true (default)', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
      />
    );
    expect(getByText('All Categories')).toBeDefined();
  });

  test('does not render "All" pill when allowDeselect is false', () => {
    const { queryByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
        allowDeselect={false}
      />
    );
    expect(queryByText('All Categories')).toBeNull();
  });

  test('shows correct pill as selected', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue="Option 2"
        onSelectionChange={() => {}}
      />
    );
    
    const selectedPill = getByText('Option 2').closest('button');
    expect(selectedPill?.getAttribute('aria-pressed')).toBe('true');
  });

  test('shows "All" pill as selected when no value is selected', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
      />
    );
    
    const allPill = getByText('All Categories').closest('button');
    expect(allPill?.getAttribute('aria-pressed')).toBe('true');
  });

  test('calls onSelectionChange when option is selected', () => {
    let selectedValue: string | undefined;
    const handleChange = (value: string | undefined) => { selectedValue = value; };
    
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={handleChange}
      />
    );
    
    fireEvent.click(getByText('Option 2'));
    expect(selectedValue).toBe('Option 2');
  });

  test('calls onSelectionChange with undefined when "All" is clicked', () => {
    let selectedValue: string | undefined = 'Option 1';
    const handleChange = (value: string | undefined) => { selectedValue = value; };
    
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue="Option 1"
        onSelectionChange={handleChange}
      />
    );
    
    fireEvent.click(getByText('All Categories'));
    expect(selectedValue).toBe(undefined);
  });

  test('deselects option when clicked again and allowDeselect is true', () => {
    let selectedValue: string | undefined = 'Option 1';
    const handleChange = (value: string | undefined) => { selectedValue = value; };
    
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue="Option 1"
        onSelectionChange={handleChange}
      />
    );
    
    fireEvent.click(getByText('Option 1'));
    expect(selectedValue).toBe(undefined);
  });

  test('does not deselect option when clicked again and allowDeselect is false', () => {
    let selectedValue: string | undefined = 'Option 1';
    const handleChange = (value: string | undefined) => { selectedValue = value; };
    
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue="Option 1"
        onSelectionChange={handleChange}
        allowDeselect={false}
      />
    );
    
    fireEvent.click(getByText('Option 1'));
    expect(selectedValue).toBe('Option 1'); // Should remain selected
  });

  test('passes variant prop to pills', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
        variant="secondary"
      />
    );
    
    const pill = getByText('Option 1').closest('button');
    expect(pill?.style.borderColor).toBe('#6c757d');
  });

  test('passes size prop to pills', () => {
    const { getByText } = render(
      <PillGroup
        label="Categories"
        options={mockOptions}
        selectedValue={undefined}
        onSelectionChange={() => {}}
        size="small"
      />
    );
    
    const pill = getByText('Option 1').closest('button');
    expect(pill?.style.fontSize).toBe('0.8rem');
  });

  test('handles empty options array', () => {
    const { getByText } = render(
      <PillGroup
        label="Empty"
        options={[]}
        selectedValue={undefined}
        onSelectionChange={() => {}}
      />
    );
    
    expect(getByText('Empty')).toBeDefined();
    expect(getByText('All Empty')).toBeDefined();
  });
});