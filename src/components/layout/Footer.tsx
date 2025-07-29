import React from 'react';

/**
 * Footer link interface
 */
export interface FooterLink {
  /** Link label */
  label: string;
  /** Link URL or path */
  href: string;
  /** Callback when link is clicked */
  onClick?: () => void;
}

/**
 * Footer section interface
 */
export interface FooterSection {
  /** Section title */
  title: string;
  /** Array of links in this section */
  links: FooterLink[];
}

/**
 * Social media link interface
 */
export interface SocialLink {
  /** Platform name */
  platform: string;
  /** Platform URL */
  href: string;
  /** Platform icon (emoji or component) */
  icon: React.ReactNode;
  /** Callback when link is clicked */
  onClick?: () => void;
}

/**
 * Props interface for the Footer component
 */
export interface FooterProps {
  /** Site/brand name */
  siteName?: string;
  /** Footer description/tagline */
  description?: string;
  /** Copyright year */
  copyrightYear?: number;
  /** Footer sections with links */
  sections?: FooterSection[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Newsletter signup callback */
  onNewsletterSignup?: (email: string) => void;
  /** Whether to show newsletter signup */
  showNewsletter?: boolean;
  /** Newsletter signup loading state */
  newsletterLoading?: boolean;
  /** Additional footer content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Footer component for site-wide footer content
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Footer 
 *   siteName="My Store"
 *   description="Your trusted online marketplace"
 * />
 * 
 * // With sections and social links
 * <Footer 
 *   siteName="My Store"
 *   sections={[
 *     {
 *       title: "Shop",
 *       links: [
 *         { label: "All Products", href: "/products" },
 *         { label: "Categories", href: "/categories" }
 *       ]
 *     },
 *     {
 *       title: "Support", 
 *       links: [
 *         { label: "Help Center", href: "/help" },
 *         { label: "Contact", href: "/contact" }
 *       ]
 *     }
 *   ]}
 *   socialLinks={[
 *     { platform: "Twitter", href: "https://twitter.com", icon: "🐦" },
 *     { platform: "Facebook", href: "https://facebook.com", icon: "📘" }
 *   ]}
 * />
 * 
 * // With newsletter signup
 * <Footer 
 *   siteName="My Store"
 *   showNewsletter={true}
 *   onNewsletterSignup={(email) => subscribeToNewsletter(email)}
 * />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  siteName = "Product Catalog",
  description = "Your trusted online shopping destination",
  copyrightYear = new Date().getFullYear(),
  sections = [],
  socialLinks = [],
  onNewsletterSignup,
  showNewsletter = false,
  newsletterLoading = false,
  children,
  className = '',
}) => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNewsletterSignup && newsletterEmail.trim()) {
      onNewsletterSignup(newsletterEmail.trim());
      setNewsletterEmail('');
    }
  };

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-4">{siteName}</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                {description}
              </p>
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-gray-200">
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        onClick={(e) => {
                          if (social.onClick) {
                            e.preventDefault();
                            social.onClick();
                          }
                        }}
                        className="text-gray-400 hover:text-white transition-colors text-xl"
                        aria-label={social.platform}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Sections */}
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4 className="text-sm font-semibold mb-4 text-gray-200">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                          }
                        }}
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Signup */}
            {showNewsletter && (
              <div>
                <h4 className="text-sm font-semibold mb-4 text-gray-200">
                  Newsletter
                </h4>
                <p className="text-gray-300 text-sm mb-4">
                  Get the latest updates and offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading || !newsletterEmail.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Additional Content */}
          {children && (
            <div className="mt-8 pt-8 border-t border-gray-800">
              {children}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {copyrightYear} {siteName}. All rights reserved.
            </p>
            
            {/* Legal Links */}
            <div className="flex space-x-6">
              <a 
                href="/privacy" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a 
                href="/cookies" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;