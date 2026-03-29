## ADDED Requirements

### Requirement: PortfolioItem type definition

The system SHALL define a `PortfolioItem` type in `types/portfolio.ts` with the following fields: `id` (string), `title` (string), `description` (string), `link` (optional string), `mediaSrc` (optional string — video or image URL), `mediaType` (optional `"video" | "image"`).

#### Scenario: Type is importable across components

- **WHEN** `CarouselItemInfoPanel` or `InfiniteCarousel` imports `PortfolioItem` from `@/types/portfolio`
- **THEN** TypeScript SHALL resolve the import without errors and enforce all required fields

#### Scenario: link field is optional

- **WHEN** a `PortfolioItem` is declared without a `link` field
- **THEN** TypeScript SHALL accept the object without a type error

#### Scenario: mediaSrc and mediaType are co-optional

- **WHEN** a `PortfolioItem` declares `mediaSrc` without `mediaType`
- **THEN** the `BackgroundVideoOverlay` consumer SHALL fall back to detecting media type by file extension

### Requirement: Placeholder portfolio data

The page SHALL define a static `PORTFOLIO_ITEMS` array of `PortfolioItem` objects used as the default carousel dataset. Placeholder entries SHALL include a title, description, and example link so the UI is never empty.

#### Scenario: Carousel renders placeholder items

- **WHEN** the page mounts with the default `PORTFOLIO_ITEMS` array
- **THEN** the carousel SHALL display each item with its image/thumbnail and the info panel SHALL be able to show its title and description on hover
