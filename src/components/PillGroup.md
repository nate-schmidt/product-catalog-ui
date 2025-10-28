### PillGroup

**Purpose**: Renders a horizontally-wrapping collection of `Pill` components to filter or categorize items.

### Props

- **items**: Array<{ id: string | number; label: string; variant?: string }>
- **selectedId**: string | number | null — Currently selected pill id.
- **onSelect**: (id: string | number | null) => void — Selection callback.
- **allowDeselect**: boolean — Allow clicking the selected pill to clear selection.
- **className**: string — Optional container classes.

### Usage

```tsx
import { PillGroup } from './PillGroup';

const items = [
  { id: 'all', label: 'All' },
  { id: 'stock', label: 'In Stock', variant: 'success' },
  { id: 'sale', label: 'Sale', variant: 'warning' },
];

export function Example() {
  const [selectedId, setSelectedId] = React.useState('all');
  return (
    <PillGroup
      items={items}
      selectedId={selectedId}
      onSelect={setSelectedId}
      allowDeselect
    />
  );
}
```

### Behavior

- Renders each item as a `Pill`.
- Clicking a pill calls `onSelect` with the item `id`.
- If `allowDeselect` is true and the selected pill is clicked, `onSelect(null)`.

### Accessibility

- Container has `role="list"`; pills have `role="listitem"` if not buttons.
- Ensure keyboard navigation and focus are supported.

### Styling

- Flex row with wrap and gap.
- Inherit `Pill` variant colors.

### Testing

- Assert selection toggles and deselect behavior.
- Verify selected pill has `aria-pressed=true` when interactive.

### Examples

```tsx
<PillGroup
  items={[
    { id: 1, label: 'All' },
    { id: 2, label: 'New', variant: 'info' },
  ]}
  selectedId={1}
  onSelect={(id) => console.log(id)}
  allowDeselect
/>
```

