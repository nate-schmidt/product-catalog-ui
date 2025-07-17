import { test, expect, describe, beforeEach, afterEach } from 'bun:test';
import { mockProducts, mockCart, mockUser, mockFetch, restoreFetch, createMockResponse } from '../test-utils/mocks';

// Example API service for reference
const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

const api = {
  // Products
  getProducts: async (params?: { category?: string; search?: string }) => {
    let url = `${API_BASE_URL}/products`;
    if (params?.category || params?.search) {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append('category', params.category);
      if (params.search) searchParams.append('search', params.search);
      url += `?${searchParams.toString()}`;
    }
    
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  getProduct: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },
  
  // Cart
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`);
    return handleResponse(response);
  },
  
  addToCart: async (productId: number, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },
  
  updateCartItem: async (productId: number, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },
  
  removeFromCart: async (productId: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
  
  // User
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/user`);
    return handleResponse(response);
  },
};

describe('API Service', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    restoreFetch();
  });

  describe('Products API', () => {
    test('getProducts fetches all products', async () => {
      const products = await api.getProducts();
      expect(products).toEqual(mockProducts);
    });

    test('getProducts with category filter', async () => {
      const electronics = [mockProducts[0]];
      mockFetch({
        '/api/products?category=Electronics': () => createMockResponse(electronics),
      });

      const products = await api.getProducts({ category: 'Electronics' });
      expect(products).toEqual(electronics);
    });

    test('getProducts with search query', async () => {
      const searchResults = [mockProducts[0]];
      mockFetch({
        '/api/products?search=test': () => createMockResponse(searchResults),
      });

      const products = await api.getProducts({ search: 'test' });
      expect(products).toEqual(searchResults);
    });

    test('getProducts with multiple parameters', async () => {
      const results = [mockProducts[0]];
      mockFetch({
        '/api/products?category=Electronics&search=test': () => createMockResponse(results),
      });

      const products = await api.getProducts({ category: 'Electronics', search: 'test' });
      expect(products).toEqual(results);
    });

    test('getProduct fetches single product', async () => {
      const product = await api.getProduct(1);
      expect(product).toEqual(mockProducts[0]);
    });

    test('getProduct handles not found error', async () => {
      mockFetch({
        '/api/products/999': () => new Response('Not Found', { status: 404 }),
      });

      await expect(api.getProduct(999)).rejects.toThrow(ApiError);
      await expect(api.getProduct(999)).rejects.toMatchObject({
        status: 404,
        message: 'API Error: 404',
      });
    });
  });

  describe('Cart API', () => {
    test('getCart fetches current cart', async () => {
      const cart = await api.getCart();
      expect(cart).toEqual(mockCart);
    });

    test('addToCart adds item to cart', async () => {
      const updatedCart = { ...mockCart, items: [...mockCart.items] };
      mockFetch({
        '/api/cart/items': () => createMockResponse(updatedCart),
      });

      const result = await api.addToCart(2, 1);
      expect(result).toEqual(updatedCart);
    });

    test('addToCart sends correct payload', async () => {
      let capturedBody: any;
      mockFetch({
        '/api/cart/items': (url, options) => {
          capturedBody = JSON.parse(options?.body as string);
          return createMockResponse(mockCart);
        },
      });

      await api.addToCart(2, 3);
      expect(capturedBody).toEqual({ productId: 2, quantity: 3 });
    });

    test('updateCartItem updates quantity', async () => {
      const updatedCart = { ...mockCart };
      mockFetch({
        '/api/cart/items/1': () => createMockResponse(updatedCart),
      });

      const result = await api.updateCartItem(1, 5);
      expect(result).toEqual(updatedCart);
    });

    test('removeFromCart deletes item', async () => {
      mockFetch({
        '/api/cart/items/1': () => createMockResponse({ success: true }),
      });

      const result = await api.removeFromCart(1);
      expect(result).toEqual({ success: true });
    });
  });

  describe('User API', () => {
    test('getCurrentUser fetches user data', async () => {
      const user = await api.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    test('getCurrentUser handles unauthorized error', async () => {
      mockFetch({
        '/api/user': () => new Response('Unauthorized', { status: 401 }),
      });

      await expect(api.getCurrentUser()).rejects.toThrow(ApiError);
      await expect(api.getCurrentUser()).rejects.toMatchObject({
        status: 401,
        message: 'API Error: 401',
      });
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      mockFetch({
        '/api/products': () => {
          throw new Error('Network failure');
        },
      });

      await expect(api.getProducts()).rejects.toThrow('Network failure');
    });

    test('handles non-JSON responses', async () => {
      mockFetch({
        '/api/products': () => new Response('Plain text response', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        }),
      });

      const result = await api.getProducts();
      expect(result).toBe('Plain text response');
    });

    test('handles empty responses', async () => {
      mockFetch({
        '/api/cart/items/1': () => new Response('', { status: 204 }),
      });

      const result = await api.removeFromCart(1);
      expect(result).toBe('');
    });

    test('handles server errors with custom messages', async () => {
      mockFetch({
        '/api/products': () => new Response(
          JSON.stringify({ error: 'Database connection failed' }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        ),
      });

      await expect(api.getProducts()).rejects.toThrow(ApiError);
    });
  });
});