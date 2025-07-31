import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FlashSale, FlashSaleProduct, Product, FlashSalesContextType } from '../types';

const FlashSalesContext = createContext<FlashSalesContextType | null>(null);

export const useFlashSales = () => {
  const context = useContext(FlashSalesContext);
  if (!context) {
    throw new Error('useFlashSales must be used within a FlashSalesProvider');
  }
  return context;
};

interface FlashSalesProviderProps {
  children: ReactNode;
}

export const FlashSalesProvider: React.FC<FlashSalesProviderProps> = ({ children }) => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<FlashSaleProduct[]>([]);

  // Sample flash sale data
  useEffect(() => {
    const now = new Date();
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality noise-canceling wireless headphones with 30-hour battery life',
        price: 299.99,
        originalPrice: 299.99,
        image: '/api/placeholder/300/300',
        category: 'Electronics',
        rating: 4.8,
        reviewCount: 1250,
        inStock: true,
        inventory: 25
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with GPS, heart rate monitor, and smartphone integration',
        price: 199.99,
        originalPrice: 199.99,
        image: '/api/placeholder/300/300',
        category: 'Electronics',
        rating: 4.6,
        reviewCount: 890,
        inStock: true,
        inventory: 15
      },
      {
        id: '3',
        name: 'Ultra-Comfort Gaming Chair',
        description: 'Ergonomic gaming chair with lumbar support and premium leather finish',
        price: 399.99,
        originalPrice: 399.99,
        image: '/api/placeholder/300/300',
        category: 'Furniture',
        rating: 4.9,
        reviewCount: 567,
        inStock: true,
        inventory: 8
      },
      {
        id: '4',
        name: 'Professional Camera Lens',
        description: '85mm f/1.4 prime lens perfect for portrait photography',
        price: 899.99,
        originalPrice: 899.99,
        image: '/api/placeholder/300/300',
        category: 'Photography',
        rating: 4.7,
        reviewCount: 234,
        inStock: true,
        inventory: 12
      }
    ];

    const sampleFlashSales: FlashSale[] = [
      {
        id: 'fs1',
        productId: '1',
        discountPercentage: 40,
        salePrice: 179.99,
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000), // Ends in 6 hours
        maxQuantity: 50,
        soldQuantity: 23,
        isActive: true,
        title: 'Lightning Deal: Premium Audio',
        badge: 'HOT'
      },
      {
        id: 'fs2',
        productId: '2',
        discountPercentage: 35,
        salePrice: 129.99,
        startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Started 1 hour ago
        endTime: new Date(now.getTime() + 4 * 60 * 60 * 1000), // Ends in 4 hours
        maxQuantity: 30,
        soldQuantity: 18,
        isActive: true,
        title: 'Flash Sale: Smart Tech',
        badge: 'TRENDING'
      },
      {
        id: 'fs3',
        productId: '3',
        discountPercentage: 25,
        salePrice: 299.99,
        startTime: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
        endTime: new Date(now.getTime() + 8 * 60 * 60 * 1000), // Ends in 8 hours
        maxQuantity: 20,
        soldQuantity: 5,
        isActive: true,
        title: 'Mega Sale: Gaming Gear',
        badge: 'NEW'
      }
    ];

    setProducts(sampleProducts);
    setFlashSales(sampleFlashSales);
  }, []);

  // Calculate time remaining for flash sales
  const calculateTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const timeDiff = endTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return null;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  // Update flash sale products with time remaining
  useEffect(() => {
    const updateFlashSaleProducts = () => {
      const now = new Date();
      const activeFlashSales = flashSales.filter(sale => 
        sale.isActive && 
        now >= sale.startTime && 
        now <= sale.endTime &&
        sale.soldQuantity < sale.maxQuantity
      );

      const flashProducts = activeFlashSales.map(sale => {
        const product = products.find(p => p.id === sale.productId);
        if (!product) return null;

        return {
          ...product,
          price: sale.salePrice,
          originalPrice: product.price,
          flashSale: sale,
          timeRemaining: calculateTimeRemaining(sale.endTime)
        } as FlashSaleProduct;
      }).filter(Boolean) as FlashSaleProduct[];

      setFlashSaleProducts(flashProducts);
    };

    updateFlashSaleProducts();
    const interval = setInterval(updateFlashSaleProducts, 1000); // Update every second

    return () => clearInterval(interval);
  }, [flashSales, products]);

  // Helper functions
  const getFlashSaleByProductId = (productId: string): FlashSale | null => {
    return flashSales.find(sale => 
      sale.productId === productId && 
      sale.isActive && 
      new Date() >= sale.startTime && 
      new Date() <= sale.endTime &&
      sale.soldQuantity < sale.maxQuantity
    ) || null;
  };

  const isProductOnFlashSale = (productId: string): boolean => {
    return getFlashSaleByProductId(productId) !== null;
  };

  const activeFlashSales = flashSales.filter(sale => {
    const now = new Date();
    return sale.isActive && 
           now >= sale.startTime && 
           now <= sale.endTime &&
           sale.soldQuantity < sale.maxQuantity;
  });

  const value: FlashSalesContextType = {
    flashSales,
    flashSaleProducts,
    activeFlashSales,
    getFlashSaleByProductId,
    isProductOnFlashSale,
    calculateTimeRemaining
  };

  return (
    <FlashSalesContext.Provider value={value}>
      {children}
    </FlashSalesContext.Provider>
  );
};