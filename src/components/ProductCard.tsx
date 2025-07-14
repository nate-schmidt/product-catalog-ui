import React from "react";
import { Product } from "../data/products";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props): React.ReactElement {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col gap-4">
      <h3 className="text-xl font-semibold">{product.name}</h3>
      {product.description && <p className="text-gray-300 text-sm">{product.description}</p>}
      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
      <button
        onClick={() => addToCart(product)}
        className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}