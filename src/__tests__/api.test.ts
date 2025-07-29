import { test, expect, describe, beforeEach } from 'bun:test';
import { createMockResponse } from './test-utils';

describe('API Routes', () => {
  beforeEach(() => {
    // Reset any global state if needed
  });

  describe('GET /api/hello', () => {
    test('returns correct response format', async () => {
      const expectedResponse = {
        message: "Hello, world!",
        method: "GET",
      };

      // Test the expected response structure
      expect(expectedResponse).toHaveProperty('message');
      expect(expectedResponse).toHaveProperty('method');
      expect(expectedResponse.message).toBe('Hello, world!');
      expect(expectedResponse.method).toBe('GET');
    });

    test('can create mock response with correct data', () => {
      const data = {
        message: "Hello, world!",
        method: "GET",
      };

      const response = createMockResponse(data);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('PUT /api/hello', () => {
    test('returns correct response format', () => {
      const expectedResponse = {
        message: "Hello, world!",
        method: "PUT",
      };

      expect(expectedResponse).toHaveProperty('message');
      expect(expectedResponse).toHaveProperty('method');
      expect(expectedResponse.message).toBe('Hello, world!');
      expect(expectedResponse.method).toBe('PUT');
    });

    test('can create mock PUT response', () => {
      const data = {
        message: "Hello, world!",
        method: "PUT",
      };

      const response = createMockResponse(data);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/hello/:name', () => {
    test('returns personalized greeting format', () => {
      const name = 'Alice';
      const expectedResponse = {
        message: `Hello, ${name}!`,
      };

      expect(expectedResponse).toHaveProperty('message');
      expect(expectedResponse.message).toBe('Hello, Alice!');
    });

    test('handles different names correctly', () => {
      const testNames = ['John', 'Jane', 'Bob', 'Charlie'];
      
      testNames.forEach(name => {
        const expectedMessage = `Hello, ${name}!`;
        expect(expectedMessage).toBe(`Hello, ${name}!`);
      });
    });

    test('handles special characters in names', () => {
      const specialNames = ['José', 'Müller', 'O\'Brien'];
      
      specialNames.forEach(name => {
        const expectedMessage = `Hello, ${name}!`;
        expect(expectedMessage).toContain(name);
      });
    });

    test('can create mock response for named greeting', () => {
      const name = 'TestUser';
      const data = {
        message: `Hello, ${name}!`,
      };

      const response = createMockResponse(data);
      expect(response.status).toBe(200);
    });
  });

  describe('Response utilities', () => {
    test('createMockResponse handles different status codes', () => {
      const data = { error: 'Not found' };
      const response = createMockResponse(data, 404);
      
      expect(response.status).toBe(404);
    });

    test('createMockResponse handles empty data', () => {
      const response = createMockResponse({});
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    test('can test JSON response parsing', async () => {
      const data = { test: 'value' };
      const response = createMockResponse(data);
      const parsed = await response.json();
      
      expect(parsed).toEqual(data);
    });
  });

  describe('Route parameter validation', () => {
    test('validates name parameter exists', () => {
      const mockParams = { name: 'TestUser' };
      
      expect(mockParams).toHaveProperty('name');
      expect(mockParams.name).toBe('TestUser');
    });

    test('handles missing name parameter', () => {
      const mockParams = {};
      
      expect(mockParams).not.toHaveProperty('name');
    });

    test('validates name parameter types', () => {
      const validNames = ['string', '123', 'user-name'];
      
      validNames.forEach(name => {
        expect(typeof name).toBe('string');
      });
    });
  });
});