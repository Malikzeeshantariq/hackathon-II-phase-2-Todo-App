<!--
============================================================================
SYNC IMPACT REPORT
============================================================================
Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution ratification)

Modified Principles: N/A (initial creation)

Added Sections:
- Core Principles (4 principles: Accuracy, Clarity, Reproducibility, Engineering Rigor)
- Key Standards (Specification Traceability, Source of Truth, Documentation)
- Technical Constraints (Stack, Architecture)
- Quality & Validation Rules (Code Quality, Security, Change Control)
- Success Criteria (Phase 2)
- Failure Conditions
- Enforcement
- Governance

Removed Sections: N/A (initial creation)

Templates Requiring Updates:
- .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
- .specify/templates/spec-template.md: ✅ Compatible (Requirements/Success Criteria align)
- .specify/templates/tasks-template.md: ✅ Compatible (Task traceability supported)

Follow-up TODOs: None
============================================================================
-->

# Todo App (Phase 2) Constitution

Spec-Driven AI-Native Software Development

## Project

**Todo Web Application — Phase 2 (Full-Stack Web App)**

This constitution defines the non-negotiable principles, standards, constraints,
and success criteria governing the development of this project.

All agents, tools, and contributors MUST comply.

---

## Core Principles

### I. Accuracy Through Specifications

All functionality MUST originate from written specifications. No feature may be
implemented based on assumptions or inference. Code is considered invalid if not
traceable to a spec and task ID.

**Rationale**: Specifications serve as the single source of truth, ensuring all
stakeholders have shared understanding and enabling automated validation.

### II. Clarity for Technical Audience

Specifications and code target a computer science-literate audience. Naming,
structure, and documentation MUST be explicit and unambiguous. Behavior MUST be
understandable without external explanation.

**Rationale**: Ambiguity leads to implementation drift and maintenance burden.
Clear documentation reduces onboarding time and error rates.

### III. Reproducibility

The application MUST be reproducible from the repository alone. All architectural
decisions MUST be documented. Environment configuration MUST be explicit and
deterministic.

**Rationale**: Any developer should be able to clone the repository and run the
application without tribal knowledge or external dependencies.

### IV. Engineering Rigor

All development MUST adhere to:

- Stable API contracts
- Deterministic behavior
- Clear separation of concerns
- No "vibe-coding" or undocumented shortcuts

**Rationale**: Rigorous engineering practices ensure maintainability, testability,
and predictable system behavior under all conditions.

---

## Key Standards

### Specification Traceability

Every feature MUST map to:

- `sp.specify` (specification document)
- `sp.plan` (implementation plan)
- `sp.tasks` (task breakdown)

Every code file MUST reference a Task ID in comments or commit messages.

### Source of Truth Hierarchy

1. **sp.constitution** (WHY) — Non-negotiable principles
2. **sp.specify** (WHAT) — Feature requirements
3. **sp.plan** (HOW) — Architectural decisions
4. **sp.tasks** (WORK) — Implementation tasks
5. **Code** (IMPLEMENTATION) — Actual implementation

Higher levels override lower levels. Conflicts MUST be resolved by updating
lower-level artifacts to align with higher levels.

### Documentation Standard

- Markdown only for all documentation
- Clear headings and structured sections
- No ambiguous language (avoid "might", "could", "possibly")
- MUST/SHOULD/MAY terminology per RFC 2119

---

## Technical Constraints

### Stack (Immutable)

**Frontend:**

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend:**

- FastAPI
- SQLModel
- PostgreSQL (Neon Serverless)

**Authentication:**

- JWT-based authentication
- Stateless backend

### Architecture Constraints

- Monorepo structure
- RESTful APIs only (Phase 2)
- User-scoped data access
- No server-side sessions

---

## Quality & Validation Rules

### Code Quality

- MUST follow defined tasks
- MUST NOT introduce undocumented behavior
- MUST enforce user ownership and authorization
- MUST include Task ID reference

### Security

- All protected routes MUST require JWT
- Cross-user data access MUST return 403 Forbidden
- Unauthorized access MUST return 401 Unauthorized
- Secrets MUST NOT be committed to repository

### Change Control

- Schema changes require spec updates
- API changes require plan updates
- New features require specification before implementation

---

## Success Criteria (Phase 2)

The project is considered successful if:

- [ ] All implemented features are spec-traceable
- [ ] CRUD operations work for authenticated users
- [ ] User data isolation is enforced
- [ ] Application runs end-to-end (Frontend + Backend + DB)
- [ ] No undocumented behavior exists
- [ ] Ready for Phase 3 (MCP & AI Agents) without refactor

---

## Failure Conditions

The project FAILS if:

- Code exists without a Task ID
- Features exist without specifications
- Authentication or authorization is bypassed
- Behavior cannot be explained via specs
- Agents proceed despite ambiguity

---

## Enforcement

All AI agents MUST:

- Read this constitution before acting
- Halt execution if rules are violated
- Request clarification instead of guessing
- Reference Task IDs in all code changes

---

## Governance

### Amendment Procedure

1. Propose amendment with rationale
2. Document impact on existing artifacts
3. Obtain explicit approval
4. Update version and last amended date
5. Propagate changes to dependent templates

### Versioning Policy

- **MAJOR**: Backward-incompatible governance/principle changes
- **MINOR**: New principle/section added or materially expanded
- **PATCH**: Clarifications, wording, typo fixes

### Compliance Review

- All PRs MUST verify constitutional compliance
- Complexity MUST be justified against principles
- Use CLAUDE.md for runtime development guidance

---

**Version**: 1.0.0 | **Ratified**: 2025-01-08 | **Last Amended**: 2025-01-08
