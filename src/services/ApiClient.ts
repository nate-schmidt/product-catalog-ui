import { API_CONFIG } from '../config/api';
import { ApiError } from '../types/Product';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  cache?: boolean;
  retries?: number;
}

export class ApiClient {
  private cache = new Map<string, CacheEntry<any>>();
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getCacheKey(url: string, config: RequestConfig): string {
    return `${config.method || 'GET'}-${url}-${JSON.stringify(config.body || {})}`;
  }

  private getCachedData<T>(cacheKey: string): T | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.data;
  }

  private setCachedData<T>(cacheKey: string, data: T, ttl: number = API_CONFIG.CACHE_TTL): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, config: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = API_CONFIG.TIMEOUT,
      cache = true,
      retries = API_CONFIG.RETRY_ATTEMPTS,
    } = config;

    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.getCacheKey(url, config);

    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const requestConfig: RequestInit = {
          method,
          headers: requestHeaders,
        };

        if (body && method !== 'GET') {
          requestConfig.body = JSON.stringify(body);
        }

        const response = await this.fetchWithTimeout(url, requestConfig, timeout);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError({
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            code: errorData.code || response.status.toString(),
            details: errorData,
          });
        }

        const data = await response.json();

        // Cache successful GET responses
        if (method === 'GET' && cache) {
          this.setCachedData(cacheKey, data);
        }

        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Don't retry on client errors (4xx) or the last attempt
        if ((error instanceof ApiError && error.code?.startsWith('4')) || attempt === retries) {
          break;
        }

        // Wait before retrying with exponential backoff
        if (attempt < retries) {
          const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after all retry attempts');
  }

  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(); 