# Pictalk — Development Plan

This document defines the phased development roadmap for Pictalk. Each phase builds on the previous and is scoped to be achievable in focused sprints.

---

## ✅ Phase 0 — Foundation (Complete)

- [x] Next.js 16 App Router project setup
- [x] TypeScript + Tailwind CSS v4 configuration
- [x] Redux Toolkit state management (4 slices)
- [x] NextAuth v5 authentication (login / register)
- [x] Drizzle ORM + Neon Serverless Postgres (8-table schema)
- [x] PWA manifest + `@ducanh2912/next-pwa`
- [x] Dark mode support
- [x] Clean monorepo structure (legacy Expo code removed)
- [x] Vercel deployment (zero-config, auto-detects Next.js)

---

## ✅ Phase 1 — Core AAC Communication (Complete)

- [x] Built-in icon database (emoji-based, 6 categories)
- [x] Category selector tabs (Needs / Actions / Feelings / People / Places / Custom)
- [x] Icon grid display
- [x] Sentence builder with TTS (Web Speech API)
- [x] Text → Icon auto-conversion (keyword-based `iconMatcher.ts`)
- [x] Speech → Icon conversion (Web Speech API recognition)
- [x] English + Norwegian multilingual support (React Context i18n)
- [x] Keyword maps for EN + NO
- [x] Core AAC verbs expanded (want, need, do, make, wait, go, stop, like, more, now, later)
- [x] Custom icon upload (Vercel Blob + Neon DB)
- [x] Custom icons merged into icon board and matcher

---

## 🚧 Phase 2 — User Experience & Polish (Current)

**Goal**: Make the app feel professional and reliable for real users.

### 2.1 Authentication & Onboarding
- [ ] Test full register → login → dashboard flow in production
- [ ] Add email verification (send confirmation email on register)
- [ ] "Forgot password" / password reset flow
- [ ] Friendly error messages for all auth failure states

### 2.2 Communication Board UX
- [ ] Favourite phrases — save/load icon sentences
- [ ] Recently used icons section at top of board
- [ ] Icon board layout improvements (larger icons, better spacing for touch)
- [ ] Haptic feedback on icon tap (Vibration API)
- [ ] Keyboard-accessible icon navigation
- [ ] Long-press on icon to see icon details / delete custom icon

### 2.3 Dashboard & Profile
- [ ] User profile page (name, avatar, role)
- [ ] Preferences page (voice speed, pitch, text size, high contrast)
- [ ] Communication history / session log view
- [ ] Manage custom icons (delete, rename)

### 2.4 Visual Design Upgrade
- [ ] Premium landing page (glassmorphism, animations)
- [ ] Consistent design system (colors, spacing, typography via Tailwind tokens)
- [ ] Animated icon press feedback
- [ ] Smooth page transitions

---

## 📋 Phase 3 — Pairing & Multi-User (Next Major)

**Goal**: Enable guardian/therapist to manage a child's board and view their communication.

### 3.1 Device Pairing
- [ ] QR code generation for pairing request
- [ ] QR code scanner (html5-qrcode is already installed)
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

- [ ] Service worker caching strategy (stale-while-revalidate for icons)
- [ ] IndexedDB session storage — save sentences offline
- [ ] Background sync — upload sessions when back online
- [ ] Offline-capable custom icon upload queue
- [ ] Install prompt / "Add to Home Screen" guidance
- [ ] Push notifications for guardians (message received)

---

## 📋 Phase 5 — Icon Library Expansion

**Goal**: Move beyond emoji symbols to a rich, professional AAC symbol set.

- [ ] **ARASAAC API integration** — 30,000+ free AAC pictograms
  - Dynamic symbol search by keyword and language
  - Download and cache symbols locally
  - Display ARASAAC pictograms alongside custom icons
- [ ] **Open Board Format (OBF/OBZ)** import/export
  - Import community-shared boards (.obz files)
  - Export user boards for use in other AAC apps
- [ ] Bing/Google image search integration for quick icon finding
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

| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Auth flow polish (email verify, reset) | High | Medium | **P1** |
| Favourite phrases | High | Low | **P1** |
| Preferences page (voice, size) | High | Low | **P1** |
| ARASAAC integration | Very High | High | **P2** |
| Device pairing (QR) | High | High | **P2** |
| OBF import/export | Medium | Medium | **P2** |
| Offline sync | High | High | **P3** |
| ML icon matching | Medium | Very High | **P4** |
| Switch access | High | Very High | **P4** |
| Native app | Medium | High | **P4** |

---

## Milestones

| Milestone | Target | Description |
|---|---|---|
| **v0.2.0** | Near-term | Auth polish, favourites, preferences, icon UX |
| **v0.3.0** | Mid-term | Device pairing, guardian dashboard, ARASAAC |
| **v0.4.0** | Mid-term | Full offline PWA, OBF import/export |
| **v1.0.0** | Long-term | Production-ready, accessible, App Store ready |
