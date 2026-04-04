## Context

The portfolio is a Next.js 15 App Router single-page application. The homepage (`app/page.tsx`) is a Client Component (`"use client"`) and the root layout (`app/layout.tsx`) is a Server Component that exports the Next.js `Metadata` object. The current metadata is placeholder copy. There are no `robots.txt`, `sitemap.xml`, or structured data files. Interactive components (carousel, info panel) were built for visual fidelity; accessibility was not a primary concern. Images are loaded via raw `<img>` tags, bypassing Next.js image optimisation.

## Goals / Non-Goals

**Goals:**

- Ship with accurate, professional metadata (OG, Twitter Card, JSON-LD)
- Achieve a Lighthouse accessibility score ≥ 90 on the homepage
- Reduce LCP by switching thumbnail images to `next/image` and adding resource hints
- Provide search engines a sitemap and robots hint
- Fix keyboard navigation so the carousel and overlay are operable without a mouse

**Non-Goals:**

- Full WCAG 2.1 AA audit of every interactive state (scope is homepage only)
- Analytics or error-tracking integration
- i18n or language switching
- Server-side rendering of the carousel (it is inherently a client interaction)

## Decisions

### D1 — Metadata lives entirely in `app/layout.tsx`

Next.js 15 App Router resolves metadata from the nearest `generateMetadata` export or static `metadata` object up the segment tree. Since this is a single-page portfolio there is one canonical metadata location: `app/layout.tsx`. This avoids duplication and ensures all head tags are injected at build time (static, no hydration cost).

_Alternative considered_: A `generateMetadata` async function to pull copy from a CMS — rejected because all copy is static in the codebase and introduces unnecessary complexity.

### D2 — JSON-LD injected as a `<script>` tag in `RootLayout`

Person schema structured data is injected via `<script type="application/ld+json">` inside `<head>`. Next.js does not have a native metadata API for arbitrary JSON-LD, so we use a JSX `<script>` tag with `dangerouslySetInnerHTML`. This is the recommended pattern in the Next.js docs and is safe because the content is static (no user input).

### D3 — `robots.txt` and `sitemap.xml` as static files in `public/`

For a static, single-page portfolio a static `public/robots.txt` and `public/sitemap.xml` are sufficient. The Next.js file-based `app/robots.ts` and `app/sitemap.ts` API would be equivalent but adds indirection for no benefit here.

### D4 — Replace `<img>` with `next/image` for thumbnails only

Carousel thumbnails are the only bitmap images in the hot path. Icons are SVGs loaded as `<img src>` in `SocialLinks` and `InfiniteCarousel`; replacing those with `next/image` is unnecessary overhead. Demo videos are not images and are unaffected.

_Trade-off_: `next/image` requires explicit `width`/`height` or `fill` layout. Carousel items already have a fixed CSS size, so `fill` with `sizes` is the cleanest approach.

### D5 — Keyboard navigation for carousel via `keydown` on the scroll container

The carousel's drag/scroll container already receives pointer events. Adding `tabIndex={0}` and a `keydown` handler for `ArrowLeft`/`ArrowRight` (scroll) and `Enter`/`Space` (pin/unpin) is sufficient. A roving `tabIndex` across individual items is not needed because items are visually continuous and the scroll-snap behaviour makes discrete item focus redundant.

### D6 — ARIA roles: `role="list"` / `role="listitem"` on carousel

The carousel renders a sequence of portfolio items. `role="list"` on the track and `role="listitem"` on each item communicates this semantics to screen readers. Combined with `aria-label` on the section, screen readers will announce "Portfolio, list, N items."

## Risks / Trade-offs

- **`next/image` layout shift** → Use explicit `sizes` prop and set `priority` on the first 2–3 visible thumbnails to avoid LCP regression from lazy-loading above-the-fold images.
- **`dangerouslySetInnerHTML` for JSON-LD** → Content is fully static and author-controlled; no XSS vector. Document this in a code comment.
- **Carousel keyboard nav conflicts with page scroll** → `ArrowLeft`/`ArrowRight` inside the carousel container must call `e.preventDefault()` to avoid triggering horizontal page scroll on some browsers. Test on Chrome/Safari/Firefox.
- **`sitemap.xml` manually maintained** → If new pages are added, the sitemap must be updated. Acceptable for a portfolio with a single page.

## Migration Plan

1. All changes are additive or in-place replacements — no DB migrations, no API changes.
2. Deploy to staging, run Lighthouse audit, verify scores before production push.
3. Rollback: revert the relevant commits; no state to unwind.

## Open Questions

- Should canonical URL be hardcoded or driven by an env variable (`NEXT_PUBLIC_SITE_URL`)? Env var is safer for staging parity — decide before implementation.
- Is there a custom domain already configured? The `sitemap.xml` and OG `url` field need the final production URL.
