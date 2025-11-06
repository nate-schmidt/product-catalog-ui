export interface ProductDimensions {
  width: number | null;
  height: number | null;
  depth: number | null;
  unit: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  dimensions: ProductDimensions | null;
  material: string | null;
  color: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

