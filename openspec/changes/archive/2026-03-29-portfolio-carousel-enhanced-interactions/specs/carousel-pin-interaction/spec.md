## ADDED Requirements

### Requirement: Click to pin a carousel item

The carousel SHALL allow the user to click any item to "pin" it. A pinned item SHALL remain in a visually active state and the carousel autoplay SHALL be suspended.

#### Scenario: First click pins the item

- **WHEN** the user clicks a carousel item that is not currently pinned
- **THEN** that item SHALL be marked as pinned, the carousel autoplay SHALL stop, and the item's hover state SHALL be locked on

#### Scenario: Clicking the same item unpins it

- **WHEN** the user clicks the currently pinned item
- **THEN** the item SHALL be unpinned, autoplay SHALL resume, and hover state SHALL clear

#### Scenario: Clicking a different item re-pins

- **WHEN** a carousel item is pinned and the user clicks a different item
- **THEN** the previous item SHALL be unpinned and the new item SHALL be pinned in one transition

### Requirement: Autoplay paused while pinned

When any carousel item is pinned, the carousel's automatic scrolling SHALL be fully suspended.

#### Scenario: Autoplay does not advance while pinned

- **WHEN** an item is pinned and 5 seconds elapse
- **THEN** the carousel SHALL not have scrolled and the pinned item SHALL remain in view

#### Scenario: Autoplay resumes on unpin

- **WHEN** the user unpins the item
- **THEN** the carousel SHALL resume automatic scrolling from its current position

### Requirement: Visual indicator for pinned state

The pinned carousel item SHALL have a distinct visual treatment (e.g., full opacity, scale or border ring) that differentiates it from the hovered or idle state.

#### Scenario: Pinned item appears distinct

- **WHEN** an item is pinned
- **THEN** the item SHALL render with a visual indicator such as a border ring or elevated opacity compared to its siblings

### Requirement: Pinning works independently of drag interaction

Pinning SHALL only activate on `click` (not on drag-release). A drag that covers less than 5 px and ends on the same item SHALL count as a click.

#### Scenario: Short drag does not trigger pin

- **WHEN** the user drags the carousel fewer than 5 px and releases over an item
- **THEN** the item SHALL be pinned (treated as a click)

#### Scenario: Long drag does not trigger pin

- **WHEN** the user drags the carousel more than 5 px and releases
- **THEN** no item SHALL be pinned or unpinned
