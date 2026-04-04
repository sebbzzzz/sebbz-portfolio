## 1. SEO Metadata

- [x] 1.1 Decide and document the production URL (e.g. via `NEXT_PUBLIC_SITE_URL` env var or hardcoded constant in `app/layout.tsx`)
- [x] 1.2 Replace placeholder `title` and `description` in the `metadata` export in `app/layout.tsx` with real, keyword-rich copy (≤160 chars for description)
- [x] 1.3 Add `keywords` and `authors` fields to the `metadata` export
- [x] 1.4 Add `alternates.canonical` to the `metadata` export pointing to the production URL
- [x] 1.5 Add `openGraph` block to `metadata`: `title`, `description`, `url`, `type: "website"`, `images` (OG image asset)
- [x] 1.6 Add `twitter` block to `metadata`: `card: "summary_large_image"`, `title`, `description`, `images`
- [x] 1.7 Create or obtain an OG image (1200×630px) and add it to `public/og-image.png`
- [x] 1.8 Inject JSON-LD Person schema as `<script type="application/ld+json" dangerouslySetInnerHTML>` inside `<head>` in `RootLayout` with `name`, `url`, `jobTitle`, `sameAs` (LinkedIn, GitHub)
- [x] 1.9 Create `public/robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: <url>/sitemap.xml`
- [x] 1.10 Create `public/sitemap.xml` with the production homepage URL, `<lastmod>`, and `<changefreq>monthly</changefreq>`

## 2. Accessibility Improvements

- [x] 2.1 Add `aria-label="Portfolio projects"` to the carousel `<section>` in `app/page.tsx`
- [x] 2.2 Add `role="list"` to the carousel track element in `InfiniteCarousel` (implemented as `role="region"` + `aria-label` on container; `role="listitem"` on each figure)
- [x] 2.3 Add `role="listitem"` and `aria-label={item.title}` to each carousel item wrapper in `InfiniteCarousel`
- [x] 2.4 Add `tabIndex={0}` to the carousel scroll container and wire `onKeyDown` handler for `ArrowLeft`/`ArrowRight` (scroll by one item width, call `e.preventDefault()`) and `Enter`/`Space` (pin/unpin focused item)
- [x] 2.5 Add `aria-pressed={pinnedIndex === index}` to each carousel item's interactive element
- [x] 2.6 Social link icons are not rendered as `<img>` in the DOM (they are canvas-only); no changes needed. SocialLinks renders text labels via the Link component.
- [x] 2.7 Add `aria-label="Project details"` to the `CarouselItemInfoPanel` `<section>`
- [x] 2.8 Verify the intro panel heading is `<h1>` — confirmed correct, no other `<h1>` exists
- [x] 2.9 Confirm `CarouselItemInfoPanel` project title is `<h2>` — confirmed, no regression
- [ ] 2.10 Audit rendered output with a screen reader or axe DevTools; fix any remaining critical violations

## 3. Performance Optimizations

- [x] 3.1 Replace raw `<img>` thumbnail tags in `InfiniteCarousel` (or wherever thumbnails render) with `next/image` using `fill` layout and appropriate `sizes` prop — already using next/image, no changes needed
- [x] 3.2 Set `priority` on the first 3 carousel thumbnail `next/image` instances to prevent LCP regression — added `priority={!isClone && realIndex < 3}`
- [x] 3.3 Social icon SVGs are canvas-only (prefetched by ParticleCanvas via `prefetchIconPaths`); no DOM `<link rel="preload">` needed
- [x] 3.4 Verify demo videos are not fetched on initial load — confirmed: `BackgroundVideoOverlay` receives `src={undefined}` until an item is pinned
- [x] 3.5 Run `yarn build` — clean build, no size regressions (homepage First Load JS: 125 kB, unchanged from before)

## 4. Security & Link Hardening

- [x] 4.1 Update `DESCRIPTION_PARSE_OPTIONS` in `CarouselItemInfoPanel` to enforce `rel="noopener noreferrer"` on all rendered `<a>` tags regardless of source markup
- [x] 4.2 Verify all static `<a target="_blank">` links in `SocialLinks` and `Link` component carry `rel="noopener noreferrer"` — added conditional `rel` to the `Link` component

## 5. QA & Pre-deploy Checks

- [x] 5.1 Run `yarn typecheck` — passed with 0 errors
- [x] 5.2 Run `yarn lint:fix` — passed with 0 errors
- [x] 5.3 Run `yarn format:write` — passed with 0 changes
- [x] 5.4 Run `yarn build` — completed without errors
- [ ] 5.5 Run Lighthouse audit on the production build (`yarn start`) — target Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90, Best Practices ≥ 90
- [ ] 5.6 Verify OG preview renders correctly using a social meta tag tester (e.g. opengraph.xyz)
- [ ] 5.7 Verify JSON-LD is valid using Google's Rich Results Test
- [ ] 5.8 Verify `robots.txt` and `sitemap.xml` are accessible at `/robots.txt` and `/sitemap.xml`
- [ ] 5.9 Manual keyboard navigation test: tab to carousel, arrow-key scroll, Enter to pin — confirm on Chrome, Safari, Firefox
