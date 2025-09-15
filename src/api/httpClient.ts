import { API_CONFIG, HTTP_METHODS } from './config';

export class HttpClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).error = errorData.error || 'Request failed';
        throw error;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Retry logic for network errors
      if (retryCount < API_CONFIG.RETRY_ATTEMPTS && this.isRetryableError(error)) {
        await this.delay(API_CONFIG.RETRY_DELAY * Math.pow(2, retryCount));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error('The request timed out');
          (timeoutError as any).status = 408;
          (timeoutError as any).error = 'Request Timeout';
          throw timeoutError;
        }
        const networkError = new Error(error.message);
        (networkError as any).error = 'Network Error';
        throw networkError;
      }

      const unknownError = new Error('An unexpected error occurred');
      (unknownError as any).error = 'Unknown Error';
      throw unknownError;
    }
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.name === 'TypeError' || // Network error
             error.message.includes('fetch') ||
             error.message.includes('network');
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.GET,
      headers,
    });
  }

  async post<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.POST,
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PUT,
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.DELETE,
      headers,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: HTTP_METHODS.PATCH,
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();
