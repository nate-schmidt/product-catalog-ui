import ProductCard from "./ProductCard";
import { Product } from "../types";

const products: Product[] = [
  {
    id: "1",
    name: "Stylish Backpack",
    description: "A lightweight backpack perfect for everyday use and travel.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1514474959185-14727f0d0988?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Experience high-fidelity sound with active noise cancellation.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1580894746907-744868495be0?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: "3",
    name: "Smart Watch",
    description: "Track your workouts and stay connected on the go.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1516264666406-6cfcd4a3fe5e?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: "4",
    name: "Minimalist Chair",
    description: "Comfort and style blended into a modern design.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=60",
  },
];

export default function ProductCatalog() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark mb-8 text-center">
          Products
        </h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}