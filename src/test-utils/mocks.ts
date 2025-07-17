// Mock data for testing
export const mockProducts = [
  {
    id: 1,
    name: 'Test Product 1',
    description: 'This is a test product',
    price: 29.99,
    image: '/test-image-1.jpg',
    category: 'Electronics',
    stock: 10,
  },
  {
    id: 2,
    name: 'Test Product 2',
    description: 'Another test product',
    price: 49.99,
    image: '/test-image-2.jpg',
    category: 'Clothing',
    stock: 5,
  },
];

export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'customer',
};

export const mockCart = {
  items: [
    {
      productId: 1,
      quantity: 2,
      product: mockProducts[0],
    },
  ],
  total: 59.98,
};

// Mock fetch responses
export const createMockResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Mock API handlers
export const mockApiHandlers = {
  '/api/products': () => createMockResponse(mockProducts),
  '/api/products/1': () => createMockResponse(mockProducts[0]),
  '/api/cart': () => createMockResponse(mockCart),
  '/api/user': () => createMockResponse(mockUser),
};

// Helper to mock fetch globally
export const mockFetch = (handlers = mockApiHandlers) => {
  (global as any).fetch = async (url: string, options?: RequestInit) => {
    // Parse URL to get path and query params
    let path = url;
    let queryString = '';
    
    if (url.includes('?')) {
      [path, queryString] = url.split('?');
    }
    
    // Find matching handler
    for (const [pattern, handler] of Object.entries(handlers)) {
      if (path === pattern || path.startsWith(pattern + '/')) {
        return handler(url, options);
      }
      // Also match with query params
      if (queryString && url === pattern) {
        return handler(url, options);
      }
    }
    
    // Default 404 response
    return new Response('Not Found', { status: 404 });
  };
};

// Helper to restore fetch
export const restoreFetch = () => {
  delete (global as any).fetch;
};