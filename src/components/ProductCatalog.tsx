import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';

// Mock product data - in real app this would come from API
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Modern Sofa",
    description: "Comfortable 3-seater sofa with premium fabric",
    price: "$899.00",
    stock: 15,
    category: "Living Room"
  },
  {
    id: 2,
    name: "Dining Table",
    description: "Solid wood dining table for 6 people",
    price: "$1,299.00",
    stock: 8,
    category: "Dining Room"
  },
  {
    id: 3,
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    price: "$299.00",
    stock: 25,
    category: "Office"
  },
  {
    id: 4,
    name: "Coffee Table",
    description: "Glass-top coffee table with storage",
    price: "$399.00",
    stock: 12,
    category: "Living Room"
  }
];

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <section className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Catalog</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold">{product.price}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  product.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductCatalog;