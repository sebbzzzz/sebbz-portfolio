# Sebbz Portfolio Starter

This repository contains a minimal Next.js + Tailwind CSS baseline tailored for a personal portfolio. Extend the scaffold with sections such as projects, case studies, and contact cards to showcase your work.

## Getting Started

Use Yarn (v1.22+) with Node 18+.

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Start the local development server:
   ```bash
   yarn dev
   ```
3. Build and preview production output:
   ```bash
   yarn build
   yarn start
   ```

## Project Structure

- `app/` — App Router entry points, layout, and screens.
- `app/globals.scss` — Tailwind layers, design tokens, and shared utility helpers.
- `components/` — Reusable UI building blocks.
- `public/` — Static assets served directly.
- `styles/grid.scss` — Custom 12-column container/row/col system.
- `tailwind.config.ts` — Tailwind theme extensions and token definitions.

## Design System

Tailwind is extended with a compact token set in `tailwind.config.ts`:

- **Colors** — `canvas` (base backgrounds), `canvas-muted`, `canvas-contrast`, and `canvas-contrastMuted` map to the provided dark/bright palette. Text utilities (`text-text-base`, `text-text-strong`, `text-text-inverse`) align copy tone with contrast.
- **Typography** — Anonymous Pro is loaded once inside `app/layout.tsx` using `next/font`. Apply `font-mono` (default on `<body>`) to remain on brand or use Tailwind&apos;s `font-sans` for secondary UI copy.
- **Utilities** — Buttons, pills, and supporting helpers sit in `app/globals.scss`. The responsive grid (container + `.row` + `.col-*`) is declared in `styles/grid.scss` and covers 12 columns with breakpoint-specific variants.

Use these tokens for all new components to keep spacing, color, and type decisions consistent.

## Styling

Global gradients and typography live in `app/globals.scss`, while layout uses the SCSS grid helpers in `styles/grid.scss` or Tailwind utilities. Extend the design system by editing `tailwind.config.ts` and the relevant SCSS layers.

## Linting

Run `yarn lint` to execute ESLint with the `next/core-web-vitals` rule-set. Configure additional rules in `.eslintrc.json`.

## Deployment

After running `yarn build`, deploy the generated `.next/` output using platforms such as Vercel, Netlify, or any Node-compatible host.

🤘
