export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItem {
  name: string;
  sku: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateInventoryItem {
  name?: string;
  sku?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
  imageUrl?: string;
}
