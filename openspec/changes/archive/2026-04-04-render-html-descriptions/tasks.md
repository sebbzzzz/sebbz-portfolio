## 1. Dependency

- [x] 1.1 Install `html-react-parser` package (`yarn add html-react-parser`)

## 2. Implementation

- [x] 2.1 In `CarouselItemInfoPanel.tsx`, import `parse` from `html-react-parser`
- [x] 2.2 Replace the `<p>` text content `{item.description}` with `{parse(item.description)}`

## 3. QA

- [x] 3.1 Run `yarn typecheck` — no type errors
- [x] 3.2 Run `yarn lint:fix` and `yarn format:write` — clean
- [ ] 3.3 Visually verify that anchors in descriptions (e.g. Hearst, Tinta Impresa) render as clickable links in the info panel
