## ADDED Requirements

### Requirement: HTML description rendering

The system SHALL render portfolio item `description` strings as parsed HTML, converting any valid HTML markup (e.g. anchor tags) into real DOM elements rather than displaying them as escaped text.

#### Scenario: Plain text description renders as text

- **WHEN** a `description` contains no HTML tags
- **THEN** the text SHALL be displayed as-is with no visible changes

#### Scenario: Anchor tag in description renders as a clickable link

- **WHEN** a `description` contains an `<a href="..." target="_blank" rel="noopener noreferrer">` anchor element
- **THEN** the anchor SHALL render as a clickable `<a>` element in the DOM with all attributes preserved

#### Scenario: Anchor links open in a new tab

- **WHEN** an anchor tag in a description has `target="_blank"`
- **THEN** clicking the rendered link SHALL open the URL in a new browser tab
