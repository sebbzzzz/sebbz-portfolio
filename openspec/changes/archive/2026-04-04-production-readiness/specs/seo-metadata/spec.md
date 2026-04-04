## ADDED Requirements

### Requirement: Rich page metadata

The root layout SHALL export a static `Metadata` object containing: `title`, `description`, `keywords`, `authors`, `canonical` (via `alternates.canonical`), Open Graph (`openGraph`), and Twitter Card (`twitter`) fields populated with the portfolio's actual copy.

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

### Requirement: Structured data (Person schema)

The root layout SHALL inject a `<script type="application/ld+json">` tag in `<head>` containing a valid Schema.org `Person` object with at minimum: `@type`, `name`, `url`, `sameAs` (social profile URLs), and `jobTitle`.

#### Scenario: JSON-LD script is present at page load

- **WHEN** the page HTML is inspected
- **THEN** a `<script type="application/ld+json">` tag SHALL exist in `<head>` with parseable JSON

#### Scenario: Person schema fields are populated

- **WHEN** the JSON-LD is parsed
- **THEN** it SHALL include `name`, `url`, `jobTitle`, and at least two `sameAs` URLs (LinkedIn, GitHub)

### Requirement: robots.txt is served

The application SHALL serve a `robots.txt` file at `/robots.txt` that allows all crawlers to index all pages.

#### Scenario: robots.txt allows all crawlers

- **WHEN** a crawler requests `/robots.txt`
- **THEN** the response SHALL contain `User-agent: *` and `Allow: /`, plus a `Sitemap:` directive pointing to `/sitemap.xml`

### Requirement: sitemap.xml is served

The application SHALL serve a `sitemap.xml` file at `/sitemap.xml` listing the homepage URL with `<lastmod>` and `<changefreq>`.

#### Scenario: sitemap.xml contains the homepage

- **WHEN** a crawler requests `/sitemap.xml`
- **THEN** the response SHALL be valid XML containing the production homepage URL, a `<lastmod>` date, and `<changefreq>monthly</changefreq>`
