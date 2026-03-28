## 1. Install Dependency

- [x] 1.1 Add `@tailwindcss/postcss` as a dev dependency (`yarn add -D @tailwindcss/postcss`)

## 2. Update PostCSS Config

- [x] 2.1 Replace `tailwindcss: {}` with `'@tailwindcss/postcss': {}` in `postcss.config.js`

## 3. Verify

- [x] 3.1 Run `yarn build` (or `yarn dev`) and confirm the PostCSS error is gone and `app/globals.scss` compiles successfully
