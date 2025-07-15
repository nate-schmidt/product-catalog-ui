import React from 'react';
import { useCart } from '../CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    price: 899.99,
    description: 'Comfortable 3-seater sofa with premium fabric',
    category: 'Living Room',
  },
  {
    id: '2',
    name: 'Dining Table',
    price: 599.99,
    description: 'Solid wood dining table for 6 people',
    category: 'Dining Room',
  },
  {
    id: '3',
    name: 'Office Chair',
    price: 299.99,
    description: 'Ergonomic office chair with lumbar support',
    category: 'Office',
  },
  {
    id: '4',
    name: 'Bookshelf',
    price: 199.99,
    description: '5-tier wooden bookshelf',
    category: 'Living Room',
  },
  {
    id: '5',
    name: 'Coffee Table',
    price: 349.99,
    description: 'Glass top coffee table with storage',
    category: 'Living Room',
  },
  {
    id: '6',
    name: 'Bed Frame',
    price: 799.99,
    description: 'Queen size bed frame with headboard',
    category: 'Bedroom',
  },
];

export const ProductCatalog: React.FC = () => {
  const { addToCart, getItemCount } = useCart();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Product Catalog</h2>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Cart Items: {getItemCount()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};