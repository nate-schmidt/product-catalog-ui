import React, { useEffect, useState } from 'react';
import { useCart, Product } from '../CartContext';

export const ProductCatalog: React.FC = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      // Use mock data for now
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Modern Sofa',
          price: 899.99,
          category: 'Living Room',
          description: 'Comfortable 3-seater sofa with premium fabric',
          stockQuantity: 10,
          imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
        },
        {
          id: '2',
          name: 'Wooden Dining Table',
          price: 1299.99,
          category: 'Dining Room',
          description: 'Solid wood dining table for 6 people',
          stockQuantity: 5,
          imageUrl: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400'
        },
        {
          id: '3',
          name: 'Office Chair',
          price: 349.99,
          category: 'Office',
          description: 'Ergonomic office chair with lumbar support',
          stockQuantity: 15,
          imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400'
        },
        {
          id: '4',
          name: 'Bedside Table',
          price: 149.99,
          category: 'Bedroom',
          description: 'Minimalist bedside table with drawer',
          stockQuantity: 20,
          imageUrl: 'https://images.unsplash.com/photo-1565191999001-551c187427bb?w=400'
        },
        {
          id: '5',
          name: 'Bookshelf',
          price: 299.99,
          category: 'Living Room',
          description: '5-tier modern bookshelf',
          stockQuantity: 8,
          imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400'
        },
        {
          id: '6',
          name: 'Coffee Table',
          price: 449.99,
          category: 'Living Room',
          description: 'Glass-top coffee table with storage',
          stockQuantity: 12,
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
        }
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-w-16 aspect-h-12 bg-gray-200">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.category}</p>
            <p className="text-gray-700 text-sm mb-3">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">
                {product.stockQuantity} in stock
              </span>
            </div>
            
            <button
              onClick={() => addToCart(product)}
              disabled={product.stockQuantity === 0}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};