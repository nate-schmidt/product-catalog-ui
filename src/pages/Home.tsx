import React from "react";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function Home(): React.ReactElement {
  return (
    <main className="max-w-7xl mx-auto p-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </main>
  );
}