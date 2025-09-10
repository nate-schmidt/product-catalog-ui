import { Product } from '../cart/cartTypes';

// Mock data for development - replace with real API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Leather Sofa',
    description: 'Luxurious 3-seater leather sofa perfect for modern living rooms',
    price: 1299,
    category: 'Furniture',
    stock: 5,
    inStock: true,
    material: 'Genuine Leather',
    color: 'Brown',
    dimensions: {
      width: 200,
      height: 85,
      depth: 90,
      unit: 'cm'
    }
  },
  {
    id: '2',
    name: 'Oak Dining Table',
    description: 'Solid oak dining table that seats up to 6 people comfortably',
    price: 899,
    category: 'Furniture',
    stock: 3,
    inStock: true,
    material: 'Oak Wood',
    color: 'Natural',
    dimensions: {
      width: 180,
      height: 75,
      depth: 90,
      unit: 'cm'
    }
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable office chair with lumbar support for long working hours',
    price: 399,
    category: 'Office',
    stock: 0,
    inStock: false,
    material: 'Mesh & Steel',
    color: 'Black',
    dimensions: {
      width: 65,
      height: 120,
      depth: 65,
      unit: 'cm'
    }
  },
  {
    id: '4',
    name: 'Glass Coffee Table',
    description: 'Elegant tempered glass coffee table with steel legs',
    price: 299,
    category: 'Furniture',
    stock: 8,
    inStock: true,
    material: 'Tempered Glass',
    color: 'Clear',
    dimensions: {
      width: 120,
      height: 45,
      depth: 60,
      unit: 'cm'
    }
  }
];

class ProductApi {
  private baseUrl: string;
  private mockDelay: number;

  constructor(baseUrl: string = 'http://localhost:8080', mockDelay: number = 500) {
    this.baseUrl = baseUrl;
    this.mockDelay = mockDelay;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      // Try real API first
      const response = await fetch(`${this.baseUrl}/api/products`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data with simulated delay
    await this.delay(this.mockDelay);
    return [...mockProducts];
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      // Try real API first
      const response = await fetch(`${this.baseUrl}/api/products/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data with simulated delay
    await this.delay(this.mockDelay);
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      // Try real API first
      const response = await fetch(`${this.baseUrl}/api/products?category=${category}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data with simulated delay
    await this.delay(this.mockDelay);
    return mockProducts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      // Try real API first
      const response = await fetch(`${this.baseUrl}/api/products/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API not available, using mock data');
    }

    // Fallback to mock data with simulated delay
    await this.delay(this.mockDelay);
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    );
  }
}

export const productApi = new ProductApi();