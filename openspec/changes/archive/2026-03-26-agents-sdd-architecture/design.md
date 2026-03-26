## Context

AGENTS.md currently acts as a lightweight coding guide with critical rules, decision trees, and basic patterns. It is the single reference file for both human contributors and AI agents (Claude Code) working on this Next.js 15 + React 19 + Tailwind 4 portfolio project.

The project has matured to the point where ad-hoc additions to AGENTS.md are no longer sufficient. A structured Software Design Document (SDD) approach is needed so that each dimension of development (style, patterns, conventions, testing, architecture) has a dedicated, authoritative section.

## Goals / Non-Goals

**Goals:**

- Define a clear, consistent SDD structure within AGENTS.md
- Add 7 new sections covering all aspects of the development lifecycle
- Make every rule actionable and verifiable (linters, tests, PR reviews)
- Keep AGENTS.md as the single source of truth — no separate docs files

**Non-Goals:**

- Rewriting existing critical rules that already work well
- Adding runtime code changes (this is documentation only)
- Creating a separate wiki or external documentation site
- Enforcing rules via new tooling/CI (out of scope for this change)

## Decisions

### Decision 1: Keep AGENTS.md as the single SDD file

**Choice**: Extend AGENTS.md rather than creating a `docs/` directory with multiple files.

**Rationale**: AI agents (Claude Code) load AGENTS.md automatically at context start. Splitting into multiple files would require explicit reads and increase the chance of missing context. One file = one source of truth.

**Alternative considered**: `docs/sdd/*.md` split by section — rejected because it fragments context and requires a table-of-contents navigation layer.

### Decision 2: Section ordering follows the development lifecycle

**Choice**: Sections ordered as: Architecture → Styles → Conventions → Patterns → Anti-patterns → Workflows → Testing.

**Rationale**: A developer (or AI agent) starting fresh should understand the big picture (Architecture) before diving into code rules (Styles, Conventions), then learn what to do (Patterns), what to avoid (Anti-patterns), how to work (Workflows), and finally how to verify (Testing).

### Decision 3: Each section uses consistent rule format

**Choice**: Rules use ALWAYS/NEVER/PREFER keywords matching the existing AGENTS.md style.

**Rationale**: Consistent terminology makes rules easy to scan and apply programmatically. Matches the existing "CRITICAL RULES" section pattern already working well.

### Decision 4: Architecture section uses ASCII diagram

**Choice**: ASCII art diagram to represent the layer architecture.

**Rationale**: No external tooling needed; renders in any markdown viewer, terminal, or AI context window. Figma/Mermaid diagrams require external rendering.

## Risks / Trade-offs

- **AGENTS.md grows large** → Mitigate by using clear `##` section headers so agents can skim and find relevant sections quickly. Add a table of contents at the top.
- **Rules become stale as stack evolves** → Mitigate by including version annotations (e.g., `Next.js 15.x`) so it's clear when rules were written and for what version.
- **Over-specification constrains creativity** → Mitigate by distinguishing ALWAYS/NEVER (hard rules) from PREFER (soft guidelines).
