# Documentation Alignment Report

**Date:** June 14, 2026
**Scope:** All Markdown and text documentation in the repository, compared with
the new [Snakke AI Project Brief](PROJECT_BRIEF.md).

## Authority Order

When documents disagree, use this order:

1. [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for regulatory, legal, accessibility,
   medical-device, AI, cybersecurity, funding, procurement, and market claims.
2. [PROJECT_OVERVIEW.md](../PROJECT_OVERVIEW.md) for the current technical
   implementation.
3. [PLAN.md](../PLAN.md) and [TODO.md](../TODO.md) for planned work.
4. [CHANGELOG.md](../CHANGELOG.md) for historical changes.

Claims must be described as **implemented**, **tested**, **planned**, or
**externally verified**. Implementation alone does not establish legal or
regulatory compliance.

## Comparison Findings

The previous documentation accurately described much of the product, but some
claims were broader than the evidence supported:

- Offline support was sometimes described as complete. The product currently
  has an installable PWA and selected local persistence; a verified offline
  capability matrix and conflict-safe synchronization remain planned.
- GDPR, HIPAA, WCAG, research-readiness, and production-readiness language was
  sometimes presented as achieved or inevitable. These are now framed as
  applicability questions, validation gates, and planned controls.
- Norwegian privacy-law work must establish lawful basis, assess special
  category data and DPIA requirements, and review processor and transfer
  arrangements.
- Accessibility must be tested against applicable requirements; preferences
  and ARIA labels are useful features but are not a conformance declaration.
- Medical-device status, AI Act applicability, Cyber Resilience Act duties,
  NAV suitability, procurement readiness, and grant eligibility require
  documented assessment before external claims are made.
- Research consent rates and low withdrawal rates are not success targets.
  Consent must be informed and non-coercive, with straightforward withdrawal.
- Multi-tenancy, row-level security, institutional controls, and audit
  foundations remain planned or staged and must not be described as deployed.
- No project license file currently exists, so the documentation now describes
  the prototype as source-available rather than asserting open-source rights.

## File Review

| File | Alignment action |
|---|---|
| `README.md` | Linked the brief, clarified offline scope, and added an authority note. |
| `PROJECT_OVERVIEW.md` | Clarified current implementation, offline limits, and absence of conformity declarations. |
| `SETUP.md` | Clarified that complete offline synchronization is not production-ready. |
| `PLAN.md` | Reframed unverified advantages and compliance claims as hypotheses, assessments, and gates; corrected completed feature status. |
| `TODO.md` | Added regulatory planning gates and expanded privacy assessment questions. |
| `SUGGESTIONS.md` | Marked commercial and institutional claims as hypotheses and corrected current icon counts. |
| `CHANGELOG.md` | Added this alignment work while preserving historical entries as history. |
| `DOCUMENTATION_AUDIT_SUMMARY.md` | Marked the earlier audit as historical and superseded for regulatory and readiness claims. |
| `MULTILINGUAL_SETUP.md` | Replaced obsolete mixed setup instructions with a redirect to the canonical i18n guide. |
| `docs/i18n.md` | Kept as the canonical i18n implementation guide and corrected current defaults and counts. |
| `.github/copilot-instructions.md` | Corrected the current stack and required contributors to read the brief before making regulated-market claims. |
| `.vercel/README.txt` | Reviewed as generated Vercel metadata; no project claims to reconcile. |
| `olama chat/chat.txt` | Empty; no claims to reconcile. |
| `plan.txt` | Empty; no claims to reconcile. |

## Remaining Validation Work

- Complete the privacy and data-flow assessment described in the brief.
- Define intended use and assess medical-device and AI Act applicability.
- Build and test the offline capability matrix.
- Validate accessibility with representative users and applicable standards.
- Verify licensing, data residency, processor terms, procurement requirements,
  and grant rules before making external claims.
- Keep current-state docs synchronized with migrations, tests, and deployed
  behavior as institutional features are implemented.
