# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `yarn dev` - Start Next.js development server (localhost:3000)
- `yarn build` - Build production bundle
- `yarn start` - Start production server (run after build)
- `yarn lint` - Run ESLint with next/core-web-vitals
- `yarn format` - Format code with Prettier

### Package Management
This project uses Yarn v1.22.19. Always use `yarn` instead of npm.

## Architecture Overview

This is a Next.js 14 App Router portfolio site with a custom design system.

### Font System
Three web fonts are loaded in `app/layout.tsx` via `next/font/google`:
- **Inter** (`--font-inter`) - Default body font, applied via font-family in `app/globals.scss`
- **Space Grotesk** (`--font-space-grotesk`) - Headings (h1-h6)
- **IBM Plex Mono** (`--font-plex-mono`) - Code, kbd, pre elements

Each font variable is attached to the `<html>` element and consumed via CSS custom properties.

### Design Tokens (tailwind.config.ts)

**Colors:**
- `canvas` (#0D0C0C) - Base background
- `canvas-muted` (#232124) - Secondary backgrounds
- `canvas-contrast` (#FFFFFF) - High contrast elements
- `canvas-contrastMuted` (#F3F3F3) - Muted contrast
- `text-base` (#F3F3F3) - Default text color
- `text-strong` (#FFFFFF) - Strong emphasis text
- `text-inverse` (#0D0C0C) - Inverse text (on light backgrounds)

**Custom Utilities:**
- `shadow-glow` - Custom box shadow
- `rounded-badge` (999px) - Pill-shaped border radius
- `rounded-card` (1.75rem) - Card border radius

### Grid System (styles/grid.scss)

Custom 12-column responsive grid with SCSS-generated classes:
- `.container` - Responsive max-width container with breakpoint-aware padding
- `.row` - Flex container with negative margins and gap
- `.col-{1-12}` - Column widths (e.g., `.col-6` = 50%)
- `.col-{breakpoint}-{1-12}` - Responsive columns (e.g., `.col-md-4`)
- `.row--center`, `.row--between` - Flexbox alignment modifiers

Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1440px)

This grid coexists with Tailwind's utilities. Use it for complex multi-column layouts.

### Path Aliases
- `@/*` - Root directory
- `@components/*` - `./components/*`

### Styling Approach
1. Tailwind utilities for most styling
2. Custom grid system (`.container`, `.row`, `.col-*`) for layout
3. Global base styles in `app/globals.scss`:
   - Dark color scheme
   - Radial gradient background on body
   - Font-family assignments
   - Link hover states

## Project Structure Notes

- `app/` - App Router pages, layouts, and route handlers
- `app/components/` - Currently empty; intended for page-specific components
- `app/globals.scss` - Tailwind imports, base layer, and utilities
- `styles/grid.scss` - Custom SCSS grid system (imported in globals.scss)
- `public/` - Static assets

The top-level `components/` directory does not exist; page-specific components should go in `app/components/` per the README.
