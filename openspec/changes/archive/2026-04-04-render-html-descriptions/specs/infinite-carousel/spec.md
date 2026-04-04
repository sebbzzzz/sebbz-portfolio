## MODIFIED Requirements

### Requirement: Info panel renders HTML descriptions

The `CarouselItemInfoPanel` component SHALL render the `description` field of the active `PortfolioItem` as parsed HTML rather than a plain text string, so that anchor tags and other markup are rendered as real DOM elements.

#### Scenario: Description with anchor tag shows a link

- **WHEN** a pinned portfolio item has a description containing an `<a>` anchor tag
- **THEN** the info panel SHALL display the text with a rendered, clickable hyperlink — not escaped HTML characters

#### Scenario: Description with no HTML renders unchanged

- **WHEN** a pinned portfolio item has a plain text description
- **THEN** the info panel SHALL display the text identically to before
