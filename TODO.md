# Snakke — Professional Workspace TODO

_Created: May 23, 2026_

> **Planning note:** This document contains product hypotheses, not approved
> clinical, research, privacy, or regulatory workflows. Before implementing
> workspace notes, experiments, analytics, or shared child data, apply the
> gates in [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md): lawful-basis and
> Article 9 assessment, DPIA decision, role mapping, tenant isolation, consent
> where applicable, retention, access logging, and domain-expert review.

---

## Background

A child using AAC is typically supported by a **team** — a speech therapist, a teacher, and parents — each working in different contexts (clinic, classroom, home). Today they work in silos. Snakke should be the shared workspace that connects them.

---

## Real-World Scenarios

**1. The therapist runs an experiment**
An SLP wants to test whether a child responds better to the "feelings" category with 6 icons vs 12. She creates two board variants, assigns them to the child on alternating weeks, and wants to compare session data.

**2. The teacher adapts for the classroom**
The classroom teacher needs a school-specific vocabulary set (subjects, teachers' names, classroom objects). She doesn't want to mess with the therapist's clinical board — she needs her own overlay for school hours.

**3. The parent extends at home**
A parent adds icons for family members, favourite foods, home routines. She wants the therapist to see what vocabulary the child is picking up at home and vice versa.

**4. The team communicates**
After a session the therapist writes a note: "Yusuf used 'help' spontaneously 3 times today — consider adding it to the home board." The parent needs to see this, not find it in an email chain.

**5. The community shares**
A therapist develops an excellent board for non-verbal 5-year-olds with autism. She wants to share it as a template that other professionals can import.

---

## Planned Feature Set — "Professional Workspace"

| Feature | Description | Phase |
|---|---|---|
| **Workspaces** | A named space per patient/child — collaborators (therapist + teacher + parent) all see the same data | A |
| **Board Variants** | Multiple named icon arrangements per workspace — each collaborator can propose a variant | B |
| **Session Notes** | Structured notes tied to a session log — who, what context, observations | A |
| **Shared Timeline** | A feed per workspace showing session activity, notes, and board changes across all collaborators | A |
| **Experiments** | A/B board comparison — assign variant A for period 1, variant B for period 2, auto-compare icon usage stats | B |
| **Board Templates** | Export/import a board as a named template; share privately (link) or publicly to the community library | C |
| **Community Library** | Browse and fork templates shared by other professionals | C |
| **Messaging** | Threaded comments on sessions or notes — not email, in-app | A |

---

## What Already Exists in the Codebase

| Existing piece | How it maps |
|---|---|
| `pairings` table | Guardian ↔ child relationship — extend to multi-role team membership |
| `communication_sessions` | Icon usage history per user — already queryable per patient |
| `custom_icons` | Per-user icon sets — extend to workspace-level shared icons |
| `/dashboard/patients` | Patient list — extend into full workspace view |
| `/dashboard/history` | Session history with supervisor access — already role-aware |

---

## Phase A — Workspace, Notes & Timeline
> **Near-term. Builds on existing pairing + session infrastructure.**

- [ ] Extend pairing model into a multi-member workspace (therapist + teacher + parent can all join)
- [ ] Add `workspace_notes` DB table: `id`, `workspace_id`, `author_id`, `session_id` (nullable), `body`, `created_at`
- [ ] API: `POST /api/workspaces/[id]/notes` — create a note
- [ ] API: `GET /api/workspaces/[id]/notes` — list notes with author info
- [ ] UI: Notes feed in `/dashboard/patients/[id]` — chronological list of notes + sessions
- [ ] UI: Add note form (textarea + optional session link)
- [ ] In-app messaging: threaded comments on a note or session entry
- [ ] Notification badge when new notes are added by a collaborator

---

## Phase B — Board Variants & Experiments
> **Mid-term. Requires Phase A workspaces.**

- [ ] Add `board_variants` DB table: `id`, `workspace_id`, `name`, `icon_ids` (jsonb array), `created_by`, `created_at`
- [ ] API: CRUD for board variants
- [ ] UI: Variant manager in workspace — create, name, edit, delete icon sets
- [ ] Assign a variant to a patient for a time period (start date / end date)
- [ ] Session logging captures which variant was active during the session
- [ ] Experiment results view: side-by-side icon usage stats between two variants
- [ ] Charts: most-used icons per variant, session frequency, vocabulary growth over time

---

## Phase C — Templates & Community Library
> **Longer-term. Requires Phase B board variants.**

- [ ] OBF (Open Board Format) export from any board variant
- [ ] OBF import into a workspace
- [ ] Mark a board variant as a "template" — public or link-shared
- [ ] Community library page: browse templates by age group, language, category
- [ ] Fork a community template into your own workspace
- [ ] Template ratings / comments from the professional community
- [ ] ARASAAC dynamic API integration — search 30,000+ symbols when building a board

---

## Open Questions for Domain Experts

- What is the right vocabulary progression for a non-verbal 5-year-old starting AAC? (SLP input needed)
- Should session notes be visible to parents by default, or therapist-controlled?
- What metadata is most useful for an experiment? (icon tap count, session length, spontaneous vs prompted use?)
- Are there existing data standards for AAC research that Snakke should align with?
- Which lawful basis, Article 9 condition (if applicable), controller/processor
  roles, DPIA safeguards, retention rules, and access controls are required for
  session notes linked to a child's identity?

---

## Collaborator Types Needed

| Role | Contribution |
|---|---|
| Speech-Language Pathologists (SLPs) | Core vocabulary curation, experiment design, session note structure |
| Special education teachers | Classroom vocabulary sets, difficulty levels, school-context boards |
| AAC users and families | Usability testing, real-world feedback, home vocabulary |
| Translators | ES, FR, DE (and future languages) UI strings + icon labels |
| UX researcher | Observe professionals using the workspace in real sessions |

**Useful networks**: [ISAAC](https://www.isaac-online.org) · [ARASAAC](https://arasaac.org) · [Cboard](https://www.cboard.io) community · university SLP programs
