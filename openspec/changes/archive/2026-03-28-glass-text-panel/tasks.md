## 1. Add glass panel styles

- [x] 1.1 Add `.glass-panel` class to `app/page.scss` with `backdrop-filter: blur(20px) saturate(1.8)`, `-webkit-backdrop-filter`, translucent fill `rgba(255,255,255,0.08)`, border `1px solid rgba(255,255,255,0.18)`, box-shadow (depth + inner light streak), and `border-radius: 16px`
- [x] 1.2 Wrap blur-dependent properties in `@supports (backdrop-filter: blur(1px))` with a solid fallback outside

## 2. Apply to homepage panel

- [x] 2.1 In `app/page.tsx`, replace `bg-canvas/80` on the text panel `<section>` with the `.glass-panel` class (keep positioning and spacing classes)

## 3. QA

- [x] 3.1 Run `yarn typecheck && yarn lint:fix && yarn format:write` and confirm no errors
