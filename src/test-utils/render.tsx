import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that can wrap components with providers
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // Add any providers here as the app grows
  // Example: <ThemeProvider><AuthProvider>{children}</AuthProvider></ThemeProvider>
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';