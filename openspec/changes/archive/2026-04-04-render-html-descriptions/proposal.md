## Why

Portfolio item descriptions in `PORTFOLIO_ITEMS` contain raw HTML strings with anchor tags (hyperlinks), but they are currently rendered as plain text via React — meaning the HTML markup is displayed as literal characters instead of clickable links. This needs to be fixed so collaborators and studios referenced in descriptions are properly linked.

## What Changes

- Add a reusable `HtmlContent` component (or use a lightweight package like `html-react-parser`) to safely render HTML strings as React elements.
- Update `CarouselItemInfoPanel` to render the `description` field through the HTML-safe renderer instead of as a plain text string.
- No changes to the `PortfolioItem` type — `description` remains a `string` that may contain HTML.

## Capabilities

### New Capabilities

- `html-description-renderer`: Safe rendering of HTML strings (with anchor tags) inside portfolio item description panels.

### Modified Capabilities

- `infinite-carousel`: The info panel sub-component now renders HTML descriptions instead of plain text.

## Impact

- `app/components/CarouselItemInfoPanel/CarouselItemInfoPanel.tsx` — description rendering updated.
- New dependency: `html-react-parser` (or equivalent) added to `package.json`.
- No API, data, or type-level changes.
