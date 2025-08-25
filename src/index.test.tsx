import { test, expect, describe, beforeEach, afterEach, mock } from 'bun:test';

describe('index.tsx server routes', () => {
  let mockServe: any;
  let serverConfig: any;

  beforeEach(() => {
    // Mock bun serve function
    mockServe = mock((config) => {
      serverConfig = config;
      return { stop: mock(() => {}) };
    });

    // Mock bun module
    mock.module('bun', () => ({
      serve: mockServe,
    }));

    // Clear module cache
    delete require.cache[require.resolve('./index')];
  });

  afterEach(() => {
    mock.restore();
  });

  test('server is configured with correct routes', async () => {
    await import('./index');

    expect(mockServe).toHaveBeenCalled();
    expect(serverConfig).toBeDefined();
    expect(serverConfig.routes).toBeDefined();
    expect(serverConfig.routes['/*']).toBeDefined();
    expect(serverConfig.routes['/api/hello']).toBeDefined();
    expect(serverConfig.routes['/api/hello/:name']).toBeDefined();
  });

  test('GET /api/hello returns correct response', async () => {
    await import('./index');

    const mockRequest = new Request('http://localhost/api/hello');
    const response = await serverConfig.routes['/api/hello'].GET(mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: 'Hello, world!',
      method: 'GET',
    });
  });

  test('PUT /api/hello returns correct response', async () => {
    await import('./index');

    const mockRequest = new Request('http://localhost/api/hello', { method: 'PUT' });
    const response = await serverConfig.routes['/api/hello'].PUT(mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: 'Hello, world!',
      method: 'PUT',
    });
  });

  test('/api/hello/:name returns personalized greeting', async () => {
    await import('./index');

    const mockRequest = {
      params: { name: 'Alice' }
    };
    const response = await serverConfig.routes['/api/hello/:name'](mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: 'Hello, Alice!',
    });
  });

  test('/api/hello/:name handles special characters in name', async () => {
    await import('./index');

    const mockRequest = {
      params: { name: 'José María' }
    };
    const response = await serverConfig.routes['/api/hello/:name'](mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: 'Hello, José María!',
    });
  });

  test('/api/hello/:name handles empty name', async () => {
    await import('./index');

    const mockRequest = {
      params: { name: '' }
    };
    const response = await serverConfig.routes['/api/hello/:name'](mockRequest);
    const data = await response.json();

    expect(data).toEqual({
      message: 'Hello, !',
    });
  });

  test('development configuration is set correctly', async () => {
    // Mock production environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    await import('./index');

    expect(serverConfig.development).toBe(false);

    // Reset environment
    process.env.NODE_ENV = originalEnv;
  });

  test('development configuration includes HMR and console in development', async () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    // Clear module cache to reload with new env
    delete require.cache[require.resolve('./index')];
    
    await import('./index');

    expect(serverConfig.development).toEqual({
      hmr: true,
      console: true,
    });

    // Reset environment
    process.env.NODE_ENV = originalEnv;
  });

  test('catch-all route serves index.html', async () => {
    await import('./index');

    expect(serverConfig.routes['/*']).toBeDefined();
    // The catch-all route should be set to serve the index.html import
  });
});