# UI Components

Core reusable user interface components built with React, TypeScript, and Tailwind CSS.

## Components

### Button

A versatile button component with multiple variants, sizes, and states.

**Features:**
- 5 variants: primary, secondary, outline, ghost, destructive
- 4 sizes: sm, md, lg, xl
- Loading states with spinner
- Icon support (start/end icons)
- Full width option
- Disabled states

**Usage:**
```tsx
import { Button } from '@/components/ui';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="primary" size="lg">Large Primary</Button>

// With loading state
<Button loading>Saving...</Button>

// With icons
<Button startIcon={<PlusIcon />}>Add Item</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Card

A flexible container component for grouping related content.

**Features:**
- 4 variants: default, outlined, elevated, filled
- Interactive hover effects
- Composed sections: Header, Body, Footer
- Overflow handling

**Usage:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

<Card variant="elevated">
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content goes here...</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input

A comprehensive form input component with validation and styling options.

**Features:**
- 3 variants: default, filled, outlined
- 3 sizes: sm, md, lg
- Label and helper text support
- Error state handling
- Icon support (start/end icons)
- Auto-generated IDs for accessibility

**Usage:**
```tsx
import { Input } from '@/components/ui';

// Basic usage
<Input placeholder="Enter your name" />

// With label and helper text
<Input 
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>

// With error state
<Input 
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  hasError
/>

// With icons
<Input 
  placeholder="Search..."
  startIcon={<SearchIcon />}
  endIcon={<FilterIcon />}
/>
```

### Badge

Small status indicators and labels for highlighting information.

**Features:**
- 6 variants: default, primary, success, warning, error, info
- 3 sizes: sm, md, lg
- Dot indicator option
- Custom color support

**Usage:**
```tsx
import { Badge } from '@/components/ui';

// Basic usage
<Badge>New</Badge>

// With variants
<Badge variant="success">In Stock</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="error">Out of Stock</Badge>

// With dot indicator
<Badge dot variant="success">Active</Badge>

// Custom color
<Badge color="#8B5CF6">Custom Purple</Badge>
```

## Design System

### Color Variants

**Primary (Blue)**
- Used for main actions and primary content
- `bg-blue-600`, `text-blue-800`, etc.

**Secondary (Gray)**
- Used for secondary actions and neutral content
- `bg-gray-600`, `text-gray-800`, etc.

**Success (Green)**
- Used for positive states and success messages
- `bg-green-600`, `text-green-800`, etc.

**Warning (Yellow)**
- Used for caution states and warnings
- `bg-yellow-600`, `text-yellow-800`, etc.

**Error (Red)**
- Used for error states and destructive actions
- `bg-red-600`, `text-red-800`, etc.

### Size Scale

**Small (sm)**
- Compact components for dense layouts
- `px-3 py-1.5 text-sm`

**Medium (md)** - Default
- Standard size for most use cases
- `px-4 py-2 text-sm`

**Large (lg)**
- Prominent components for emphasis
- `px-6 py-3 text-base`

**Extra Large (xl)**
- Hero components and major actions
- `px-8 py-4 text-lg`

## Accessibility

All UI components follow accessibility best practices:

- **Semantic HTML** - Proper element types and structure
- **ARIA Labels** - Descriptive labels for screen readers
- **Focus Management** - Visible focus indicators and keyboard navigation
- **Color Contrast** - WCAG AA compliant color combinations
- **Form Associations** - Proper label/input relationships

## Customization

### Using className prop
```tsx
<Button className="my-custom-class">Custom Button</Button>
```

### CSS Overrides
```css
.my-custom-button {
  @apply bg-purple-600 hover:bg-purple-700;
}
```

### Tailwind Configuration
Modify `tailwind.config.js` to customize the design system:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-color',
          600: '#your-color',
          700: '#your-color',
        }
      }
    }
  }
}
```

## TypeScript Interfaces

All components export their prop interfaces for easy extension:

```tsx
import { ButtonProps, CardProps } from '@/components/ui';

// Extend existing props
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}

// Use in component
const CustomButton: React.FC<CustomButtonProps> = (props) => {
  return <Button {...props} />;
};
```