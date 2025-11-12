import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts, Product } from "../services/api";

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Furniture Store</h1>
        <p className="text-gray-400 mb-12 text-center">Quality furniture for every room in your home</p>
        <div className="text-center text-gray-400 mt-8">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Furniture Store</h1>
        <p className="text-gray-400 mb-12 text-center">Quality furniture for every room in your home</p>
        <div className="text-center text-red-400 mt-8">
          <p className="mb-4">Error loading products: {error}</p>
          <p className="text-sm text-gray-500">Make sure the backend service is running on http://localhost:8080</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-5xl font-bold text-white mb-4 text-center">Furniture Store</h1>
      <p className="text-gray-400 mb-12 text-center">Quality furniture for every room in your home</p>
      {products.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No products available</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCatalog;