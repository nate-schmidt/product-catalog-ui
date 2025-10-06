import { useState } from 'react';
import { Card } from './Card';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface ProductCatalogProps {
  products?: Product[];
  onAddToCart?: (productId: string) => void;
  title?: string;
}

export function ProductCatalog({ 
  products = [], 
  onAddToCart, 
  title = "Product Catalog" 
}: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center" data-testid="catalog-title">
        {title}
      </h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg" data-testid="no-products-message">
            {searchTerm ? 'No products match your search.' : 'No products available.'}
          </p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          data-testid="products-grid"
        >
          {filteredProducts.map(product => (
            <Card
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              description={product.description}
              imageUrl={product.imageUrl}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
