### Pill

**Purpose**: A small, rounded label used to display a category, status, or count.

### Props

- **label**: string — Text shown inside the pill.
- **variant**: 'default' | 'success' | 'warning' | 'danger' | 'info' — Color/style.
- **selected**: boolean — Whether the pill is in a selected state.
- **onClick**: (event) => void — Click handler (optional).
- **disabled**: boolean — When true, the pill is non-interactive.
- **className**: string — Optional extra class names.

### Usage

```tsx
import { Pill } from './Pill';

export function Example() {
  return (
    <div className="flex gap-2">
      <Pill label="All" variant="default" selected />
      <Pill label="In Stock" variant="success" />
      <Pill label="Sale" variant="warning" />
    </div>
  );
}
```

### Behavior

- Selected pills appear with higher contrast and a visible outline.
- Disabled pills have reduced opacity and no hover/focus styles.
- When `onClick` is provided, the pill is rendered as a button; otherwise as a span.

### Accessibility

- When interactive, render as a `button` with `aria-pressed={selected}`.
- Ensure focus styles are visible and keyboard operable (Enter/Space).
- Provide accessible names via `label`.

### Styling

- Rounded full, inline-flex alignment, small padding.
- Variants map to semantic colors; keep sufficient contrast.

### Testing

- Render with different `variant`s and assert class changes.
- Verify `onClick` fires only when not `disabled`.
- Snapshot for selected vs unselected.

### Examples

```tsx
<Pill label="New" variant="info" />
<Pill label="Low Stock" variant="warning" />
<Pill label="Sold Out" variant="danger" disabled />
```

