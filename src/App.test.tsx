import { test, expect, describe, beforeEach } from 'bun:test';
import { render, cleanup, screen } from '@testing-library/react';
import { App } from './App';
import { Window } from 'happy-dom';

// Setup DOM environment for tests
const window = new Window();
const document = window.document;

(global as any).window = window;
(global as any).document = document;
(global as any).navigator = window.navigator;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Element = window.Element;

describe('App', () => {
  beforeEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  test('renders without crashing', () => {
    render(<App />);
  });

  test('displays the main heading', async () => {
    render(<App />);
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading).toBeDefined();
    expect(heading.textContent).toContain('FlashMart');
  });

  test('displays the subtitle text', async () => {
    render(<App />);
    const subtitle = await screen.findByText('Premium Flash Sales');
    expect(subtitle).toBeDefined();
  });

  test('has correct CSS classes for styling', async () => {
    const { container } = render(<App />);
    await screen.findByRole('heading', { level: 1 });
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeDefined();
    expect(mainContainer?.className).toContain('max-w-7xl');
    expect(mainContainer?.className).toContain('mx-auto');
  });

  test('has correct text color classes', async () => {
    render(<App />);
    const heading = await screen.findByRole('heading', { level: 1 });
    const subtitle = await screen.findByText('Premium Flash Sales');
    
    expect(heading.className).toContain('text-white');
    expect(subtitle.className).toContain('text-gray-300');
  });

  test('has proper layout structure', async () => {
    render(<App />);
    const heading = await screen.findByRole('heading', { level: 1 });
    const flexContainer = heading.parentElement;
    expect(flexContainer).toBeDefined();
    expect(flexContainer?.className).toContain('flex');
    expect(flexContainer?.className).toContain('items-center');
  });
}); 