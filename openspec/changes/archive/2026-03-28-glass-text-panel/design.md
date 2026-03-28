## Context

The homepage text panel sits over the particle canvas using absolute positioning. Currently `bg-canvas/80` provides a solid semi-transparent dark fill. We want an Apple-style frosted glass — `backdrop-filter: blur` composited over the canvas layer — giving the panel a luminous, depth-rich appearance.

## Goals / Non-Goals

**Goals:**

- Frosted glass surface with blur, translucent fill, soft border, and subtle shadow on the text panel
- Graceful fallback for browsers without `backdrop-filter` support (solid semi-transparent fill)
- Keep styles colocated and maintainable — prefer a SCSS utility class `.glass-panel` over cluttered inline Tailwind strings

**Non-Goals:**

- Making `glass-panel` a global design-system component for use elsewhere (can evolve later)
- Animated blur transitions or dynamic opacity

## Decisions

### 1 — SCSS utility class over Tailwind arbitrary values

`backdrop-filter: blur(20px)` with a refined translucent fill, border, and box-shadow requires several co-dependent properties. Authoring this as a `.glass-panel` class in `page.scss` is cleaner than stringing together `backdrop-blur-[20px] bg-white/10 border border-white/20 shadow-[...]` in JSX.

**Alternative considered**: Tailwind `@utility glass-panel` in `tailwind.css`. Rejected for now — this is a single-use style with no cross-component reuse yet.

### 2 — CSS `@supports (backdrop-filter: blur(1px))` fallback

Wrap glass styles in `@supports` so unsupported browsers (old Chrome on Android, some Firefox configs) receive the existing solid fill.

### 3 — Visual recipe (Apple HIG-inspired)

| Property          | Value                                                              | Rationale                                                   |
| ----------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| `backdrop-filter` | `blur(20px) saturate(1.8)`                                         | Match Apple's typical frosted glass blur + saturation boost |
| `background`      | `rgba(255,255,255,0.08)`                                           | Light translucent fill over dark canvas                     |
| `border`          | `1px solid rgba(255,255,255,0.18)`                                 | Subtle highlight edge                                       |
| `box-shadow`      | `0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)` | Depth shadow + top-edge inner light streak                  |
| `border-radius`   | `16px`                                                             | Rounded pill consistent with Apple UI                       |

## Risks / Trade-offs

- **Blur performance on low-end devices** → The particle canvas already runs a rAF loop; adding `backdrop-filter` composite layer is negligible. Blur target is just the panel, not the full page.
- **`backdrop-filter` Safari quirks** → Safari requires `-webkit-backdrop-filter` as well. Include both prefixes.

## Open Questions

- None — recipe is well-established.
