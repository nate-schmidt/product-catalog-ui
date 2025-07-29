import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

/**
 * Props interface for the Header component
 */
export interface HeaderProps {
  /** Site/brand name */
  siteName?: string;
  /** Whether to show the search bar */
  showSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Current search value */
  searchValue?: string;
  /** Whether to show cart icon with item count */
  showCart?: boolean;
  /** Number of items in cart */
  cartItemCount?: number;
  /** Whether to show user account menu */
  showUserMenu?: boolean;
  /** User's display name (if logged in) */
  userName?: string;
  /** Whether user is logged in */
  isLoggedIn?: boolean;
  /** Navigation links */
  navigationLinks?: NavigationLink[];
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
  /** Callback when search is submitted */
  onSearchSubmit?: (value: string) => void;
  /** Callback when cart is clicked */
  onCartClick?: () => void;
  /** Callback when login is clicked */
  onLoginClick?: () => void;
  /** Callback when logout is clicked */
  onLogoutClick?: () => void;
  /** Callback when user profile is clicked */
  onProfileClick?: () => void;
  /** Callback when site logo/name is clicked */
  onLogoClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation link interface
 */
export interface NavigationLink {
  /** Link label */
  label: string;
  /** Link URL or path */
  href: string;
  /** Whether this link is currently active */
  active?: boolean;
  /** Callback when link is clicked */
  onClick?: () => void;
}

/**
 * Header component for site navigation and branding
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Header 
 *   siteName="My Store"
 *   cartItemCount={3}
 *   onCartClick={() => openCart()}
 * />
 * 
 * // With search and navigation
 * <Header 
 *   siteName="My Store"
 *   showSearch={true}
 *   searchValue={searchTerm}
 *   onSearchChange={(value) => setSearchTerm(value)}
 *   onSearchSubmit={(value) => performSearch(value)}
 *   navigationLinks={[
 *     { label: 'Home', href: '/', active: true },
 *     { label: 'Products', href: '/products' },
 *     { label: 'About', href: '/about' }
 *   ]}
 * />
 * 
 * // With user authentication
 * <Header 
 *   siteName="My Store"
 *   isLoggedIn={true}
 *   userName="John Doe"
 *   onLogoutClick={() => logout()}
 *   onProfileClick={() => navigate('/profile')}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  siteName = "Product Catalog",
  showSearch = true,
  searchPlaceholder = "Search products...",
  searchValue = "",
  showCart = true,
  cartItemCount = 0,
  showUserMenu = true,
  userName,
  isLoggedIn = false,
  navigationLinks = [],
  onSearchChange,
  onSearchSubmit,
  onCartClick,
  onLoginClick,
  onLogoutClick,
  onProfileClick,
  onLogoClick,
  className = '',
}) => {
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchValue);
    }
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button
              onClick={onLogoClick}
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {siteName}
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          {navigationLinks.length > 0 && (
            <nav className="hidden md:flex space-x-8">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className={`text-sm font-medium transition-colors ${
                    link.active
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Search Bar - Desktop */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit}>
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  startIcon={<span>🔍</span>}
                  className="w-full"
                />
              </form>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
                aria-label="Shopping cart"
              >
                <span className="text-xl">🛒</span>
                {cartItemCount > 0 && (
                  <Badge
                    variant="error"
                    size="sm"
                    className="absolute -top-1 -right-1 min-w-[1.25rem] h-5"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </button>
            )}

            {/* User Menu */}
            {showUserMenu && (
              <div className="flex items-center space-x-2">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    {userName && (
                      <span className="hidden sm:block text-sm text-gray-700">
                        Hello, {userName}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onProfileClick}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLogoutClick}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onLoginClick}
                  >
                    Login
                  </Button>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
              aria-label="Open menu"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                startIcon={<span>🔍</span>}
                className="w-full"
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {navigationLinks.length > 0 && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    link.active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;