export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  flashSale?: {
    salePrice: number;
    endTime: Date;
    originalPrice: number;
    discount: number;
    quantityLeft?: number;
  };
}

export const furnitureData: Product[] = [
  {
    id: "1",
    name: "Modern Sectional Sofa",
    description: "Comfortable L-shaped sectional sofa with premium fabric upholstery",
    price: 1299,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    category: "Seating",
    inStock: true,
    flashSale: {
      salePrice: 899,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      originalPrice: 1299,
      discount: 31,
      quantityLeft: 3
    }
  },
  {
    id: "2",
    name: "Dining Table Set",
    description: "Solid wood dining table with 6 matching chairs",
    price: 899,
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=300&fit=crop",
    category: "Dining",
    inStock: true
  },
  {
    id: "3",
    name: "Executive Office Chair",
    description: "Ergonomic leather office chair with lumbar support",
    price: 449,
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=300&fit=crop",
    category: "Office",
    inStock: true,
    flashSale: {
      salePrice: 299,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      originalPrice: 449,
      discount: 33,
      quantityLeft: 8
    }
  },
  {
    id: "4",
    name: "King Size Bed Frame",
    description: "Minimalist wooden bed frame with built-in nightstands",
    price: 699,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
    category: "Bedroom",
    inStock: true
  },
  {
    id: "5",
    name: "Coffee Table",
    description: "Glass-top coffee table with metal legs",
    price: 299,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    category: "Living Room",
    inStock: true,
    flashSale: {
      salePrice: 199,
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      originalPrice: 299,
      discount: 33,
      quantityLeft: 12
    }
  },
  {
    id: "6",
    name: "Bookshelf",
    description: "5-tier wooden bookshelf for storage and display",
    price: 199,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    category: "Storage",
    inStock: true
  },
  {
    id: "7",
    name: "Accent Chair",
    description: "Velvet accent chair with gold legs",
    price: 399,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    category: "Seating",
    inStock: false
  },
  {
    id: "8",
    name: "Standing Desk",
    description: "Adjustable height standing desk with memory presets",
    price: 599,
    image: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=400&h=300&fit=crop",
    category: "Office",
    inStock: true,
    flashSale: {
      salePrice: 399,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now (urgent!)
      originalPrice: 599,
      discount: 33,
      quantityLeft: 2
    }
  }
];

export const getFlashSaleProducts = (): Product[] => {
  return furnitureData.filter(product => 
    product.flashSale && 
    product.flashSale.endTime > new Date()
  );
};

export const isFlashSaleActive = (product: Product): boolean => {
  return !!(product.flashSale && product.flashSale.endTime > new Date());
};