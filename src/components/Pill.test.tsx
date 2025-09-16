import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Pill from './Pill';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('Pill', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders with correct label', () => {
    const { getByText } = render(
      <Pill label="Test Label" isSelected={false} onClick={() => {}} />
    );
    expect(getByText('Test Label')).toBeDefined();
  });

  test('applies selected styles when isSelected is true', () => {
    const { getByRole } = render(
      <Pill label="Selected" isSelected={true} onClick={() => {}} />
    );
    const button = getByRole('button');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  test('applies unselected styles when isSelected is false', () => {
    const { getByRole } = render(
      <Pill label="Unselected" isSelected={false} onClick={() => {}} />
    );
    const button = getByRole('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  test('calls onClick when clicked', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const { getByRole } = render(
      <Pill label="Clickable" isSelected={false} onClick={handleClick} />
    );
    
    fireEvent.click(getByRole('button'));
    expect(clicked).toBe(true);
  });

  test('calls onClick when Enter key is pressed', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const { getByRole } = render(
      <Pill label="Keyboard" isSelected={false} onClick={handleClick} />
    );
    
    fireEvent.keyDown(getByRole('button'), { key: 'Enter' });
    expect(clicked).toBe(true);
  });

  test('calls onClick when Space key is pressed', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const { getByRole } = render(
      <Pill label="Keyboard" isSelected={false} onClick={handleClick} />
    );
    
    fireEvent.keyDown(getByRole('button'), { key: ' ' });
    expect(clicked).toBe(true);
  });

  test('does not call onClick for other keys', () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };
    
    const { getByRole } = render(
      <Pill label="Keyboard" isSelected={false} onClick={handleClick} />
    );
    
    fireEvent.keyDown(getByRole('button'), { key: 'Tab' });
    expect(clicked).toBe(false);
  });

  test('applies primary variant styles by default', () => {
    const { getByRole } = render(
      <Pill label="Primary" isSelected={false} onClick={() => {}} />
    );
    const button = getByRole('button');
    expect(button.style.borderColor).toBe('#007bff');
  });

  test('applies secondary variant styles when specified', () => {
    const { getByRole } = render(
      <Pill label="Secondary" isSelected={false} onClick={() => {}} variant="secondary" />
    );
    const button = getByRole('button');
    expect(button.style.borderColor).toBe('#6c757d');
  });

  test('applies medium size styles by default', () => {
    const { getByRole } = render(
      <Pill label="Medium" isSelected={false} onClick={() => {}} />
    );
    const button = getByRole('button');
    expect(button.style.padding).toBe('0.5rem 1rem');
    expect(button.style.fontSize).toBe('0.9rem');
  });

  test('applies small size styles when specified', () => {
    const { getByRole } = render(
      <Pill label="Small" isSelected={false} onClick={() => {}} size="small" />
    );
    const button = getByRole('button');
    expect(button.style.padding).toBe('0.375rem 0.75rem');
    expect(button.style.fontSize).toBe('0.8rem');
  });

  test('has proper accessibility attributes', () => {
    const { getByRole } = render(
      <Pill label="Accessible" isSelected={true} onClick={() => {}} />
    );
    const button = getByRole('button');
    expect(button.getAttribute('role')).toBe('button');
    expect(button.getAttribute('tabIndex')).toBe('0');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});