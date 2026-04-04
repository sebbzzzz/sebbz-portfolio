## MODIFIED Requirements

### Requirement: HTML description rendering

The system SHALL render portfolio item `description` strings as parsed HTML, converting any valid HTML markup (e.g. anchor tags) into real DOM elements rather than displaying them as escaped text. All anchor tags produced by the renderer SHALL carry `rel="noopener noreferrer"` regardless of whether the source markup includes it.

#### Scenario: Plain text description renders as text

- **WHEN** a `description` contains no HTML tags
- **THEN** the text SHALL be displayed as-is with no visible changes

#### Scenario: Anchor tag in description renders as a clickable link

- **WHEN** a `description` contains an `<a href="..." target="_blank">` anchor element
- **THEN** the anchor SHALL render as a clickable `<a>` element in the DOM with all original attributes preserved

#### Scenario: Anchor links open in a new tab

- **WHEN** an anchor tag in a description has `target="_blank"`
- **THEN** clicking the rendered link SHALL open the URL in a new browser tab

#### Scenario: Rendered anchor always has rel="noopener noreferrer"

- **WHEN** an anchor tag in a description is rendered — whether or not the source markup includes `rel`
- **THEN** the rendered `<a>` element SHALL have `rel="noopener noreferrer"` in the DOM to prevent tab-napping and referrer leakage
