# App Component Documentation

## Overview

`App` is the root React component for the Product Catalog UI.  It currently serves as a placeholder splash page while core e-commerce functionality is under development.

## Location

- File: `src/App.tsx`

## Props

`App` does **not** accept any props at this time.

## UI Structure

The component renders a centred container with the following hierarchy:

1. **Outer `div`** – sets the overall width, padding, and z-index.
2. **Flex container** – vertically stacks the heading and subtitle text.
3. **Heading (`<h1>`)** – displays the primary greeting.
4. **Paragraph (`<p>`)** – displays a short subtitle.

```tsx
<div className="max-w-7xl mx-auto p-8 text-center relative z-10">
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
    <h1 className="text-6xl font-bold text-white mb-4">Hello World! 👋</h1>
    <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
      One day I hope to be an ecommerce website.
    </p>
  </div>
</div>
```

## Styling

Styling is applied via Tailwind CSS utility classes included directly in the JSX.  Global styles and Tailwind configuration are imported through `src/index.css`.

## Accessibility

- The main heading uses an `<h1>` element, ensuring proper document outline.
- Text colours meet contrast ratios against the gradient background (see design tokens).

## Future Extension Points

- Replace the placeholder content with operational e-commerce components such as `ProductCatalog` and `Cart`.
- Accept props to control greeting text or render alternate landing experiences.
- Add responsive tweaks for smaller screens once additional layout elements are introduced.

## Testing

Unit tests live alongside the component at `src/App.test.tsx` and currently verify:

- Successful rendering without errors.
- Presence of heading and subtitle text.
- Correct application of key Tailwind classes.

Run the test suite with:

```bash
bun test
```

---

_Last updated: {{DATE}}_