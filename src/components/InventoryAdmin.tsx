import { useState, useEffect } from "react";
import type { InventoryItem, CreateInventoryItem } from "../types/inventory";

export function InventoryAdmin() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<CreateInventoryItem>({
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    price: 0,
    category: "",
    imageUrl: "",
  });

  // Fetch inventory items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/inventory/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update item");
      } else {
        // Create new item
        const response = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to create item");
      }
      
      await fetchItems();
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete item");
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Open form for creating new item
  const openCreateForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      quantity: 0,
      price: 0,
      category: "",
      imageUrl: "",
    });
    setEditingItem(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing item
  const openEditForm = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      sku: item.sku,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || "",
    });
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Close form
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      sku: "",
      description: "",
      quantity: 0,
      price: 0,
      category: "",
      imageUrl: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-400">
            Manage your product inventory
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
        >
          + Add New Item
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-400 mt-4">Loading inventory...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Items</h3>
              <p className="text-3xl font-bold text-white">{items.length}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Units</h3>
              <p className="text-3xl font-bold text-white">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Value</h3>
              <p className="text-3xl font-bold text-white">
                ${items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Inventory table */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No inventory items found. Click "Add New Item" to get started.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-white">{item.name}</div>
                              <div className="text-sm text-gray-400 line-clamp-1">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{item.sku}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            item.quantity < 20 ? 'text-red-400' : 
                            item.quantity < 50 ? 'text-yellow-400' : 
                            'text-green-400'
                          }`}>
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openEditForm(item)}
                            className="text-blue-400 hover:text-blue-300 font-medium mr-4 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {editingItem ? "Update Item" : "Create Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
