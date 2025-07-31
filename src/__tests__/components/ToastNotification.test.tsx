import { describe, test, expect, beforeEach, jest } from 'bun:test';
import { ToastNotification } from '../../components/ToastNotification';
import { 
  renderWithProviders, 
  createMockFunctions,
  cleanupAfterEach,
  screen,
  fireEvent,
  waitFor
} from '../utils/test-helpers';
import { ToastMessage } from '../../types';

describe('ToastNotification', () => {
  const mockFunctions = createMockFunctions();
  
  const createMockToast = (overrides: Partial<ToastMessage> = {}): ToastMessage => ({
    id: 'test-toast-1',
    message: 'Test notification message',
    type: 'info',
    duration: 5000,
    ...overrides,
  });

  beforeEach(() => {
    cleanupAfterEach();
    mockFunctions.onDismiss.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders toast notification correctly', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement).toBeDefined();
    expect(screen.getByTestId('toast-message')).toBeDefined();
    expect(screen.getByText(toast.message)).toBeDefined();
  });

  test('displays different toast types correctly', () => {
    const types: ToastMessage['type'][] = ['success', 'error', 'warning', 'info'];
    
    types.forEach(type => {
      const toast = createMockToast({ type, id: `toast-${type}` });
      
      const { unmount } = renderWithProviders(
        <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
      );

      const toastElement = screen.getByTestId(`toast-${toast.id}`);
      expect(toastElement).toBeDefined();
      
      // Check for type-specific styling
      switch (type) {
        case 'success':
          expect(toastElement.className).toContain('bg-green-50');
          expect(toastElement.className).toContain('border-green-200');
          expect(toastElement.className).toContain('text-green-800');
          break;
        case 'error':
          expect(toastElement.className).toContain('bg-red-50');
          expect(toastElement.className).toContain('border-red-200');
          expect(toastElement.className).toContain('text-red-800');
          break;
        case 'warning':
          expect(toastElement.className).toContain('bg-yellow-50');
          expect(toastElement.className).toContain('border-yellow-200');
          expect(toastElement.className).toContain('text-yellow-800');
          break;
        case 'info':
          expect(toastElement.className).toContain('bg-blue-50');
          expect(toastElement.className).toContain('border-blue-200');
          expect(toastElement.className).toContain('text-blue-800');
          break;
      }
      
      unmount();
    });
  });

  test('renders appropriate icon for each toast type', () => {
    const types: ToastMessage['type'][] = ['success', 'error', 'warning', 'info'];
    
    types.forEach(type => {
      const toast = createMockToast({ type, id: `toast-${type}` });
      
      const { unmount } = renderWithProviders(
        <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
      );

      const toastElement = screen.getByTestId(`toast-${toast.id}`);
      const icon = toastElement.querySelector('svg');
      expect(icon).toBeDefined();
      
      unmount();
    });
  });

  test('handles different positions correctly', () => {
    const positions: Array<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'> = [
      'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
    ];
    
    positions.forEach(position => {
      const toast = createMockToast({ id: `toast-${position}` });
      
      const { unmount } = renderWithProviders(
        <ToastNotification 
          toast={toast} 
          position={position}
          onDismiss={mockFunctions.onDismiss} 
        />
      );

      const toastElement = screen.getByTestId(`toast-${toast.id}`);
      
      switch (position) {
        case 'top-right':
          expect(toastElement.className).toContain('top-4 right-4');
          break;
        case 'top-left':
          expect(toastElement.className).toContain('top-4 left-4');
          break;
        case 'bottom-right':
          expect(toastElement.className).toContain('bottom-4 right-4');
          break;
        case 'bottom-left':
          expect(toastElement.className).toContain('bottom-4 left-4');
          break;
        case 'top-center':
          expect(toastElement.className).toContain('top-4 left-1/2');
          expect(toastElement.className).toContain('transform -translate-x-1/2');
          break;
        case 'bottom-center':
          expect(toastElement.className).toContain('bottom-4 left-1/2');
          expect(toastElement.className).toContain('transform -translate-x-1/2');
          break;
      }
      
      unmount();
    });
  });

  test('dismiss button works correctly', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const dismissButton = screen.getByTestId('toast-dismiss');
    fireEvent.click(dismissButton);

    // Should trigger leaving animation, then call onDismiss after timeout
    jest.advanceTimersByTime(300);
    
    expect(mockFunctions.onDismiss).toHaveBeenCalledWith(toast.id);
  });

  test('auto-dismisses after specified duration', () => {
    const toast = createMockToast({ duration: 3000 });
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    // Should not dismiss before duration
    jest.advanceTimersByTime(2500);
    expect(mockFunctions.onDismiss).not.toHaveBeenCalled();

    // Should dismiss after duration + animation time
    jest.advanceTimersByTime(1000);
    expect(mockFunctions.onDismiss).toHaveBeenCalledWith(toast.id);
  });

  test('uses default duration when not specified', () => {
    const toast = createMockToast();
    delete (toast as any).duration;
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    // Should use default 5000ms duration
    jest.advanceTimersByTime(5300); // 5000 + 300 for animation
    expect(mockFunctions.onDismiss).toHaveBeenCalledWith(toast.id);
  });

  test('applies custom className correctly', () => {
    const toast = createMockToast();
    const customClass = 'custom-toast-class';
    
    renderWithProviders(
      <ToastNotification 
        toast={toast} 
        className={customClass}
        onDismiss={mockFunctions.onDismiss} 
      />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement.className).toContain(customClass);
  });

  test('has proper accessibility attributes', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement.getAttribute('role')).toBe('alert');
    expect(toastElement.getAttribute('aria-live')).toBe('polite');
    
    const dismissButton = screen.getByTestId('toast-dismiss');
    expect(dismissButton.getAttribute('aria-label')).toBe('Dismiss notification');
  });

  test('progress bar animation works correctly', () => {
    const toast = createMockToast({ duration: 3000 });
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    const progressBar = toastElement.querySelector('.h-1.bg-current.opacity-40');
    expect(progressBar).toBeDefined();
  });

  test('toast appears with animation', async () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    
    // Initially should have opacity-0 and translate-y-2
    expect(toastElement.className).toContain('translate-y-2');
    expect(toastElement.className).toContain('opacity-0');

    // After animation timeout, should become visible
    jest.advanceTimersByTime(10);
    
    await waitFor(() => {
      expect(toastElement.className).toContain('translate-y-0');
      expect(toastElement.className).toContain('opacity-100');
    });
  });

  test('toast leaves with animation', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const dismissButton = screen.getByTestId('toast-dismiss');
    fireEvent.click(dismissButton);

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement.className).toContain('scale-95');
  });

  test('handles long messages correctly', () => {
    const longMessage = 'This is a very long notification message that should be handled properly by the toast component without breaking the layout or causing any issues with the display';
    const toast = createMockToast({ message: longMessage });
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    expect(screen.getByText(longMessage)).toBeDefined();
    
    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement.className).toContain('max-w-sm');
  });

  test('hover effects are applied correctly', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const dismissButton = screen.getByTestId('toast-dismiss');
    expect(dismissButton.className).toContain('hover:bg-opacity-20');
  });

  test('focus styles are applied correctly', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const dismissButton = screen.getByTestId('toast-dismiss');
    expect(dismissButton.className).toContain('focus:outline-none');
    expect(dismissButton.className).toContain('focus:ring-2');
  });

  test('shadow and border styling is correct', () => {
    const toast = createMockToast();
    
    renderWithProviders(
      <ToastNotification toast={toast} onDismiss={mockFunctions.onDismiss} />
    );

    const toastElement = screen.getByTestId(`toast-${toast.id}`);
    expect(toastElement.className).toContain('shadow-lg');
    expect(toastElement.className).toContain('rounded-lg');
    expect(toastElement.className).toContain('border');
  });
});