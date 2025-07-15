import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';

/**
 * Product data structure
 */
export interface Product {
  /** Unique identifier */
  id: string;
  /** Product display name */
  name: string;
  /** Product description */
  description: string;
  /** Price in dollars */
  price: number;
  /** Product category */
  category: string;
  /** Product image URL */
  imageUrl?: string;
  /** Whether the product is in stock */
  inStock: boolean;
  /** Product dimensions (for furniture) */
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
}

/**
 * Props for individual ProductCard component
 */
interface ProductCardProps {
  /** Product to display */
  product: Product;
  /** Callback when add to cart is clicked */
  onAddToCart: (product: Product) => void;
}

/**
 * Individual product card component
 * @internal
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {product.imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        
        {product.dimensions && (
          <p className="text-gray-500 text-xs mb-4">
            Dimensions: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} {product.dimensions.unit}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddClick}
            disabled={!product.inStock || isAdding}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all
              ${product.inStock 
                ? isAdding 
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {!product.inStock ? 'Out of Stock' : isAdding ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Props for the ProductCatalog component
 */
interface ProductCatalogProps {
  /** Optional API endpoint to fetch products from */
  apiEndpoint?: string;
  /** Optional static products to display (used if apiEndpoint is not provided) */
  products?: Product[];
  /** Number of columns for the grid on different screen sizes */
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

/**
 * ProductCatalog Component
 * 
 * @component
 * @description A responsive product catalog grid that displays products with filtering
 * and search capabilities. Integrates with the CartContext for adding items to cart.
 * 
 * Features:
 * - Responsive grid layout
 * - Category filtering
 * - Search functionality
 * - Loading and error states
 * - Add to cart integration
 * - Out of stock handling
 * - Product dimensions display (for furniture)
 * 
 * @example
 * ```tsx
 * // Using with API endpoint
 * <ProductCatalog apiEndpoint="/api/products" />
 * 
 * // Using with static products
 * const products = [
 *   { id: '1', name: 'Sofa', price: 999, ... },
 *   { id: '2', name: 'Table', price: 499, ... }
 * ];
 * <ProductCatalog products={products} />
 * 
 * // Custom grid layout
 * <ProductCatalog 
 *   apiEndpoint="/api/products"
 *   gridCols={{ sm: 1, md: 2, lg: 4 }}
 * />
 * ```
 * 
 * @requires CartProvider - Must be wrapped in CartProvider to access cart functionality
 */
export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  apiEndpoint,
  products: staticProducts,
  gridCols = { sm: 1, md: 2, lg: 3 }
}) => {
  const [products, setProducts] = useState<Product[]>(staticProducts || []);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addItem } = useCart();

  /**
   * Fetch products from API
   */
  useEffect(() => {
    if (!apiEndpoint || staticProducts) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiEndpoint, staticProducts]);

  /**
   * Filter products based on search term and category
   */
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  /**
   * Get unique categories from products
   */
  const categories = ['all', ...new Set(products.map(p => p.category))];

  /**
   * Handle adding product to cart
   */
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Error loading products</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className={`
          grid gap-6
          grid-cols-${gridCols.sm || 1}
          md:grid-cols-${gridCols.md || 2}
          lg:grid-cols-${gridCols.lg || 3}
        `}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;