## Why

The portfolio is functionally complete and visually polished, but several production-critical concerns — metadata richness, SEO discoverability, accessibility compliance, and Core Web Vitals — have not been addressed yet. These must be resolved before the site goes live to ensure it ranks well, is accessible to all users, and performs at the level expected of a professional portfolio.

## What Changes

- Replace placeholder metadata (title, description) with real, keyword-rich content derived from the portfolio's actual copy
- Add Open Graph and Twitter Card metadata for rich social sharing previews
- Add `robots.txt` and `sitemap.xml` for search engine crawling
- Add structured data (JSON-LD, Person schema) to improve Google Knowledge Panel eligibility
- Add `canonical` URL tag to prevent duplicate content issues
- Fix missing ARIA labels, roles, and keyboard navigation gaps in interactive components (carousel, info panel, overlay)
- Add `preload` hints for above-the-fold media (thumbnail images, demo videos) to improve LCP
- Lazy-load below-the-fold carousel media to reduce initial payload
- Add `<meta name="viewport">` and `<meta charset>` explicitly (Next.js injects these but they should be verified)
- Add `lang` attribute verification and ensure all icon `<img>` elements have meaningful `alt` text
- Configure `next/image` optimisation for thumbnail assets
- Add `rel="noopener noreferrer"` enforcement for all external links (already partially in place)

## Capabilities

### New Capabilities

- `seo-metadata`: Full metadata suite — title, description, OG, Twitter Card, canonical, JSON-LD Person schema, robots, and sitemap
- `accessibility-improvements`: ARIA roles, labels, keyboard navigation fixes, and focus management for carousel and overlay interactions
- `performance-optimizations`: Image optimisation via `next/image`, resource hints (`preload`/`prefetch`), and lazy loading for off-screen media

### Modified Capabilities

- `html-description-renderer`: Ensure external links rendered via the HTML parser always carry `rel="noopener noreferrer"` and have accessible link text
- `infinite-carousel`: Add ARIA roles (`list`/`listitem`), keyboard navigation (arrow keys), and `aria-pressed` state for pinned items
- `responsive-layout`: Verify that viewport meta tag and page-level heading hierarchy (`h1` → `h2`) are correct across breakpoints

## Impact

- `app/layout.tsx` — metadata export, JSON-LD script injection, favicon verification
- `app/page.tsx` — `next/image` for thumbnails, media lazy-load attributes
- `public/` — add `robots.txt`, `sitemap.xml`
- `app/components/CarouselItemInfoPanel/` — ARIA live region already present; heading level audit
- `app/components/InfiniteCarousel/` — keyboard nav, ARIA list/item roles
- `app/components/SocialLinks/` — `alt` text on icon images
- No new dependencies required; `next/image` is built-in
