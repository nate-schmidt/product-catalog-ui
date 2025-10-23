export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  stock: number;
  material?: string;
  color?: string;
}
