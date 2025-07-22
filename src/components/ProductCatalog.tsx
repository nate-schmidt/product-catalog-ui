import React from 'react';
import { Product } from '../types/cart';

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductCatalog({ products, onAddToCart }: ProductCatalogProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div
          key={product.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
        >
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
              {product.rating && (
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300 ml-1">{product.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}