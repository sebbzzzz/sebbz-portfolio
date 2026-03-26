## Why

The current AGENTS.md provides a minimal set of critical rules for the project but lacks a comprehensive Software Design Document (SDD) that covers code style, design patterns, anti-patterns, naming conventions, workflows, testing rules, and overall architecture. Without this, contributors and AI agents lack a unified reference, leading to inconsistency in code quality, structure, and decision-making.

## What Changes

- Expand AGENTS.md into a full SDD with clearly delineated sections for every dimension of development
- Add **Styles** section: formatting rules, indentation, quotes, line length, import ordering
- Add **Patterns** section: approved design patterns for React components, server actions, state, and data fetching
- Add **Anti-patterns** section: explicit list of patterns that must be avoided with rationale
- Add **Conventions** section: file/folder naming, variable naming, commit message format, PR titles
- Add **Workflows** section: development commands, CI/CD steps, branching strategy, PR process
- Add **Testing rules** section: how tests should be written, what to test, file placement, tooling
- Add **Architecture** section: high-level diagram of how the project layers connect (Next.js App Router → Server Actions → Data Layer)

## Capabilities

### New Capabilities

- `sdd-styles`: Code formatting and style rules (indentation, quotes, imports, line length)
- `sdd-patterns`: Approved design patterns for React, Next.js, Zustand, and data fetching
- `sdd-anti-patterns`: Explicitly forbidden patterns with rationale
- `sdd-conventions`: Naming conventions for files, folders, variables, commits, and PRs
- `sdd-workflows`: Development workflows, commands, branching strategy, and CI/CD process
- `sdd-testing`: Testing rules, structure, tooling, and coverage expectations
- `sdd-architecture`: High-level architectural overview showing how project layers connect

### Modified Capabilities

## Impact

- `AGENTS.md` — primary file being expanded; all new sections added here
- All contributors and AI agents using AGENTS.md as reference
- No runtime code changes — this is documentation and guidelines only
