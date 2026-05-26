# Snakke — Development Plan

This document defines the phased development roadmap for Snakke. Each phase builds on the previous and is scoped to be achievable in focused sprints.

_Last updated: May 26, 2026 (session 14)_

---

## ✅ Phase 0 — Foundation (Complete)

- [x] Next.js 16 App Router project setup
- [x] TypeScript + Tailwind CSS v4 configuration
- [x] Redux Toolkit state management (4 slices: communication, pairing, ui, auth)
- [x] NextAuth v5 authentication (login / register)
- [x] Drizzle ORM + Neon Serverless Postgres (9-table schema incl. passwordHistory)
- [x] PWA manifest + `@serwist/next` (migrated from `@ducanh2912/next-pwa`)
- [x] Dark mode support
- [x] Clean monorepo structure (legacy Expo code removed)
- [x] Vercel deployment (zero-config, auto-detects Next.js)

---

## ✅ Phase 1 — Core AAC Communication (Complete)

- [x] Built-in icon database (95 icons, 6 categories)
- [x] **ARASAAC pictogram integration** — all 95 icons use real AAC pictograms (CC BY-NC-SA 4.0) via static CDN URLs
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
- [x] **Unified icon registry** (`useIconRegistry` hook) — merges ICON_DATABASE + Redux custom icons + per-icon label overrides; auto-fetches from `/api/icons` on any page that needs it ✅
- [x] **Granular Redux mutations** — `addCustomIcon` / `updateCustomIcon` / `removeCustomIcon` in `communicationSlice`; dispatched from `CustomIconUpload` after each create/rename/delete so the board stays in sync without a full re-fetch ✅
- [x] **iconMatcher label + word-splitting fix** — multi-word custom icon names (e.g. "my dog") are now split into individual searchable keywords; custom label overrides (via `useIconLabels`) are also matched ✅
- [x] **IconMatchGrid label fix** — UUID icon IDs no longer shown as labels; same `tIcon(id) !== id` fallback pattern as `IconGrid` ✅
- [x] **phrases/page.tsx icon picker** — uses `useIconRegistry` so custom icons appear alongside built-ins in category tabs and search ✅
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
- [x] **Accessibility preferences UI** — high contrast, reduce motion, text size + haptic toggles in `/dashboard/settings`; DB-persisted via PATCH `/api/preferences`; DOM changes applied immediately with `localStorage` fallback ✅
- [x] **Dashboard pages fully translated (EN + NO)** — all 5 dashboard pages (dashboard, profile, settings, patients, history) use `t()` throughout; 80+ new translation keys added to `LanguageContext.tsx` ✅

### 2.3 Communication Board UX
- [x] Favourite phrases — save/load icon sentences ✅
- [x] **Recently used icons row** — top 8 icons shown above category tabs, tappable to re-add to sentence ✅
- [x] **Icon search bar** — searches across all 95 built-in + custom icons by name; hides category tabs and recently-used strip during search; `×` clear button; empty-state message ✅
- [ ] Icon board layout improvements (larger icons, better spacing for touch)
- [ ] Haptic feedback on icon tap (`navigator.vibrate` — schema supports `hapticEnabled` but not implemented)
- [ ] Keyboard-accessible icon navigation (ARIA labels exist, full keyboard nav not done)
- [ ] **Switch access / scanning mode** — scanning cursor moves through icons at a configurable interval; user activates selection via spacebar, single key, or Bluetooth button; required for users with severe motor disabilities (see SUGGESTIONS.md §18 for full spec)
- [ ] Long-press on icon to see icon details / delete custom icon
- [ ] **Sentence reordering** — drag-and-drop to reorder icons in the built sentence; currently new icons always append to end
- [ ] **Icon grid sorting** — user-defined ordering of icons within each category in the picker

### 2.4 Visual Design Upgrade
- [x] Landing page — hero + features section + footer (basic, functional)
- [x] **Dark mode toggle** — sun/moon button in header; `@custom-variant dark` fix for Tailwind v4; FOUC-prevention inline script; localStorage persistence ✅
- [x] **Premium landing page redesign** — glassmorphism dark hero, floating emoji icons, demo board preview, stats strip, 6-feature grid, persona cards, gradient CTA banner, dark footer ✅
- [x] **Landing page fully translated** — extracted to `LandingPage.tsx` client component; all text uses `t('home.*')` keys; EN + NO coverage ✅
- [x] **Animated icon press feedback** — `icon-tapped` CSS class + `@keyframes icon-tap` spring animation; respects `.reduce-motion` ✅
- [x] **Smooth page transitions** — `@keyframes page-enter` fade+slide; disabled under `.reduce-motion` ✅
- [x] **Header** — LanguageSwitcher visible on all pages; 💬 communicate shortcut + Learn nav link added ✅
- [x] **Branded favicon + PWA icons** — `src/app/favicon.ico` (32×32), `public/icon-192.png`, `public/icon-512.png`; black background, brand-blue `#0ea5e9` letter; `manifest.json` split into separate `any` + `maskable` entries ✅
- [x] **Norwegian default language** — `useSyncExternalStore` server snapshot returns `'no'`; removed redundant `mounted` guard ✅
- [ ] Consistent design system (Tailwind tokens for spacing, typography)

---

## ✅ Phase 2.5 — Language Learning (Complete)

**Goal**: Help AAC users and caregivers build vocabulary across languages using the same icon set.

- [x] Extended `Language` type: `'en' | 'no' | 'es' | 'fr' | 'de'`
- [x] `LANGUAGES` map with name, nativeName, flag for all 5 languages
- [x] Icon translations for ES, FR, DE (all 95 icons)
- [x] `learnFrom` / `learnTarget` state in `LanguageContext` — any two languages, freely swappable
- [x] `tLang(key, lang)` helper — translate any key into any language explicitly
- [x] `swapLearnLanguages()` — one-click swap
- [x] `STORAGE_KEYS.LEARN_FROM` + `LEARN_TARGET` — persisted to localStorage
- [x] `/learn` route — server component with metadata
- [x] `LearnPage.tsx` — client wrapper with Header + LanguagePicker + FlashcardDeck
- [x] `LanguagePicker.tsx` — 3-column grid, flag + nativeName, same-lang disabled, swap button
- [x] `FlashcardDeck.tsx` — 3 modes:
  - **Flashcard** — tap to reveal, TTS on reveal, knew/didn’t know scoring
  - **Writing** — type the target-language word, normalized match, retry or advance
  - **Speaking** — Web Speech API mic, up to 3 alternatives matched, graceful fallback
- [x] Category filter (All / Needs / Actions / Feelings / People / Places)
- [x] Progress bar + session score, session-complete screen with restart
- [x] 💬 communicate shortcut icon + Learn nav link in Header
- [x] `learn.*` translation keys for EN + NO

**Pending (needs domain experts):**
- [ ] Full ES / FR / DE UI translations (currently only icon labels)
- [ ] Pedagogically sound vocabulary ordering (intro easy/core words first)
- [ ] Spaced repetition algorithm (SM-2 or similar)
- [ ] Audio recordings from native speakers (supplement TTS)

---

## 📋 Phase 2.6 — Sentence & Grid Drag-and-Drop Reordering

**Goal**: Allow users to reorganize built sentences and sort icon grids, improving communication fluency and personalization.

### Problem Statement
- **Sentence**: Icons can be removed but new choices always append to the end. If a user taps icons out of order (e.g., "want cookie I") they must clear and rebuild — there is no way to insert or reorder.
- **Grid**: No way to reorder icons within a category. Custom icons always prepend. Users cannot promote frequently-used icons to the top of their grid.

---

### 2.6.1 Sentence Builder Reordering ✅ COMPLETE

**Implemented using `@dnd-kit/react` v0.4.0 (new 2025/2026 API)**

- `@dnd-kit/react` installed (single package — replaces old `@dnd-kit/core` + `@dnd-kit/sortable` split)
- `DragDropProvider` wraps the sentence strip
- Each sentence icon is a `SortableIconCard` component using `useSortable({ id: index, index })`
- Entire icon card is the drag handle (`ref` + `handleRef` merged on outer div); `cursor-grab` shows on full card hover
- ✕ remove button is absolutely positioned in the top-right corner — independent of drag interaction
- `onDragEnd`: `isSortable(source)` type guard → dispatch `reorderSentenceIcons({ fromIndex: source.initialIndex, toIndex: source.index })`
- Optimistic sorting built in — DOM reorders during drag without React re-renders
- Touch supported natively (default sensors)
- `reorderSentenceIcons` reducer added to `communicationSlice`

**Files modified**:
- `src/store/slices/communicationSlice.ts` ✅ — added `reorderSentenceIcons` reducer
- `src/components/features/SentenceBuilder.tsx` ✅ — `DragDropProvider` + `SortableIconCard`

---

### 2.6.2 Icon Picker Grid Sorting

**Problem**: Users cannot reorder icons in the picker grid. The built-in order is fixed; custom icons always appear first.

**Proposed solution**:
- Per-category icon order saved to `localStorage` (offline) or user preferences DB (synced)
- Drag-and-drop grid reordering using `@dnd-kit/react` in `IconGrid.tsx`
- Custom icons: drag handles in `/dashboard/icons` management page to set a persistent display order
- Built-in icons: per-user category-level reordering (e.g., move "eat" to top of Needs)
- Order persisted via `PATCH /api/preferences` as `iconOrder: Record<IconCategory, string[]>`

**Files to modify**:
- `src/components/features/IconGrid.tsx` — wrap grid with DragDropProvider
- `src/app/(app)/dashboard/icons/page.tsx` — add drag handles for custom icon order
- `src/lib/db/schema.ts` — add `iconOrder` JSON column to preferences
- `src/app/api/preferences/route.ts` — handle `iconOrder` in PATCH

---

### 2.6.3 Implementation Order

- [x] Install `@dnd-kit/react` (new v0.4.0 API)
- [x] Add `reorderSentenceIcons(fromIndex, toIndex)` to `communicationSlice`
- [x] Wrap `SentenceBuilder.tsx` strip in `DragDropProvider` with `SortableIconCard`
- [ ] Add `iconOrder` to user preferences schema (DB + API)
- [ ] Implement grid reordering in `IconGrid.tsx`
- [ ] Update `/dashboard/icons` for custom icon drag-reordering

---

## 📋 Phase 3 — Pairing & Multi-User

**Goal**: Enable guardian/therapist to manage a child's board and view their communication.

> Schema + Redux slice (`pairingSlice`) already exist — no UI yet.

### 3.1 Device Pairing
- [ ] QR code generation for pairing request
- [ ] QR code scanner (`html5-qrcode` already installed)
- [ ] Accept/reject pairing on guardian's device
- [x] List of paired users in dashboard (`/dashboard/patients`) ✅
- [x] Invite via magic link or email ✅
- [x] Unpair / revoke access ✅
- [x] Privacy settings per pairing ✅
- [x] **Resend inbound email webhook** — `/api/webhooks/resend`; `svix` signature verification; forwards `email.received` events to `admin@arken.pro` ✅
- [x] **AI search engine visibility** — `robots.txt` (ChatGPT, Meta AI, Amazonbot etc.), `llms.txt` (app description, pricing, contact), sitemap (`/communicate` added), OG locale `nb_NO` ✅

### 3.2 Guardian Dashboard
- [x] View child's communication sessions (supervisor patient selector in `/dashboard/history`) ✅
- [ ] See which icons the child uses most (frequency chart)
- [ ] Add/curate custom icons for a paired child
- [ ] Set vocabulary restrictions per child

### 3.3 Real-time Sync
- [ ] WebSocket or Vercel Pusher for live session viewing
- [ ] Guardian sees child's sentence being built in real time

---

## 📋 Phase 4 — Offline & PWA Hardening

**Goal**: Full offline functionality — Snakke must work with no internet connection.

- [x] **Service worker** — `@serwist/next` + `src/app/sw.ts`; `public/sw.js` generated at build time; correct `Cache-Control: no-cache` headers ✅
- [x] Service worker caching strategy — `defaultCache` (stale-while-revalidate for assets) ✅
- [x] **PWA icons** — `icon-192.png` + `icon-512.png` in `public/`; Chrome installability requires valid icon files ✅
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

### 6.1 Local Semantic Search (Planned — next sprint)

Replace (or augment) the current keyword-map matcher with dense vector embeddings that run entirely in the user's browser — no server, no API key, no internet after the first load.

#### Model candidates

| Model | Size | Languages | Notes |
|---|---|---|---|
| `Xenova/paraphrase-multilingual-MiniLM-L12-v2` | ~45 MB | 50+ (EN, NO, ES, FR, DE ✅) | **Preferred** — multilingual, 384-dim |
| `Xenova/all-MiniLM-L6-v2` | ~23 MB | English only | Faster; fallback for EN-only mode |
| `Xenova/multilingual-e5-small` | ~118 MB | 100+ | Higher quality; larger download |

**Chosen default**: `Xenova/paraphrase-multilingual-MiniLM-L12-v2` — covers all five app languages in one model, small enough for mobile, and purpose-built for semantic similarity (not just next-token prediction).

#### How it works

1. **First load** — Transformers.js (ONNX Runtime + WebAssembly) downloads the model (~45 MB) once and caches it in the browser's Cache API. Subsequent loads are instant.

2. **Index build** — On startup (or after a custom icon change) the app embeds every icon's effective name (label override → name) into a 384-dimensional float32 vector. Built-in icons: ~89 vectors, cached to IndexedDB. Custom icons: embedded on demand.

3. **Query** — When the user types or speaks, the query string is embedded into the same space. Cosine similarity is computed against the index. Top-k results are ranked and returned in milliseconds.

4. **Cross-lingual matching** — Because the model is multilingual, "vann" (Norwegian for water) and "water" map to nearby vectors. A user typing in Norwegian will match English-labelled icons and vice versa.

5. **Edit mode** — When the user renames an icon, the embedding for that icon is recomputed and the index entry is replaced. The new name (and its synonyms implied by the model) immediately become searchable.

6. **Progressive enhancement** — While the model is loading for the first time, the existing keyword matcher (`iconMatcher.ts`) is used as a fallback. No blank results, no loading spinners blocking the UI.

#### Implementation plan

```
src/
  workers/
    embeddingWorker.ts        # Web Worker — loads model, builds index, runs inference
  lib/ai/
    semanticMatcher.ts        # cosine similarity search, index management
    embeddingCache.ts         # IndexedDB read/write for the embedding index
  hooks/
    useSemanticSearch.ts      # React hook — wraps worker via postMessage/onmessage
```

Key implementation notes:
- The Web Worker is essential: ONNX inference is synchronous and would freeze the UI thread for ~100–300 ms per query without it.
- Use `@xenova/transformers` (browser build) — already ONNX, no extra tooling needed.
- Index is stored as a `Float32Array` in IndexedDB alongside icon IDs; no need to re-embed on every page load.
- Cosine similarity is a simple dot product after L2-normalisation — fast enough in plain JS for ≤ 500 icons without a dedicated vector DB.
- WebAssembly requires specific `next.config.ts` options: `config.experiments.asyncWebAssembly = true` and the `wasm` rule in the webpack config.

#### What this enables

- `"I'm thirsty"` → matches **water** (semantic, no keyword)
- `"hjelp"` (NO: help) → matches **help** icon even with an English label
- `"sitze"` (DE: sit) → matches **sit / chair** icons
- User renames icon to `"min hund"` → searching `"dog"` still finds it
- Multi-word phrase input: embed the full sentence, each word's embedding averaged, ranked results shown as a phrase-level suggestion strip

---

- [ ] **Local semantic embeddings** — Transformers.js worker + cosine-similarity index (see 6.1 above)
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

## 📋 Phase 8 — Marketing & Growth

**Goal**: Build a competitive web presence that converts visitors into users across different audiences.

### 8.1 Persona Landing Pages (Option A — same domain)

Three audience-targeted landing pages within the existing Next.js project. Each page has a hero, pain-points section, relevant feature highlights, and a CTA to `/register` or `/communicate`.

| Route | Audience | Core message |
|---|---|---|
| `/for-parents` | Parents & guardians | "Give your child a voice — free, works on any device" |
| `/for-therapists` | SLPs & therapists | "Manage patients, track sessions, export data for research" |
| `/for-schools` | Teachers & special educators | "AAC in the classroom — Norwegian-first, offline-ready" |

- [ ] `/for-parents` landing page (EN + NO)
- [ ] `/for-therapists` landing page (EN + NO)
- [ ] `/for-schools` landing page (EN + NO)
- [ ] "Who is Snakke for?" persona cards strip on main landing page — links to each persona page
- [ ] Header nav "For you →" dropdown linking to all three pages

### 8.2 Option B — Dedicated Marketing Site (Future)

When a production domain (e.g. `snakke.no`) is acquired, migrate persona pages to a standalone marketing site. The app moves to `app.snakke.no`. This is the long-term clean separation.

- [ ] Acquire production domain
- [ ] Separate marketing site (Next.js or Astro) at root domain
- [ ] App at `app.snakke.no`
- [ ] Redirect persona pages from old domain

### 8.3 Social Proof & Trust Signals

- [ ] Testimonial / user story section (parent or therapist quote)
- [ ] "Free — forever" pricing callout (competitive differentiator vs. Proloquo2Go €299)
- [ ] Press / featured-in strip (if applicable)
- [ ] Demo video or animated GIF of communication board in action

---

## Priority Matrix

| Feature | Impact | Effort | Priority | Status |
|---|---|---|---|---|
| Recently used icons UI row | High | Low | **P1** | ✅ Done |
| Communication history view | High | Low | **P1** | ✅ Done |
| Dashboard i18n (EN + NO, all pages) | High | Low | **P1** | ✅ Done |
| Supervisor pairing (invite + access + history) | High | Medium | **P1** | ✅ Done |
| Manage custom icons (delete/rename) | Medium | Low | **P1** | ✅ Done |
| Service worker (PWA install) | Critical | Medium | **P1** | ✅ Done |
| Icon search bar | High | Low | **P1** | ✅ Done |
| Language learning mode (5 langs) | High | Medium | **P1** | ✅ Done |
| Full ES/FR/DE UI translations | High | Medium | **P1** | 🕐 Needs translators |
| Haptic feedback | Medium | Low | **P2** | 🔲 |
| Accessibility prefs UI | High | Medium | **P2** | ✅ Done |
| Premium landing page redesign | Medium | Medium | **P2** | ✅ Done |
| Spaced repetition for learning | High | Medium | **P2** | 🔲 |
| Device pairing (QR) | High | High | **P3** | 🔲 |
| Dynamic ARASAAC search | High | Medium | **P3** | 🔲 |
| OBF import/export | Medium | Medium | **P3** | 🔲 |
| Offline sync | High | High | **P3** | 🔲 |
| ML icon matching | Medium | Very High | **P4** | 🔲 |
| Switch access | High | Very High | **P4** | 🔲 |
| Native app | Medium | High | **P4** | 🔲 |
| Persona landing pages (/for-parents etc.) | High | Low | **P2** | 🔲 |
| Dedicated marketing site (snakke.no) | Medium | Medium | **P3** | 🔲 |

---

## Milestones

| Milestone | Target | Description |
|---|---|---|
| **v0.2.0** | ✅ Done | Recently used icons, history view, manage custom icons, service worker |
| **v0.3.0** | ✅ Done | Language learning (flashcard / writing / speaking), 5-language support, premium landing page |
| **v0.4.0** | ✅ Done | Dashboard i18n (EN+NO), supervisor pairing + patient history, accessibility preferences |
| **v0.5.0** | Near-term | Full ES/FR/DE translations, spaced repetition, QR device pairing, guardian dashboard |
| **v0.6.0** | Mid-term | Dynamic ARASAAC search, OBF import/export, full offline sync |
| **v0.5.0** near-term add | — | Persona landing pages (`/for-parents`, `/for-therapists`, `/for-schools`) |
| **v1.0.0** | Long-term | Production-ready, WCAG 2.1 AAA, App Store ready, dedicated marketing site |
