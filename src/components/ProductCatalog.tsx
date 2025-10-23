import { useState, useEffect } from "react";
import { useCart } from "../cart/CartContext";
import { Product } from "../types/Product";
import { productApi, ProductApiError } from "../services/productApi";
import ProductCard from "./ProductCard";
import ProductGrid from "./ProductGrid";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";

function ProductCatalog() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productApi.getAllProducts();
        setProducts(data);
      } catch (err) {
        if (err instanceof ProductApiError) {
          setError(err.message);
        } else {
          setError("Failed to load products. Please try again later.");
        }
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </ProductGrid>
  );
}

export default ProductCatalog;
