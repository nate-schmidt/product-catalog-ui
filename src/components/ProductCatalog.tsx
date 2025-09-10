import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

// Sample products
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 12999, // $129.99
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 29999, // $299.99
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Mug',
    description: 'Premium ceramic coffee mug with ergonomic handle',
    price: 1599, // $15.99
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop',
    category: 'Kitchen',
    inStock: true
  },
  {
    id: '4',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better ergonomics',
    price: 4999, // $49.99
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    category: 'Office',
    inStock: true
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with excellent sound quality',
    price: 7999, // $79.99
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    category: 'Electronics',
    inStock: true
  },
  {
    id: '6',
    name: 'Desk Organizer',
    description: 'Bamboo desk organizer with multiple compartments',
    price: 2999, // $29.99
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    category: 'Office',
    inStock: false
  }
];

export const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addItem } = useCart();

  const categories = ['All', ...Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)))];
  
  const filteredProducts = selectedCategory === 'All' 
    ? SAMPLE_PRODUCTS 
    : SAMPLE_PRODUCTS.filter(p => p.category === selectedCategory);

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleAddToCart = (product: Product) => {
    if (product.inStock) {
      addItem(product);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6">Product Catalog</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/400x300/374151/9CA3AF?text=${encodeURIComponent(product.name)}`;
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-400">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    product.inStock
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};