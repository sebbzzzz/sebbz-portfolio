## Why

The text panel overlay on the homepage uses a plain semi-transparent background (`bg-canvas/80`) that lacks visual depth. Replacing it with an Apple-style glassmorphism effect will make the panel feel light and modern — consistent with the animated, visual-forward aesthetic of the particle canvas backdrop.

## What Changes

- Replace the solid `bg-canvas/80` background on the text panel with a frosted-glass surface using `backdrop-filter: blur`, a subtle border, and a refined translucent fill.
- Add a soft inner highlight (top edge light streak) to reinforce the glass illusion.
- Ensure the effect degrades gracefully on browsers that don't support `backdrop-filter`.

## Capabilities

### New Capabilities

- `glass-panel`: Reusable glassmorphism surface — blur backdrop, translucent fill, subtle border and shadow — applied to the homepage text panel.

### Modified Capabilities

<!-- None -->

## Impact

- `app/page.tsx` — update section className (remove `bg-canvas/80`, apply glass panel styles)
- `app/page.scss` or `app/globals.scss` — add `.glass-panel` utility or Tailwind CSS custom variant
- No new dependencies; uses native CSS `backdrop-filter` + Tailwind utilities
