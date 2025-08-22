import React from 'react';
import { ProductCard } from './ProductCard';
import { sampleProducts } from '../data/sampleProducts';

export const ProductCatalog: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Pirate's Treasure Catalog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};