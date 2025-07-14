export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Basic T-Shirt",
    price: 19.99,
    description: "Comfortable cotton tee",
  },
  {
    id: "2",
    name: "Hoodie",
    price: 39.99,
    description: "Cozy pullover hoodie",
  },
  {
    id: "3",
    name: "Cap",
    price: 14.99,
    description: "Adjustable baseball cap",
  },
];