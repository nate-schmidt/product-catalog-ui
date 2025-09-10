import { useState, useEffect } from "react";
import Card from "./Card";
import CartBadge from "./CartBadge";
import { useCart } from "../cart/CartContext";
import { Product } from "../cart/cartTypes";
import { productApi } from "../api/productApi";

interface ProductCatalogProps {
  onNavigateToCart: () => void;
}

function ProductCatalog({ onNavigateToCart }: ProductCatalogProps) {
  const { addItem } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await productApi.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-white text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-400 text-lg mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Product Catalog</h1>
        <CartBadge onClick={onNavigateToCart} />
      </div>
      
      {addedItem && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          ✅ {addedItem} added to cart!
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center text-white text-lg py-8">
          No products available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="h-fit">
              <Card.Header>
                <h2 className="text-xl font-semibold text-black">{product.name}</h2>
                {product.category && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-2xl font-bold text-black">${product.price.toLocaleString()}</p>
                  {product.stock !== undefined && (
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock} {product.inStock ? '✅' : '❌'}
                    </p>
                  )}
                  {product.material && (
                    <p className="text-sm text-gray-500">Material: {product.material}</p>
                  )}
                  {product.color && (
                    <p className="text-sm text-gray-500">Color: {product.color}</p>
                  )}
                  {product.dimensions && (
                    <p className="text-sm text-gray-500">
                      Dimensions: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} {product.dimensions.unit || 'cm'}
                    </p>
                  )}
                </div>
              </Card.Content>
              <Card.Footer>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
                    product.inStock
                      ? 'bg-gray-200 text-black hover:bg-gray-300'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;