# Flash Sales Feature

This document describes the flash sales feature implementation for the ecommerce website.

## Overview

The flash sales feature enables time-limited, high-discount sales on products. It includes:

- ⚡ **Real-time countdown timers** for urgency
- 🔥 **Dynamic pricing** with percentage-based discounts
- 📊 **Stock tracking** with visual progress bars
- 🎯 **Multiple sale states** (upcoming, active, expired)
- 🎨 **Beautiful UI components** with animations

## Features

### Core Functionality
- **Flash Sale Management**: Create and manage time-limited sales
- **Real-time Updates**: Automatic refresh of sale statuses and timers
- **Stock Limitations**: Optional quantity limits per flash sale
- **Validation**: Comprehensive validation for sale parameters
- **Status Tracking**: Real-time status calculation (active, upcoming, expired)

### User Interface
- **Flash Sale Banners**: Eye-catching promotional banners
- **Product Cards**: Special flash sale product display
- **Countdown Timers**: Real-time countdown with urgency indicators
- **Progress Bars**: Visual stock depletion indicators
- **Responsive Design**: Works on all device sizes

## API Endpoints

- `GET /api/flash-sales` - Get all flash sales with status
- `GET /api/flash-sales/active` - Get currently active flash sales
- `GET /api/flash-sales/upcoming` - Get upcoming flash sales
- `GET /api/flash-sales/:id` - Get specific flash sale details
- `GET /api/products` - Get all products

## File Structure

```
src/
├── types/
│   └── flashSales.ts          # TypeScript interfaces
├── data/
│   └── mockData.ts            # Mock data for demo
├── components/
│   ├── CountdownTimer.tsx     # Reusable countdown component
│   ├── FlashSaleBanner.tsx    # Promotional banner component
│   ├── FlashSaleCard.tsx      # Product card with flash sale info
│   └── ProductCatalog.tsx     # Product grid with filtering
├── utils/
│   └── flashSaleUtils.ts      # Utility functions and validation
├── App.tsx                    # Main application component
└── index.tsx                  # Server with API endpoints
```

## Key Components

### FlashSaleBanner
Large promotional banner for featured flash sales with:
- Gradient backgrounds
- Real-time countdown timers
- Stock progress indicators
- Call-to-action buttons

### FlashSaleCard
Product card specifically designed for flash sales:
- Discount badges
- Original vs. flash pricing
- Stock depletion progress
- Status indicators (live, coming soon, ended)

### CountdownTimer
Reusable timer component with:
- Multiple size variants (small, medium, large)
- Urgency styling (normal, urgent)
- Automatic updates every second
- Expiration callbacks

### ProductCatalog
Product grid with filtering:
- Filter by flash sales, regular products, or all
- Automatic switching between flash sale and regular cards
- Real-time updates

## Usage

### Running the Application

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

### Creating Flash Sales

Flash sales are currently managed through the mock data in `src/data/mockData.ts`. In a production environment, you would:

1. Add admin interface for creating flash sales
2. Connect to a real database
3. Implement inventory management
4. Add user authentication and cart functionality

### Customizing Flash Sales

To customize flash sale behavior, modify:

- **Validation rules**: Edit `src/utils/flashSaleUtils.ts`
- **UI styling**: Update component CSS classes
- **Mock data**: Modify `src/data/mockData.ts`
- **API logic**: Update endpoints in `src/index.tsx`

## Demo Data

The application includes demo flash sales:

1. **🎧 Premium Headphones** - 40% off, currently active
2. **☕ Coffee Flash Sale** - 50% off, currently active  
3. **✨ Beauty Flash Sale** - 60% off, currently active
4. **⌚ Smart Watch Deal** - 35% off, starting soon

## Technical Details

### Time Management
- All times are handled in UTC and converted for display
- Automatic status updates every 30 seconds
- Real-time countdown timers update every second

### Performance
- Efficient re-renders using React state management
- Parallel API calls for better loading performance
- Optimized component updates

### Validation
- Comprehensive flash sale validation
- Time overlap detection for same products
- Stock and pricing validation
- Duration limits (15 minutes to 24 hours)

## Future Enhancements

- User authentication and personalized flash sales
- Email/SMS notifications for upcoming sales
- Admin dashboard for managing flash sales
- Analytics and reporting
- Integration with payment systems
- Mobile app support
- Social sharing features

## Browser Support

The flash sales feature works on all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Fetch API
- Date/Time APIs

---

🚀 **Ready to launch flash sales!** The feature is fully functional and ready for production use with a real database and authentication system.