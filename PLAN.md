# Snakke — Development Plan

This document defines the phased development roadmap for Snakke. Each phase builds on the previous and is scoped to be achievable in focused sprints.

_Last updated: June 13, 2026 (session 19)_

> For regulatory, legal, funding, procurement, and market claims, [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) is the authoritative planning brief. Items below are implementation plans or hypotheses until validated as described there.

---

## ✅ Phase 0 — Foundation (Complete)

- [x] Next.js 16 App Router project setup
- [x] TypeScript + Tailwind CSS v4 configuration
- [x] Redux Toolkit state management (3 slices: communication, pairing, ui)
- [x] NextAuth v5 authentication (login / register)
- [x] Drizzle ORM + Neon Serverless Postgres (9-table schema incl. passwordHistory)
- [x] PWA manifest + `@serwist/next` (migrated from `@ducanh2912/next-pwa`)
- [x] Dark mode support
- [x] Clean monorepo structure (legacy Expo code removed)
- [x] Vercel deployment (zero-config, auto-detects Next.js)

---

## ✅ Phase 1 — Core AAC Communication (Complete)

- [x] Built-in icon database (101 icons, 6 categories)
- [x] **ARASAAC pictogram integration** — all 101 icons use real AAC pictograms (CC BY-NC-SA 4.0) via static CDN URLs
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
- [x] Favourite phrases (save/load/delete, persisted to IndexedDB, Redux slice) ✅
- [x] Recently used icons tracked in Redux state (`recentIcons`, max 20) and displayed in UI ✅

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
- [x] **Icon search bar** — searches across all 101 built-in + custom icons by name; hides category tabs and recently-used strip during search; `×` clear button; empty-state message ✅
- [ ] Icon board layout improvements (larger icons, better spacing for touch)
- [ ] Haptic feedback on icon tap (`navigator.vibrate` — schema supports `hapticEnabled` but not implemented)
- [ ] Keyboard-accessible icon navigation (ARIA labels exist, full keyboard nav not done)
- [ ] **Switch access / scanning mode** — scanning cursor moves through icons at a configurable interval; user activates selection via spacebar, single key, or Bluetooth button; required for users with severe motor disabilities (see SUGGESTIONS.md §18 for full spec)
- [ ] Long-press on icon to see icon details / delete custom icon
- [x] **Sentence reordering** — drag-and-drop to reorder icons in the built sentence
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
- [x] Icon translations for ES, FR, DE (all 101 icons)
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
- [x] QR code generation for pairing request ✅
- [x] QR code camera pairing — display QR in `QRCodeModal`, scan with device camera → opens `/join/[token]` pairing invite ✅
- [x] Accept/reject pairing on guardian's device ✅
- [x] **Direct communication redirect** — supervisor roles redirected to `/dashboard/patients/[requesterId]` after acceptance (GET `/api/pairings/accept` now returns `requesterId`) ✅
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
- [x] **Live pictogram thread between paired users** — `CommunicateThread` component with 3s polling, room tabs for multiple pairs, pictogram + text message rendering ✅
- [x] **GET /api/messages/room** — merged conversation thread, `?since=` for incremental polling ✅
- [x] **POST /api/messages** — send pictogram sentence as message ✅
- [x] **Compact communicate page redesign** — collapsible thread bar (40px collapsed with unread badge), compact SentenceBuilder row, slim mode tabs with inline search toggle, icon board takes dominant space ✅
- [x] **Sound + visual notifications** — Web Audio API 2-note chime on incoming message; collapsed bar glow-pulse; unread badge bounce; message slide-in animation ✅
- [ ] WebSocket or Vercel Pusher for true real-time (replace 3s polling)
- [ ] Guardian sees child's sentence being built in real time
- [ ] Optional: in-app QR scanner (`html5-qrcode` installed) — would allow scanning from within Snakke instead of native camera app

---

## 📋 Phase 4 — Offline & PWA Hardening

**Goal**: Define and verify an offline capability matrix for priority workflows, then implement conflict-safe synchronization where required.

- [x] **Service worker** — `@serwist/next` + `src/app/sw.ts`; `public/sw.js` generated at build time; correct `Cache-Control: no-cache` headers ✅
- [x] Service worker caching strategy — `defaultCache` (stale-while-revalidate for assets) ✅
- [x] **PWA icons** — `icon-192.png` + `icon-512.png` in `public/`; Chrome installability requires valid icon files ✅
- [ ] Background sync — upload sessions when back online
- [ ] Offline-capable custom icon upload queue
- [ ] Install prompt / "Add to Home Screen" guidance
- [ ] Push notifications for guardians (message received)

---

## 📋 Phase 5 — Icon Library Expansion

**Goal**: Grow beyond the current 101 static ARASAAC pictograms.

- [x] ARASAAC static CDN integration (101 icons, all categories) ✅
- [ ] Dynamic ARASAAC API search — search 30,000+ symbols by keyword at runtime
- [ ] Cache downloaded ARASAAC symbols to IndexedDB for offline use
- [ ] **Open Board Format (OBF/OBZ)** import/export
  - Import community-shared boards (.obz files)
  - Export user boards for use in other AAC apps
- [ ] AI image generation for custom icons (DALL-E / Stable Diffusion)

---

## 📋 Phase 5.5 — Community-Contributed Icon Library (Planned)

**Goal**: Transform icon system into a multi-tier library where therapists, parents, and other users can upload, share, and curate pictograms.

### Current System
- 101 static ARASAAC pictograms (built-in, read-only)
- Per-user custom icons (private, single-user)
- No sharing or community contribution

### Future System
- **Built-in icons** — 101 ARASAAC pictograms (maintained by core team)
- **Community pictograms** — therapist/parent/teacher uploads (moderated, multilingual)
- **Shared sets** — therapists can curate sets for their patients
- **Variants** — users can create custom label overrides on shared pictograms

### Database Schema Additions

```sql
CREATE TABLE pictograms (
  id UUID PRIMARY KEY,
  createdById UUID REFERENCES users.id,
  name VARCHAR(100),
  category VARCHAR(50),  -- Needs, Actions, Feelings, People, Places, etc.
  imageUrl TEXT,         -- Blob storage or ARASAAC reference
  description TEXT,
  language VARCHAR(10),  -- en, no, es, fr, de
  tags TEXT[],          -- searchable: ["help", "assist", "support"]
  isPublic BOOLEAN DEFAULT false,
  licenseType VARCHAR(50),  -- CC_BY_NC_SA, CUSTOM, PROPRIETARY
  approvalStatus VARCHAR(20),  -- pending, approved, rejected
  viewCount INT DEFAULT 0,
  rating FLOAT,  -- 1.0-5.0 average star rating
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE pictogram_variants (
  id UUID PRIMARY KEY,
  pictogramId UUID REFERENCES pictograms.id,
  userId UUID REFERENCES users.id,
  labelOverride VARCHAR(100),  -- custom name for this variant
  imageUrlOverride TEXT,       -- custom image (optional)
  createdAt TIMESTAMP
);

CREATE TABLE pictogram_shares (
  id UUID PRIMARY KEY,
  pictogramId UUID REFERENCES pictograms.id,
  sharedById UUID REFERENCES users.id,
  sharedWithId UUID REFERENCES users.id,  -- recipient user
  shareType VARCHAR(20),  -- view, use, edit
  createdAt TIMESTAMP
);

CREATE TABLE pictogram_sets (
  id UUID PRIMARY KEY,
  createdById UUID REFERENCES users.id,
  name VARCHAR(100),     -- "School therapy set", "Home communication", etc.
  description TEXT,
  pictogramIds UUID[],   -- ordered array of icon IDs
  isPublic BOOLEAN,
  createdAt TIMESTAMP
);
```

### API Endpoints (New)

```
POST /api/pictograms                         -- Upload new community pictogram
GET /api/pictograms?public=true              -- Discover public pictograms
GET /api/pictograms?shared-with-me=true      -- Get pictograms shared with me
GET /api/pictograms?createdBy=[userId]       -- User's own uploads
GET /api/pictograms/trending                 -- Popular pictograms (by rating/views)
POST /api/pictograms/[id]/rate               -- Rate (1-5 stars)
POST /api/pictograms/[id]/share              -- Share with user/therapist/patient
GET /api/pictograms/sets                     -- My saved pictogram sets
POST /api/pictograms/sets                    -- Create new set
DELETE /api/pictograms/sets/[id]             -- Delete set
```

### Components & Features

1. **Pictogram Upload UI** (`/dashboard/icons/upload-community`)
   - Title, description, category, language, tags
   - License selection (CC BY-NC-SA, Custom)
   - Public vs. private toggle
   - Submit for approval workflow

2. **Community Pictogram Marketplace** (`/marketplace/pictograms`)
   - Search + filter (category, language, rating, license)
   - Star rating display
   - "Share with my patients" button (for therapists)
   - Download stats, user reviews

3. **Approval Workflow** (Admin dashboard)
   - Queue of pending pictograms
   - Approve / reject / request changes
   - Licensing verification
   - Content moderation (appropriate for children)

4. **Icon Grid Integration**
   - Show built-in (101) + community pictograms merged
   - Mark pictogram source ("ARASAAC", "Community", "My upload")
   - Seamless search across both

5. **Therapist Curation Tools** (`/dashboard/patients/[id]/icons`)
   - Curate a set of pictograms for specific patient
   - Share set with patient (read-only)
   - Mark "favorite" pictograms for easier access

### Implementation Order

- [ ] **Phase 5.5.1** — Database schema migration (add pictograms, variants, shares tables)
- [ ] **Phase 5.5.2** — Pictogram upload API + Vercel Blob integration for community images
- [ ] **Phase 5.5.3** — Admin approval workflow dashboard
- [ ] **Phase 5.5.4** — Community marketplace UI (`/marketplace/pictograms`)
- [ ] **Phase 5.5.5** — Pictogram sharing between users/therapists
- [ ] **Phase 5.5.6** — Icon grid merge (built-in + community, single search)
- [ ] **Phase 5.5.7** — Therapist curation tools for patient-specific sets

### Licensing & Moderation Considerations

- **Attribution**: Always credit pictogram creator
- **License**: User must declare license (CC BY-NC-SA, Custom, Proprietary)
- **Content**: Moderate for age-appropriate imagery (children are users)
- **Versioning**: Track updates to pictograms (in case remixes are created)
- **Derivatives**: If a pictogram remixes ARASAAC, mark clearly and include original credit

### Performance & Search

- Semantic search (Phase 6) should index community + built-in pictograms
- Search results: sort by (1) rating, (2) recency, (3) usage frequency
- Lazy load community pictograms (don't load all 10k+ icons on startup)
- Cache user's "my pictograms" in Redux for fast access

### Security & Permissions

- Users can only edit/delete their own pictograms
- Therapist can revoke share at any time
- Shared pictograms are **read-only** for recipients (no edit)
- Admin can remove inappropriate content immediately

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

2. **Index build** — On startup (or after a custom icon change) the app embeds every icon's effective name (label override → name) into a 384-dimensional float32 vector. Built-in icons: ~101 vectors, cached to IndexedDB. Custom icons: embedded on demand.

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

## 📋 Phase 9 — Research & Institutional Platform

**Goal**: Transform Snakke into a multi-purpose research platform serving institutions, schools, therapists, and researchers alongside individual families.

### Current State
- Individual user accounts (child, parent, therapist, teacher)
- Per-user data (communication sessions, preferences, custom icons)
- No institutional aggregation, no research framework, no compliance tracking

### Future State
- **Institutional accounts** — schools, clinics, hospitals, universities, research centers
- **Multi-user organizations** — admins, therapists, teachers, researchers managing cohorts
- **Research participation framework** — digital consent forms, IRB tracking, data export APIs
- **Compliance & Privacy validation** — GDPR and Norwegian privacy-law readiness; assess HIPAA, FERPA, and institutional agreements only where market scope makes them applicable
- **Analytics dashboard** — research metrics, anonymized data aggregation, secure export
- **Multi-tier licensing** — free individual, professional therapist tier, institutional/research tier

### Database Schema Additions

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),              -- school, clinic, hospital, university, research_center
  country VARCHAR(2),            -- NO, US, etc.
  tier VARCHAR(20),              -- free, professional, institutional, research
  adminUserId UUID REFERENCES users.id,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY,
  organizationId UUID REFERENCES organizations.id,
  userId UUID REFERENCES users.id,
  role VARCHAR(50),              -- admin, therapist, teacher, researcher, member
  joinedAt TIMESTAMP
);

CREATE TABLE organization_settings (
  organizationId UUID PRIMARY KEY,
  dataRetentionMonths INT,       -- Auto-delete policy
  allowDataExport BOOLEAN,       -- Can members export data?
  researchApproved BOOLEAN,      -- Has ethics board approval?
  irbNumber VARCHAR(100),        -- IRB approval number for research
  dataProcessingAgreement TEXT,  -- DPA reference / link
  consentRequired BOOLEAN,       -- Require explicit consent from users?
  createdAt TIMESTAMP
);

CREATE TABLE research_studies (
  id UUID PRIMARY KEY,
  organizationId UUID REFERENCES organizations.id,
  researcherId UUID REFERENCES users.id,
  name VARCHAR(255),
  description TEXT,
  irbNumber VARCHAR(100),
  irbApprovalUrl TEXT,
  participantCount INT DEFAULT 0,
  dataCollectionStarted TIMESTAMP,
  dataCollectionEnded TIMESTAMP,
  createdAt TIMESTAMP
);

CREATE TABLE research_consent (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users.id,
  studyId UUID REFERENCES research_studies.id,
  consentType VARCHAR(50),       -- individual, institutional, guardian
  consentDocument TEXT,          -- URL or embedded form
  consentedAt TIMESTAMP,
  withdrawnAt TIMESTAMP,         -- NULL if still active
  createdAt TIMESTAMP
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  action VARCHAR(100),           -- data_accessed, data_exported, consent_changed
  actor UUID REFERENCES users.id,
  targetUserId UUID REFERENCES users.id,  -- whose data was accessed
  organizationId UUID REFERENCES organizations.id,
  details JSON,
  createdAt TIMESTAMP
);

CREATE TABLE research_export_requests (
  id UUID PRIMARY KEY,
  researcherId UUID REFERENCES users.id,
  studyId UUID REFERENCES research_studies.id,
  exportType VARCHAR(50),        -- anonymized, identified
  exportedAt TIMESTAMP,
  expiresAt TIMESTAMP,           -- 24h download window
  downloadedAt TIMESTAMP,
  createdAt TIMESTAMP
);
```

### Core Features

#### 9.1 Institutional Account Management
- [ ] Organizations table (school, clinic, hospital, university, research center)
- [ ] Organization admin dashboard (`/dashboard/organization/admin`)
- [ ] Add/remove members (therapist, teacher, researcher roles)
- [ ] Organization settings (data retention, DPA, research approval status)
- [ ] Billing/subscription management (future: Stripe integration)

#### 9.2 Research Consent & Ethics
- [ ] Digital consent form builder (customizable, signed, versioned)
- [ ] Guardian consent for minors (parent/legal guardian approval required)
- [ ] Research study enrollment flow (link participant to study)
- [ ] IRB number tracking + approval documentation
- [ ] Withdrawal mechanism (user can opt out, data retained but marked)
- [ ] Audit logging (who accessed what data, when, for what purpose)

#### 9.3 Privacy & Data Governance
- [ ] Privacy tiers (public aggregated, institutional, individual/clinical)
- [ ] Anonymization pipeline (hash user IDs, strip PII, date-shifting)
- [ ] Data encryption at rest (database) + in transit (TLS)
- [ ] Data retention policies (auto-delete after X months)
- [ ] DPA templates (GDPR) + BAA templates (HIPAA)
- [ ] Compliance documentation

#### 9.4 Research Dashboard
- [ ] Researcher view: `/dashboard/research/`
  - [ ] Study management (create, enroll participants, view consent status)
  - [ ] Data analytics (usage patterns, communication frequency, vocabulary growth)
  - [ ] Secure data export (anonymized CSV/JSON with 24h download link)
  - [ ] Visualization (word clouds, progress charts, cohort comparisons)
  - [ ] Collaboration (share study with co-researchers)
- [ ] Institution admin view: `/dashboard/organization/analytics/`
  - [ ] Aggregated metrics (total users, communication sessions, popular icons)
  - [ ] Per-therapist productivity stats
  - [ ] Data export for institutional reporting

#### 9.5 Research Data Export API
- [ ] Secure endpoint: `GET /api/research/export?studyId=X&format=csv&anonymized=true`
- [ ] Generates one-time download link (24h expiry, email-confirmed access)
- [ ] CSV headers: `participant_id_hash`, `session_count`, `icons_used`, `top_icons`, `communication_duration`, `language_learning_progress`
- [ ] Audit trail (logged: researcher, what was requested, when, what was downloaded)
- [ ] Rate limiting (prevent data scraping)

#### 9.6 Compliance & Documentation
- [ ] Privacy policy (research section)
- [ ] Terms of service (institutional use)
- [ ] Data processing agreement (GDPR DPA template)
- [ ] Business associate agreement (HIPAA BAA template)
- [ ] IRB guidance document (for researchers applying for ethics approval)
- [ ] Data retention policy
- [ ] Breach notification procedure

#### 9.7 Multi-Tier Licensing
- [ ] **Free tier** — individual users, child + family (current)
- [ ] **Professional tier** — therapist with 1–5 patients, data export, analytics (paid)
- [ ] **Institutional tier** — school, clinic, 50+ members, organization admin dashboard, DPA, custom domain (paid)
- [ ] **Research tier** — 100+ members, study management, consent forms, audit logging, priority support (paid)

### Implementation Order

- [ ] **Phase 9.1** — Database schema (organizations, members, settings, audit log, research tables)
- [ ] **Phase 9.2** — Organization sign-up + admin dashboard (member management, settings)
- [ ] **Phase 9.3** — Research consent framework (digital forms, IRB tracking, withdrawal)
- [ ] **Phase 9.4** — Anonymization pipeline + audit logging
- [ ] **Phase 9.5** — Research dashboard (study management, analytics, export)
- [ ] **Phase 9.6** — Compliance documentation (DPA, BAA, privacy policy updates)
- [ ] **Phase 9.7** — Multi-tier licensing + Stripe billing integration

### Key Differentiator vs. Competitors

Existing AAC software (Proloquo2Go, Predictable, JABtalk):
- Designed for individual users
- Limited research support (some have data export, but no consent/IRB framework)
- Not open-source
- Not multilingual (EN only or limited languages)

**Snakke's hypotheses to validate**:
- 🔬 Research workflows may become a differentiator after consent, ethics-review, anonymization, and audit requirements are implemented and validated
- 🌍 Multilingual (EN/NO/ES/FR/DE) — unique for Scandinavian/European research
- 💚 Source-available prototype; an explicit license is required before open-source reuse claims are made
- 📱 Installable PWA with selected local persistence; complete offline workflows and synchronization remain planned
- 🎓 Low-cost/open development model; licensing and sustainable operating costs must be formalized
- 🏛️ Architecture can be evaluated for institutional scaling after tenancy, security, and procurement requirements are validated

### Compliance Roadmap

| Standard | Priority | Status | Notes |
|---|---|---|---|
| **GDPR** (EU) | Critical | 🔲 | Consent, DPA, right to deletion, audit logs |
| **HIPAA** (US healthcare) | Critical | 🔲 | BAA, encryption, audit logs, access controls |
| **FERPA** (US education) | High | 🔲 | Student data privacy, institutional agreement |
| **CCPA** (California, US) | High | 🔲 | Consumer privacy, disclosure, data sale opt-out |
| **SOC 2** (service provider audit) | Medium | 🔲 | Annual audit, security controls, compliance report |
| **ISO 27001** (information security) | Medium | 🔲 | Documented policies, risk assessment, incident response |
| **Norwegian privacy law / Datatilsynet guidance** | Critical | 🔲 | Establish lawful basis, assess Article 9 applicability, complete DPIA where required, and review processor, transfer, and privacy-by-design controls |

---

## Decision Matrix (Compliance-First)

This matrix compares the highest-impact next tasks against the assessment topics in the strategic brief, including lawful basis, Article 9 applicability, RLS, data residency, institutional onboarding, and grant feasibility.

| Candidate Task | Strategic Alignment | Compliance Risk Reduction | Delivery Effort | Time-to-Value | Decision |
|---|---|---|---|---|---|
| **A. DB multi-tenant hardening (RLS + tenant boundaries + policy tests)** | Very High | Very High | Medium | High | **Do now (Sprint 1)** |
| **B. Consent + audit foundation (research consent records, audit_log, withdrawal flow)** | Very High | Very High | Medium-High | High | **Do now (Sprint 1-2)** |
| **C. Institutional org model (organizations + members + roles + admin shell)** | Very High | High | Medium | Medium-High | **Do next (Sprint 2)** |
| D. Dynamic ARASAAC search | Medium | Low | Medium | Medium | Defer |
| E. Marketing persona pages | Medium | Low | Low | Medium | Defer until compliance foundation is shipped |
| F. Native app (Capacitor) | Low-Medium | Low | High | Low | Defer |

### Selected Next 3 Tasks

1. **A. DB multi-tenant hardening**
2. **B. Consent + audit foundation**
3. **C. Institutional org model**

### Sprint-Ready Implementation Checklist (Next Execution)

#### Sprint 1: Task A - DB multi-tenant hardening (RLS + policy tests)

**Objective**: enforce tenant isolation in Postgres, not only in application code.

**Migrations (Drizzle SQL)**
- [x] Stage `tenants`, nullable `users.tenant_id`, tenant policy, and `withTenantContext()` in code
- [ ] Create and review migration: `00xx_rls_foundation.sql`
- [ ] Apply the migration in each environment before removing pre-tenant compatibility queries
- [ ] Enable RLS on all tenant-sensitive tables:
  - `pairings`
  - `pairing_requests`
  - `messages`
  - `communication_sessions`
  - `user_preferences`
  - `custom_icons`
  - `organizations`
  - `organization_members`
  - `research_studies`
  - `research_consent`
  - `audit_log`
- [ ] Add helper SQL function: `app.current_user_id()` (reads request JWT subject / app context)
- [ ] Add helper SQL function: `app.current_org_id()` (for org-scoped routes)
- [ ] Create RLS policies:
  - [ ] `tenant_isolation_select`
  - [ ] `tenant_isolation_insert`
  - [ ] `tenant_isolation_update`
  - [ ] `tenant_isolation_delete`
- [ ] Add explicit deny policy for cross-org access attempts

**Verification**
- [ ] Verify `tenants` and `users.tenant_id` exist in each target database
- [ ] Verify login, registration, verification, and password reset before and after migration
- [ ] Add SQL policy tests in migration comments or integration checks
- [ ] Add test script in `scripts/rls-smoke-test.ts`:
  - [ ] User A cannot read User B session rows
  - [ ] Therapist in Org A cannot read Org B members
  - [ ] Cross-tenant `UPDATE` returns zero rows / permission denied

**Acceptance Criteria**
- [ ] No tenant-sensitive query returns cross-tenant rows when called with constrained user context
- [ ] RLS remains enabled in all non-local environments
- [ ] Policy test script passes in CI

#### Sprint 1-2: Task B - Consent + audit foundation

**Objective**: make all research data access consent-aware and auditable.

**Migrations (Drizzle SQL)**
- [ ] Create migration: `00xy_consent_audit_foundation.sql`
- [ ] Ensure `research_consent` supports lifecycle:
  - [ ] `consentedAt`
  - [ ] `withdrawnAt`
  - [ ] `consentVersion`
  - [ ] `consentType` (`individual`, `guardian`, `institutional`)
- [ ] Ensure `audit_log` fields are normalized:
  - [ ] `actor`
  - [ ] `action`
  - [ ] `targetUserId`
  - [ ] `organizationId`
  - [ ] `details` (JSON)
  - [ ] `createdAt`

**API Endpoints (exact first cut)**
- [ ] `POST /api/research/consent`
  - Input: `studyId`, `consentType`, `consentVersion`, `documentId`
  - Output: consent record with `consentedAt`
- [ ] `POST /api/research/consent/withdraw`
  - Input: `studyId`, `reason` (optional)
  - Output: consent record with `withdrawnAt`
- [ ] `GET /api/research/consent/:studyId`
  - Output: active/withdrawn consent status for caller
- [ ] `POST /api/audit/log`
  - Internal-only route or service wrapper; writes structured audit events

**Service Layer**
- [ ] Add `src/lib/compliance/audit.ts` with `logAuditEvent(...)`
- [ ] Add `src/lib/compliance/consent.ts` with `hasActiveConsent(userId, studyId)`
- [ ] Wire consent check before any research export/data endpoint response

**Acceptance Criteria**
- [ ] Any export or study read path requires active consent (or institutional lawful basis)
- [ ] Consent withdrawal takes effect immediately for future reads/exports
- [ ] All consent create/withdraw/read actions emit audit log events

#### Sprint 2: Task C - Institutional org model

**Objective**: enable institution onboarding and role-managed access.

**Migrations (Drizzle SQL)**
- [ ] Create migration: `00xz_org_model.sql`
- [ ] Create/verify tables:
  - [ ] `organizations`
  - [ ] `organization_members`
  - [ ] `organization_settings`
- [ ] Add unique constraints:
  - [ ] one membership per `(organizationId, userId)`
  - [ ] one settings row per organization

**API Endpoints (exact first cut)**
- [ ] `POST /api/organizations`
  - Create organization, set creator as admin
- [ ] `GET /api/organizations/me`
  - Return organizations and roles for current user
- [ ] `POST /api/organizations/:id/members`
  - Add member by email + role
- [ ] `PATCH /api/organizations/:id/members/:memberId`
  - Update member role
- [ ] `DELETE /api/organizations/:id/members/:memberId`
  - Remove member
- [ ] `PATCH /api/organizations/:id/settings`
  - Update retention/export/consent-required flags

**UI First Slice**
- [ ] `/dashboard/organization/admin` shell page
- [ ] Member table (name/email/role/status)
- [ ] Invite member form (email + role)
- [ ] Settings form (retention months, export toggle, consent required)

**Acceptance Criteria**
- [ ] Only organization admins can manage members/settings
- [ ] Non-members get 403 for org-scoped endpoints
- [ ] Organization member changes are audited

#### Cross-cutting dependencies and definition of done

- [ ] Add feature flags:
  - [ ] `RESEARCH_MODE_ENABLED`
  - [ ] `ORG_MODE_ENABLED`
- [ ] Add API guard utilities:
  - [ ] `requireOrgRole(orgId, ['admin', ...])`
  - [ ] `requireResearchConsent(studyId)`
- [ ] Add docs updates after implementation:
  - [ ] [README.md](README.md)
  - [ ] [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
  - [ ] [CHANGELOG.md](CHANGELOG.md)
- [ ] Build + lint + tests green before merge

#### Estimated timeline

| Sprint | Scope | Duration |
|---|---|---|
| Sprint 1 | Task A complete + Task B schema/services start | 1 week |
| Sprint 2 | Task B endpoints complete + Task C org model/API/UI shell | 1 week |
| Sprint 3 (buffer) | hardening, security review, docs, pilot prep | 3-5 days |

### Rationale

- These three tasks directly satisfy the project brief's non-negotiables and unblock external GDPR/WCAG auditing and pilot institutional onboarding.
- They also reduce downstream rework by establishing legal and data architecture constraints before feature expansion.

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
| Device pairing (QR) | High | High | **P3** | ✅ Done |
| Dynamic ARASAAC search | High | Medium | **P3** | 🔲 |
| OBF import/export | Medium | Medium | **P3** | 🔲 |
| Offline sync | High | High | **P3** | 🔲 |
| ML icon matching | Medium | Very High | **P4** | 🔲 |
| Switch access | High | Very High | **P4** | 🔲 |
| Native app | Medium | High | **P4** | 🔲 |
| Persona landing pages (/for-parents etc.) | High | Low | **P2** | 🔲 |
| Dedicated marketing site (snakke.no) | Medium | Medium | **P3** | 🔲 |
| **Research & Institutional Platform (foundation)** | **Critical** | **Very High** | **P1** | 🔲 |
| **Organizational account management** | High | High | **P1** | 🔲 |
| **Research consent framework** | Critical | High | **P1** | 🔲 |
| **Compliance (GDPR, HIPAA, FERPA)** | Critical | Very High | **P1** | 🔲 |

---

## Milestones

| Milestone | Target | Description |
|---|---|---|
| **v0.2.0** | ✅ Done | Recently used icons, history view, manage custom icons, service worker |
| **v0.3.0** | ✅ Done | Language learning (flashcard / writing / speaking), 5-language support, premium landing page |
| **v0.4.0** | ✅ Done | Dashboard i18n (EN+NO), supervisor pairing + patient history, accessibility preferences |
| **v0.5.0** | Near-term | Full ES/FR/DE translations, spaced repetition, QR device pairing, guardian dashboard |
| **v0.5.1** | Near-term | Compliance foundation sprint: RLS hardening, consent records, audit logging, organization core schema |
| **v0.6.0** | Mid-term | Dynamic ARASAAC search, OBF import/export, full offline sync |
| **v0.7.0** | Mid-term | Community pictograms (Phase 5.5), semantic icon search (Phase 6) |
| **v0.8.0** | Long-term | Switch access, eye-gaze compatibility, WCAG 2.1 AAA |
| **v1.0.0** | Long-term | Production-ready, dedicated marketing site (snakke.no) |
| **v1.1.0** | Post-launch | Research & Institutional Platform (Phase 9) — organizations, consent, compliance |
| **v1.2.0** | Post-launch | Native iOS/Android App Store distribution (Capacitor) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         SNAKKE v1.1+                             │
│                 Research & Institutional Platform                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐
│   Individual Users   │    │   Institutions       │
│                      │    │  (Schools, Clinics)  │
│ • Child + Family     │    │                      │
│ • Therapist (1-5p)   │    │ • Admins             │
│ • Free tier          │    │ • Multi-therapists   │
└──────────────────────┘    │ • Paid tier          │
                            └──────────────────────┘
        ↓                               ↓
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │   AUTH & PERMISSIONS         │
        │  (JWT + Role-based access)   │
        └──────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │   CORE AAC FEATURES          │
        │  (Icons, TTS, SentenceBuilder)
        └──────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │   RESEARCH LAYER (Phase 9)   │
        │                              │
        │ ┌────────────────────────┐   │
        │ │ Consent Management     │   │
        │ │ (Digital forms, IRB)   │   │
        │ └────────────────────────┘   │
        │ ┌────────────────────────┐   │
        │ │ Anonymization          │   │
        │ │ (Hash, deidentify)     │   │
        │ └────────────────────────┘   │
        │ ┌────────────────────────┐   │
        │ │ Audit Logging          │   │
        │ │ (Who, what, when, why) │   │
        │ └────────────────────────┘   │
        │ ┌────────────────────────┐   │
        │ │ Analytics Dashboard    │   │
        │ │ (Export, metrics)      │   │
        │ └────────────────────────┘   │
        └──────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │   DATA LAYER                 │
        │  (Encrypted DB + Audit Logs) │
        └──────────────────────────────┘
```

---

## Success Metrics (Phase 9)

- **Adoption**: 50+ research participants enrolled across 5+ institutions
- **Compliance evidence**: required assessments completed, findings tracked, and applicable controls independently reviewed before regulated deployment
- **Research publications**: 3+ peer-reviewed papers using Snakke data
- **Institutional partnerships**: 2–3 university/hospital partnerships signed
- **Data quality**: 99%+ data integrity (no corruption, full audit trail)
- **Participant protection**: consent is informed and non-coercive, withdrawal is straightforward, and withdrawal rates are monitored without treating lower withdrawal as a success target
