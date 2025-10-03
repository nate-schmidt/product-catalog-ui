# Flash Sales Feature

## Overview
A complete flash sales feature implementation for the Product UI, featuring time-limited sales with steep discounts, real-time countdown timers, and an attractive modern UI.

## Components Created

### 1. **Types** (`src/types/product.ts`)
- `Product` interface: Complete product data structure with pricing, inventory, and ratings
- `FlashSale` interface: Flash sale data structure with timing and product list

### 2. **CountdownTimer** (`src/components/CountdownTimer.tsx`)
- Real-time countdown display showing days, hours, minutes, and seconds
- Auto-updates every second
- Triggers callback when sale expires
- Beautiful gradient styling with animated elements
- Responsive design for mobile and desktop

### 3. **FlashSaleBadge** (`src/components/FlashSaleBadge.tsx`)
- Eye-catching discount badge with gradient background
- Animated lightning bolt icon
- Positioned absolutely on product cards
- Shows discount percentage

### 4. **ProductCard** (`src/components/ProductCard.tsx`)
- Complete product card with all details
- Flash sale badge integration
- Price comparison (original vs. sale price)
- Stock indicator with progress bar
- Star rating display
- Responsive hover effects
- "Add to Cart" button with gradient styling
- Low stock warning (when stock < 20)

### 5. **FlashSaleSection** (`src/components/FlashSaleSection.tsx`)
- Main flash sale display component
- Prominent countdown timer section
- Responsive grid layout for products (1-3 columns)
- Sale statistics display
- Handles expired sales with fallback UI
- Mobile-optimized spacing and typography

### 6. **Sample Data** (`src/data/flashSaleData.ts`)
- 6 sample products with real product images (via Unsplash)
- Various categories: Electronics, Wearables, Photography, Gaming, Audio, Accessories
- Flash sale configured to end 2 hours from current time
- Discounts ranging from 40-50%
- Varying stock levels to demonstrate urgency

## Features Implemented

✅ **Real-time Countdown**: Updates every second, shows time remaining
✅ **Steep Discounts**: Up to 50% off displayed prominently
✅ **Stock Urgency**: Visual progress bars and "Almost Gone!" warnings
✅ **Responsive Design**: Works beautifully on mobile, tablet, and desktop
✅ **Modern UI**: Gradients, animations, hover effects
✅ **Product Ratings**: 5-star rating system
✅ **Category Tags**: Products organized by category
✅ **Price Comparison**: Original price shown with strikethrough
✅ **Sale Expiration**: Automatically handles expired sales
✅ **Professional Images**: High-quality product photos

## Design Highlights

- **Color Scheme**: Dark theme with orange/red accent colors for urgency
- **Gradients**: Multiple gradient effects for modern look
- **Animations**: Subtle pulse effects, smooth transitions
- **Typography**: Bold, readable fonts with proper hierarchy
- **Spacing**: Generous padding and margins for clean layout
- **Shadows**: Elevated cards with dynamic shadows on hover

## Technical Implementation

- Built with **React 19** and **TypeScript**
- Styled with **Tailwind CSS 4**
- Uses React hooks (useState, useEffect) for state management
- Real-time timer updates with proper cleanup
- Responsive grid system using Tailwind's grid utilities
- Optimized images from Unsplash CDN

## Running the Application

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

## Customization

### To modify flash sale timing:
Edit `src/data/flashSaleData.ts` and adjust the `endTime` calculation.

### To add more products:
Add product objects to the `products` array in `src/data/flashSaleData.ts`.

### To change styling:
All components use Tailwind CSS classes which can be easily modified.

## Future Enhancements

Potential features to add:
- Backend API integration for real product data
- Shopping cart functionality
- User authentication
- Payment processing
- Multiple concurrent flash sales
- Email notifications for new sales
- Wishlist functionality
- Product filtering and sorting
- Product detail pages
