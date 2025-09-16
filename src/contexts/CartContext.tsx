import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, SearchFilters, ProductFilters } from '../types/product';
import { CouponSummary, CouponValidationResponse } from '../types/coupon';
import { productService } from '../services/productService';
import { couponService } from '../services/couponService';
import { getUserFriendlyErrorMessage } from '../utils/errorHandler';

interface CartContextType {
  // Cart functionality
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  
  // Coupon functionality
  couponCode: string;
  appliedCoupon: CouponSummary | null;
  discountAmount: number;
  couponError: string | null;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  
  // Product management
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Search and filtering
  searchTerm: string;
  filters: SearchFilters;
  availableFilters: ProductFilters | null;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  
  // API actions
  loadProducts: () => Promise<void>;
  searchProducts: (searchFilters?: SearchFilters) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponSummary | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [availableFilters, setAvailableFilters] = useState<ProductFilters | null>(null);

  // Load products from API
  const loadProducts = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, filtersData] = await Promise.all([
        productService.getAllProducts(),
        productService.getProductFilters()
      ]);
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      setAvailableFilters(filtersData);
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search products with filters
  const searchProducts = async (searchFilters?: SearchFilters): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = searchFilters || filters;
      let results: Product[];

      // If we have a search term, use name search
      if (searchTerm.trim()) {
        results = await productService.searchByName(searchTerm.trim());
        
        // Apply additional filters to search results
        if (Object.keys(currentFilters).length > 0) {
          results = results.filter(product => {
            if (currentFilters.category && product.category !== currentFilters.category) return false;
            if (currentFilters.material && product.material !== currentFilters.material) return false;
            if (currentFilters.color && product.color !== currentFilters.color) return false;
            if (currentFilters.minPrice && product.price < currentFilters.minPrice) return false;
            if (currentFilters.maxPrice && product.price > currentFilters.maxPrice) return false;
            if (currentFilters.inStock !== undefined && product.inStock !== currentFilters.inStock) return false;
            return true;
          });
        }
      } else if (Object.keys(currentFilters).length > 0) {
        // Use filter-based search
        results = await productService.searchProducts(currentFilters);
      } else {
        // No search term or filters, get all products
        results = await productService.getAllProducts();
      }
      
      setFilteredProducts(results);
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
      console.error('Failed to search products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh products (reload all data)
  const refreshProducts = async (): Promise<void> => {
    await loadProducts();
    if (searchTerm || Object.keys(filters).length > 0) {
      await searchProducts();
    }
  };

  // Cart functions
  const addToCart = (product: Product) => {
    // Check stock before adding
    if (!product.inStock || product.stock <= 0) {
      setError(`${product.name} is out of stock`);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if we can add more
        if (existingItem.quantity >= product.stock) {
          setError(`Cannot add more ${product.name}. Only ${product.stock} in stock.`);
          return prevItems;
        }
        
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    // Clear any previous errors
    setError(null);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      setError(`Cannot set quantity to ${quantity}. Only ${product.stock} in stock.`);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
    
    setError(null);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    return subtotal - discountAmount;
  };

  const clearCart = () => {
    setCartItems([]);
    // Clear coupon when cart is cleared
    removeCoupon();
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  // Coupon functions
  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (cartItems.length === 0) {
      setCouponError('Add items to your cart before applying a coupon');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const response: CouponValidationResponse = await couponService.validateCoupon(code, cartItems);
      
      if (response.valid) {
        setCouponCode(code.trim().toUpperCase());
        setAppliedCoupon(response.coupon);
        setDiscountAmount(response.discountAmount);
        setCouponError(null);
      } else {
        setCouponError(response.messages.join(', '));
        setCouponCode(code.trim().toUpperCase()); // Keep the code in the field
      }
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setCouponError(errorMessage);
      console.error('Failed to apply coupon:', err);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponError(null);
  };

  // Re-validate coupon when cart changes
  const revalidateCoupon = async () => {
    if (appliedCoupon && cartItems.length > 0) {
      try {
        const response: CouponValidationResponse = await couponService.validateCoupon(
          appliedCoupon.code, 
          cartItems
        );
        
        if (!response.valid) {
          // Coupon is no longer valid, remove it
          removeCoupon();
          setError(`Coupon ${appliedCoupon.code} is no longer valid: ${response.messages.join(', ')}`);
        } else {
          // Update discount amount if it changed
          setDiscountAmount(response.discountAmount);
        }
      } catch (err) {
        console.error('Failed to revalidate coupon:', err);
        // Don't remove coupon on API error, just log it
      }
    } else if (appliedCoupon && cartItems.length === 0) {
      // Cart is empty, remove coupon
      removeCoupon();
    }
  };

  // Update search term handler
  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  // Update filters handler
  const handleSetFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Trigger search when search term or filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  // Re-validate coupon when cart items change
  useEffect(() => {
    revalidateCoupon();
  }, [cartItems]);

  const value: CartContextType = {
    // Cart functionality
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getTotalPrice,
    clearCart,
    
    // Coupon functionality
    couponCode,
    appliedCoupon,
    discountAmount,
    couponError,
    isApplyingCoupon,
    applyCoupon,
    removeCoupon,
    
    // Product management
    products,
    filteredProducts,
    loading,
    error,
    
    // Search and filtering
    searchTerm,
    filters,
    availableFilters,
    setSearchTerm: handleSetSearchTerm,
    setFilters: handleSetFilters,
    clearFilters,
    
    // API actions
    loadProducts,
    searchProducts,
    refreshProducts,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};