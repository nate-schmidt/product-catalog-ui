export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // price in cents
  image: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Wireless Headphones",
    description: "High-fidelity wireless noise-cancelling headphones.",
    price: 19999,
    image: "https://images.unsplash.com/photo-1585386959984-a41552281484?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: "p2",
    name: "Smart Watch",
    description: "Water-resistant smartwatch with health tracking.",
    price: 14999,
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb702cc?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: "p3",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with deep bass.",
    price: 8999,
    image: "https://images.unsplash.com/photo-1606813908633-a5f6220c2c2b?auto=format&fit=crop&w=600&q=60",
  },
];