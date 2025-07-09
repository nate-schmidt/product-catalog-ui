import React from "react";
import type { Product } from "../data/products";
import { useCart } from "../contexts/CartContext";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">
            ${(product.price / 100).toFixed(2)}
          </span>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAdd}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}