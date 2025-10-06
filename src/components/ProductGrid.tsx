import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Our Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all transform hover:scale-105"
          >
            <div className="text-6xl mb-4 text-center">{product.image}</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {product.name}
            </h3>
            <p className="text-gray-300 text-sm mb-4 h-10">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
