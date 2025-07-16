import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  image: string;
  inventory: number;
  active: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    image: '',
    inventory: '0',
    tags: '',
    active: true
  });

  const AUTH_TOKEN = 'Bearer admin-secret';

  const categories = ['Laptops', 'Phones', 'Headphones', 'Wearables', 'TVs', 'Gaming', 'Home', 'Audio', 'Cameras', 'Drones'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products', {
        headers: { 'Authorization': AUTH_TOKEN }
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
          inventory: parseInt(formData.inventory),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          active: formData.active
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      // Reset form and refresh list
      setFormData({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        category: '',
        image: '',
        inventory: '0',
        tags: '',
        active: true
      });
      setShowAddForm(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setError('');
    
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
          inventory: parseInt(formData.inventory),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          active: formData.active
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        salePrice: '',
        category: '',
        image: '',
        inventory: '0',
        tags: '',
        active: true
      });
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      salePrice: product.salePrice?.toString() || '',
      category: product.category,
      image: product.image,
      inventory: product.inventory.toString(),
      tags: product.tags.join(', '),
      active: product.active
    });
    setShowAddForm(false);
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({ active: !currentStatus })
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      fetchProducts();
    } catch (err) {
      setError('Failed to update product status');
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': AUTH_TOKEN }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading products...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Product Management</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              salePrice: '',
              category: '',
              image: '',
              inventory: '0',
              tags: '',
              active: true
            });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300">
          {error}
        </div>
      )}

      {/* Add/Edit Product Form */}
      {(showAddForm || editingProduct) && (
        <form onSubmit={editingProduct ? updateProduct : createProduct} className="mb-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            {editingProduct ? 'Edit Product' : 'Create New Product'}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sale Price ($)</label>
              <input
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Inventory</label>
              <input
                type="number"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="e.g., laptop, gaming, new"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-400">Active (visible to customers)</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    salePrice: '',
                    category: '',
                    image: '',
                    inventory: '0',
                    tags: '',
                    active: true
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-800">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  product.active 
                    ? 'bg-green-900/50 text-green-400' 
                    : 'bg-red-900/50 text-red-400'
                }`}>
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-2">
                {product.salePrice ? (
                  <>
                    <span className="text-xl font-bold text-green-400">${product.salePrice}</span>
                    <span className="text-sm text-gray-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-white">${product.price}</span>
                )}
              </div>
              
              <div className="text-sm text-gray-500 mb-3">
                <span className="mr-3">Stock: {product.inventory}</span>
                <span>Category: {product.category}</span>
              </div>
              
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleProductStatus(product.id, product.active)}
                  className="flex-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  {product.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteProduct(product.id, product.name)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">No products found. Create your first product!</p>
      )}
    </div>
  );
}