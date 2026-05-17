# Pictalk — Development Plan

This document defines the phased development roadmap for Pictalk. Each phase builds on the previous and is scoped to be achievable in focused sprints.

_Last updated: May 17, 2026 (session 3)_

---

## ✅ Phase 0 — Foundation (Complete)

- [x] Next.js 16 App Router project setup
- [x] TypeScript + Tailwind CSS v4 configuration
- [x] Redux Toolkit state management (4 slices: communication, pairing, ui, auth)
- [x] NextAuth v5 authentication (login / register)
- [x] Drizzle ORM + Neon Serverless Postgres (9-table schema incl. passwordHistory)
- [x] PWA manifest + `@ducanh2912/next-pwa`
- [x] Dark mode support
- [x] Clean monorepo structure (legacy Expo code removed)
- [x] Vercel deployment (zero-config, auto-detects Next.js)

---

## ✅ Phase 1 — Core AAC Communication (Complete)

- [x] Built-in icon database (89 icons, 6 categories)
- [x] **ARASAAC pictogram integration** — all 89 icons use real AAC pictograms (CC BY-NC-SA 4.0) via static CDN URLs
- [x] Category selector tabs (Needs / Actions / Feelings / People / Places / Custom)
- [x] Icon grid display with ARASAAC images + emoji fallback
- [x] Sentence builder with TTS (Web Speech API, speed/pitch from preferences)
- [x] Text → Icon auto-conversion (keyword-based `iconMatcher.ts`)
- [x] Speech → Icon conversion (Web Speech API recognition, language-aware — uses current app locale for both recognizer lang and keyword matching)
- [x] English + Norwegian multilingual support (React Context i18n, **not** next-intl)
- [x] Keyword maps for EN + NO
- [x] Core AAC verbs expanded (want, need, do, make, wait, go, stop, like, more, now, later)
- [x] Custom icon upload (Vercel Blob + Neon DB)
- [x] Custom icons merged into icon board and matcher
- [x] Favourite phrases (save/load/delete, persisted to IndexedDB, Redux slice)
- [x] Recently used icons tracked in Redux state (`recentIcons`, max 20) and displayed in UI

---

## ✅ Phase 2.1 — Authentication & Onboarding (Complete)

- [x] Full register → login → dashboard flow
- [x] Email verification (Resend API, 24h token, `/verify-email` page + API)
- [x] Forgot password / password reset flow (`/forgot-password` + `/reset-password` pages + API)
- [x] Password history check — prevents reuse of last 5 passwords
- [x] Friendly error messages on all auth pages (field-level + global)
- [x] Password strength indicator on register

---

## 🚧 Phase 2 — User Experience & Polish (In Progress)

**Goal**: Make the app feel professional and reliable for real users.

### 2.2 Dashboard & Profile
- [x] User profile page (`/dashboard/profile` — name, email, role, edit name) ✅
- [x] Preferences page (`/dashboard/settings` — voice speed, pitch, test button) ✅
- [x] Communication history — `/dashboard/history` page: own sessions for children; supervisor (teacher/therapist/guardian) gets a patient selector showing all paired users, with pairing-verified access control ✅
- [x] **Manage custom icons** — delete (with confirmation overlay) and inline rename on each icon card in `/dashboard/icons` ✅
- [ ] Accessibility preferences UI (high contrast, reduce motion, text size — in DB schema, not in settings page)

### 2.3 Communication Board UX
- [x] Favourite phrases — save/load icon sentences ✅
- [x] **Recently used icons row** — top 8 icons shown above category tabs, tappable to re-add to sentence ✅
- [ ] Icon board layout improvements (larger icons, better spacing for touch)
- [ ] Haptic feedback on icon tap (`navigator.vibrate` — schema supports `hapticEnabled` but not implemented)
- [ ] Keyboard-accessible icon navigation (ARIA labels exist, full keyboard nav not done)
- [ ] Long-press on icon to see icon details / delete custom icon
- [x] **Icon search bar** — searches across all 89 built-in + custom icons by name; hides category tabs and recently-used strip during search; `×` clear button; empty-state message ✅

### 2.4 Visual Design Upgrade
- [x] Landing page — hero + features section + footer (basic, functional)
- [x] **Dark mode toggle** — sun/moon button in header; `@custom-variant dark` fix for Tailwind v4 class-based switching; FOUC-prevention inline script; localStorage persistence ✅
- [ ] Premium landing page redesign (glassmorphism, live demo preview, testimonials)
- [ ] Animated icon press feedback (scale + colour flash on tap)
- [ ] Smooth page transitions
- [ ] Consistent design system (Tailwind tokens for spacing, typography)

---

## 📋 Phase 3 — Pairing & Multi-User

**Goal**: Enable guardian/therapist to manage a child's board and view their communication.

> Schema + Redux slice (`pairingSlice`) already exist — no UI yet.

### 3.1 Device Pairing
- [ ] QR code generation for pairing request
- [ ] QR code scanner (`html5-qrcode` already installed)
- [ ] Accept/reject pairing on guardian's device
- [ ] List of paired users in dashboard
- [ ] Unpair / revoke access

### 3.2 Guardian Dashboard
- [ ] View child's communication sessions
- [ ] See which icons the child uses most (frequency chart)
- [ ] Add/curate custom icons for a paired child
- [ ] Set vocabulary restrictions per child

### 3.3 Real-time Sync
- [ ] WebSocket or Vercel Pusher for live session viewing
- [ ] Guardian sees child's sentence being built in real time

---

## 📋 Phase 4 — Offline & PWA Hardening

**Goal**: Full offline functionality — Pictalk must work with no internet connection.

> IndexedDB is wired up (sessions, favourite phrases, sync queue). Service worker is missing — PWA cannot install.

- [ ] **Service worker** — `public/sw.js` does not exist; PWA install will fail without it
- [ ] Service worker caching strategy (stale-while-revalidate for icons)
- [ ] Background sync — upload sessions when back online
- [ ] Offline-capable custom icon upload queue
- [ ] Install prompt / "Add to Home Screen" guidance
- [ ] Push notifications for guardians (message received)

---

## 📋 Phase 5 — Icon Library Expansion

**Goal**: Grow beyond the current 89 static ARASAAC pictograms.

- [x] ARASAAC static CDN integration (89 icons, all categories) ✅
- [ ] Dynamic ARASAAC API search — search 30,000+ symbols by keyword at runtime
- [ ] Cache downloaded ARASAAC symbols to IndexedDB for offline use
- [ ] **Open Board Format (OBF/OBZ)** import/export
  - Import community-shared boards (.obz files)
  - Export user boards for use in other AAC apps
- [ ] AI image generation for custom icons (DALL-E / Stable Diffusion)

---

## 📋 Phase 6 — Intelligence & ML

**Goal**: Make icon matching smarter and more personalised.

- [ ] Replace keyword matching with vector embeddings (TensorFlow.js or ONNX)
- [ ] Cross-language semantic matching (match "vann" from English embedding)
- [ ] Personal usage pattern learning (predict next icon from recent history)
- [ ] Sentence completion suggestions
- [ ] Context-aware suggestions (time of day, location)
- [ ] Therapist insights dashboard (word frequency, communication progress)

---

## 📋 Phase 7 — Native App & Accessibility

**Goal**: Reach users who need native app distribution and advanced accessibility.

- [ ] **Switch access / scanning** — single-switch input for motor-impaired users
- [ ] **Eye gaze** compatibility testing
- [ ] **WCAG 2.1 AAA** audit and fixes
- [ ] Screen reader (ARIA) improvements throughout
- [ ] Capacitor wrapper for iOS/Android App Store distribution
- [ ] Offline-first native storage with SQLite (Capacitor)

---

## Priority Matrix

| Feature | Impact | Effort | Priority | Status |
|---|---|---|---|---|
| Recently used icons UI row | High | Low | **P1** | ✅ Done |
| Communication history view | High | Low | **P1** | ✅ Done |
| Manage custom icons (delete/rename) | Medium | Low | **P1** | 🔲 |
| Service worker (PWA install) | Critical | Medium | **P1** | 🔲 |
| Icon search bar | High | Low | **P1** | 🔲 |
| Haptic feedback | Medium | Low | **P2** | 🔲 |
| Accessibility prefs UI | High | Medium | **P2** | 🔲 |
| Premium landing page redesign | Medium | Medium | **P2** | 🔲 |
| Device pairing (QR) | High | High | **P3** | 🔲 |
| Dynamic ARASAAC search | High | Medium | **P3** | 🔲 |
| OBF import/export | Medium | Medium | **P3** | 🔲 |
| Offline sync | High | High | **P3** | 🔲 |
| ML icon matching | Medium | Very High | **P4** | 🔲 |
| Switch access | High | Very High | **P4** | 🔲 |
| Native app | Medium | High | **P4** | 🔲 |

---

## Milestones

| Milestone | Target | Description |
|---|---|---|
| **v0.2.0** | Near-term | ~~Recently used icons UI~~ ✅, ~~history view~~ ✅, manage custom icons, service worker |
| **v0.3.0** | Mid-term | Device pairing, guardian dashboard, dynamic ARASAAC search |
| **v0.4.0** | Mid-term | Full offline PWA, OBF import/export |
| **v1.0.0** | Long-term | Production-ready, accessible, App Store ready |
