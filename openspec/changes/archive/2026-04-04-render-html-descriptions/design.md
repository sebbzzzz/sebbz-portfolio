## Context

`CarouselItemInfoPanel` renders `item.description` via a plain `<p>` tag. Some descriptions in `PORTFOLIO_ITEMS` contain raw HTML anchor tags (e.g. `<a href='...' target='_blank' rel='noopener noreferrer'>Studio Name</a>`). React's JSX escapes string content by default, so these tags appear as literal text instead of rendered links.

The `PortfolioItem.description` field is a `string` that can contain arbitrary HTML fragments — the type will not change, but the rendering layer must treat it as markup.

## Goals / Non-Goals

**Goals:**

- Render `<a>` tags and other HTML within `description` fields as real DOM elements.
- Preserve XSS safety — only trusted, internal content is rendered.
- Minimal footprint — one component change, one new dependency.

**Non-Goals:**

- Sanitizing arbitrary user-supplied HTML (all content is authored at build time in `page.tsx`).
- Changing the `PortfolioItem` type.
- Converting descriptions to MDX or a richer format.

## Decisions

### Decision: Use `html-react-parser` over `dangerouslySetInnerHTML`

**Chosen**: `html-react-parser` package.

**Alternatives considered**:

1. `dangerouslySetInnerHTML` — simplest, but couples raw HTML injection to the component and provides no React tree (event handlers, component substitution impossible later). Naming signals danger and discourages future teammates.
2. Custom regex-based parser — fragile, not worth maintaining for a known-safe use case.
3. `dompurify` + `dangerouslySetInnerHTML` — adds sanitization but still bypasses React's element model; overkill since content is authored in-repo.

`html-react-parser` converts HTML strings to React elements, integrates naturally with JSX, and is the standard lightweight choice for this pattern in Next.js apps. Content is 100% internal/authored so sanitization is not required.

### Decision: Keep rendering local to `CarouselItemInfoPanel`

The HTML description field is only rendered in one place. Per the scope rule (used 1 place → keep local), no shared utility component is created. The `parse` call stays inside the component file.

## Risks / Trade-offs

- [Risk] Future description content with malicious HTML → No sanitization in place. **Mitigation**: Content is authored in `page.tsx` at build time by the developer, not user-supplied. If descriptions ever become user-editable, add `dompurify` at that point.
- [Risk] `html-react-parser` version mismatch with React 19 → **Mitigation**: Verify peer deps before install; package has supported React 18/19 since v3.
