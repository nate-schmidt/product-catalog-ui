import { ApiError } from '../services/api';

/**
 * Error handling utilities
 */

export interface ErrorInfo {
  message: string;
  type: 'network' | 'validation' | 'server' | 'unknown';
  statusCode?: number;
  details?: any;
}

/**
 * Convert various error types to a standardized ErrorInfo object
 */
export function normalizeError(error: unknown): ErrorInfo {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      type: error.status === 0 ? 'network' : 'server',
      statusCode: error.status,
      details: error.response,
    };
  }
  
  if (error instanceof Error) {
    // Check for common network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your connection and try again.',
        type: 'network',
      };
    }
    
    return {
      message: error.message,
      type: 'unknown',
      details: error,
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      type: 'unknown',
    };
  }
  
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    details: error,
  };
}

/**
 * Get user-friendly error messages
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const errorInfo = normalizeError(error);
  
  switch (errorInfo.type) {
    case 'network':
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case 'server':
      if (errorInfo.statusCode) {
        switch (errorInfo.statusCode) {
          case 400:
            return 'Invalid request. Please check your information and try again.';
          case 401:
            return 'You need to log in to continue.';
          case 403:
            return 'You don\'t have permission to perform this action.';
          case 404:
            return 'The requested resource was not found.';
          case 409:
            return 'This action conflicts with existing data. Please refresh and try again.';
          case 429:
            return 'Too many requests. Please wait a moment and try again.';
          case 500:
            return 'Server error. Please try again later.';
          case 503:
            return 'Service temporarily unavailable. Please try again later.';
        }
      }
      return errorInfo.message;
    
    case 'validation':
      return errorInfo.message;
    
    default:
      return errorInfo.message || 'Something went wrong. Please try again.';
  }
}

/**
 * Log errors for debugging (in development) or analytics (in production)
 */
export function logError(error: unknown, context?: string): void {
  const errorInfo = normalizeError(error);
  
  const logData = {
    ...errorInfo,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData);
  } else {
    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    console.error('Error occurred:', errorInfo.message);
  }
}

/**
 * Retry utility for failed operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const errorInfo = normalizeError(error);
      
      // Don't retry validation errors or client errors (4xx)
      if (
        errorInfo.type === 'validation' || 
        (errorInfo.statusCode && errorInfo.statusCode >= 400 && errorInfo.statusCode < 500)
      ) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying, with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}