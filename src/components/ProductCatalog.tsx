import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../providers/CartProvider";
import { type Product } from "../state/products";
import { productApi } from "../services/api";

function ProductCatalog() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProducts = await productApi.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-bold text-white mb-8">Product Catalog</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-bold text-white mb-8">Product Catalog</h2>
        <div className="flex items-center justify-center py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading products</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Make sure the backend service is running at http://localhost:8080/api</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-3xl font-bold text-white mb-8">Product Catalog</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-white text-lg">No products available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-white mb-8">Product Catalog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductCatalog;