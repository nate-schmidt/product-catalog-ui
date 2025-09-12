/**
 * Error handling utilities
 */

import { ApiError } from '../types/product';

export class ApiException extends Error {
  public readonly status: number;
  public readonly apiError?: ApiError;

  constructor(message: string, status: number, apiError?: ApiError) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.apiError = apiError;
  }
}

/**
 * Handle API response errors
 */
export const handleApiError = async (response: Response): Promise<never> => {
  let apiError: ApiError | undefined;
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      apiError = await response.json();
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const message = apiError?.message || `HTTP ${response.status}: ${response.statusText}`;
  throw new ApiException(message, response.status, apiError);
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof ApiException) {
    switch (error.status) {
      case 404:
        return 'The requested resource was not found.';
      case 400:
        return error.apiError?.message || 'Invalid request. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 0:
      case -1:
        return 'Network error. Please check your connection.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

/**
 * Retry utility for API calls
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiException && error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};