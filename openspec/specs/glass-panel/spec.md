### Requirement: Text panel renders as frosted glass surface

The text panel on the homepage SHALL apply a glassmorphism visual style: blurred backdrop, translucent light fill, hairline border, and a drop + inner shadow, creating an Apple-style frosted glass appearance over the particle canvas.

#### Scenario: Glass effect visible over particle canvas

- **WHEN** the page renders on a browser supporting `backdrop-filter`
- **THEN** the text panel shows a blurred, translucent frosted glass surface over the canvas background

#### Scenario: Fallback on unsupported browsers

- **WHEN** the browser does not support `backdrop-filter`
- **THEN** the text panel falls back to a solid semi-transparent dark fill with no blur

### Requirement: Glass panel uses Safari-compatible vendor prefix

The glass panel styles SHALL include both `-webkit-backdrop-filter` and `backdrop-filter` to ensure correct rendering in Safari.

#### Scenario: Safari renders blur correctly

- **WHEN** the page is opened in Safari
- **THEN** the backdrop blur is applied using the `-webkit-backdrop-filter` prefix

### Requirement: Glass panel has rounded corners and subtle border

The panel SHALL use a `border-radius` of `16px` and a `1px` semi-transparent white border to reinforce the glass edge.

#### Scenario: Panel corners are rounded

- **WHEN** the panel is visible
- **THEN** all four corners are rounded at 16px radius with a visible hairline white border
