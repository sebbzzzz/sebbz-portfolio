## MODIFIED Requirements

### Requirement: Rich page metadata
The root layout SHALL export a static `Metadata` object containing: `title`, `description`, `keywords`, `authors`, `canonical` (via `alternates.canonical`), Open Graph (`openGraph`), and Twitter Card (`twitter`) fields populated with the portfolio's actual copy. The `icons` field SHALL reference the static `public/favicon.ico` as a fallback — the animated favicon overrides this at runtime via JavaScript.

#### Scenario: Title tag is set correctly
- **WHEN** the page is loaded
- **THEN** the `<title>` tag SHALL read "Sebastián · Full-Stack Engineer & Creative Developer" (or equivalent professional title agreed upon)

#### Scenario: Meta description is set
- **WHEN** a search engine or link unfurler reads the page
- **THEN** the `<meta name="description">` SHALL contain a concise, keyword-rich description of Sebastián's work (≤160 characters)

#### Scenario: Open Graph metadata is present
- **WHEN** the URL is shared on LinkedIn, Slack, or Facebook
- **THEN** `og:title`, `og:description`, `og:url`, `og:type` (website), and `og:image` SHALL be present in the page `<head>`

#### Scenario: Twitter Card metadata is present
- **WHEN** the URL is shared on X (Twitter)
- **THEN** `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, and `twitter:image` SHALL be present in the page `<head>`

#### Scenario: Canonical URL is set
- **WHEN** any crawler or browser reads the page
- **THEN** `<link rel="canonical" href="<production-url>">` SHALL be present, pointing to the authoritative URL

#### Scenario: Static favicon fallback is present in head
- **WHEN** JavaScript is disabled or not yet executed
- **THEN** `<link rel="icon" href="/favicon.ico">` SHALL be present in `<head>` so browsers display a static fallback icon
