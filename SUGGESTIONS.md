# Snakke — Suggestions & Improvement Ideas

This document captures improvement suggestions, UX observations, and technical recommendations based on a full review of the codebase, existing documentation, and the AAC market landscape.

_Last updated: May 27, 2026 (session 17)_

---

## 🔴 Critical (Fix Soon)

### 1. Auth Secret in Production
The `AUTH_SECRET` must be set in Vercel's environment variables. Without it, all logins will silently fail in production. A strong, unique secret has been generated — ensure it is added in Vercel → Settings → Environment Variables.

### 2. Service Worker ✅ Fixed (PWA Now Installs)
Migrated from `@ducanh2912/next-pwa` to `@serwist/next` + `serwist`. `next.config.ts` now wraps the Next.js config with `withSerwist`. The `src/app/sw.ts` service worker entry point uses `serwist`'s `defaultCache` and `__SW_MANIFEST` precache manifest. Builds with `--webpack` (Serwist is incompatible with Next.js 16's default Turbopack). `public/sw.js` is generated at build time.

**PWA icons added (session 14)**: Chrome's installability check validates icon files. `public/icon-192.png` and `public/icon-512.png` were missing, preventing Chrome from showing the install button (Firefox was more lenient). Placeholder branded icons created — black background, `#0ea5e9` blue "S". `manifest.json` split `"any maskable"` into separate `purpose: "any"` and `purpose: "maskable"` entries as required by the spec.

**Additional deduplication work completed (session 4)**:
- `src/lib/utils/constants.ts` — Centralised all `localStorage` keys under `STORAGE_KEYS` (dashes format). Added `APP_FEATURE_SUMMARY` constant for description strings.
- `src/hooks/usePreferences.ts` — New shared hook; fetches `/api/preferences`, dispatches to Redux `uiSlice`, consumed by `SentenceBuilder` and settings page.
- `src/components/features/communication/IconMatchGrid.tsx` — New shared component for icon match result grids; consumed by `TextToIcons` and `SpeechToIcons`.
- `DarkModeToggle` — Now dispatches `setTheme` to Redux alongside DOM/localStorage update.
- `LanguageContext` — Uses `STORAGE_KEYS.LANGUAGE` instead of hardcoded string.
- `layout.tsx` + `llms.txt/route.ts` — Use `APP_FEATURE_SUMMARY` constant instead of hardcoded copy.

**Hydration fix + `mounted` guard removed (session 14)**: `LanguageContext` previously used a `useState(false)` + `useEffect(() => setMounted(true))` pattern to avoid hydration mismatches. This caused a cascading-render React warning. Fixed by ensuring both server and client snapshots return `'no'` (Norwegian default) — `useSyncExternalStore` handles the hydration transition correctly without extra state.

### 3. No `/error` Route ✅ Fixed
The auth config previously redirected to `/error` which doesn't exist, causing a 404 on any auth failure. Fixed to redirect to `/login` instead. Consider adding a dedicated, user-friendly error page at `/app/(auth)/error/page.tsx`.

### 3a. Build Errors ✅ Fixed (May 17, 2026 session 2)
Three TypeScript/build errors resolved:
- `communicate/page.tsx` — `icon.label` → `icon.name` (`label` doesn't exist on the `Icon` type)
- `indexedDB.ts` — `MetadataValue` union extended with `unknown[]` so arrays can be stored (favourite phrases)
- `baseApi.ts` — removed dead `state.auth.token` reference (auth slice was never registered; NextAuth cookie handles auth)

### 3b. Dark Mode Toggle Not Applying ✅ Fixed (May 17, 2026 session 3)
The dark mode toggle button was added but had no visual effect. Root cause: Tailwind v4 ignores the `darkMode: 'class'` option from `tailwind.config.ts` (v3 API). Fixed by:
- Adding `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css` — wires `dark:` utilities to `.dark` class on `<html>`
- Moving CSS variable overrides to a `.dark {}` selector (class-based) with a `:root:not(.dark):not(.light)` media query fallback for users who haven't toggled
- `DarkModeToggle` now also sets a `light` class on explicit light-mode choice, preventing the system-preference fallback from overriding it

### 4. BLOB_READ_WRITE_TOKEN for Production
Vercel Blob uploads require `BLOB_READ_WRITE_TOKEN` in the Vercel environment. Confirm this is set — without it, all custom icon uploads will fail silently in production.

---

## 🟠 High Priority Improvements

### 5. Landing Page ✅ Complete
The landing page has been fully redesigned and translated. It is now a `'use client'` component (`LandingPage.tsx`) that uses the `LanguageContext` for full EN/NO translation. The `page.tsx` server component acts as a thin auth guard that renders `<LandingPage />` for unauthenticated users and redirects to `/dashboard` for signed-in users.

### 6. ARASAAC Integration ✅ Implemented (Static CDN)
All 95 built-in icons now use real ARASAAC pictograms (CC BY-NC-SA 4.0):
- Image URL format: `https://static.arasaac.org/pictograms/{id}/{id}_500.png`
- IDs selected via the ARASAAC public API, preferring `aac:true + schematic:true` results
- `IconGrid.tsx` renders `<img>` when `imageUrl` is set, falls back to emoji symbol
- **Session 8 additions**: 6 new icons added — `you` (6625), `they` (7031) in People category; `up` (5388), `down` (24723), `left` (9203), `right` (9202) in Actions category
- Keyword mappings (`en.ts` + `no.ts`) and translations in all 5 languages updated to match
- **Next step**: Dynamic ARASAAC search (query 30,000+ symbols at runtime and cache them)

### 7. Favourite Phrases ✅ Implemented
Save frequently used sentences (e.g., "I want water", "I need help"). Implemented:
- Save current sentence as a favourite with the ⭐ button in `SentenceBuilder`
- Favourites panel shows below sentence builder — tap to load, tap again to remove
- Persisted to IndexedDB (`metadata` store, key `favorite_phrases`) — survives page refresh offline
- Redux `favoritePhrases` slice with IDB rehydration on app mount

### 8. Voice Settings ✅ Implemented
The Web Speech API supports `rate`, `pitch`, and `voice` selection. Fully implemented:
- `/dashboard/settings` page with speed (0.5–2.0x) and pitch (0.5–2.0x) sliders + test button
- Settings auto-saved to `/api/preferences` (Neon DB) via PATCH on every slider change
- `SentenceBuilder` reads `voiceSpeed` and `voicePitch` from preferences on mount
- Language-aware TTS: EN → `en-US`, NO → `nb-NO`

### 8a. Speech → Icon Language Bug ✅ Fixed
`SpeechToIcons` previously hardcoded `'en-US'` for the speech recognizer and `'en'` for the icon matcher regardless of the current app language. Fixed:
- Recognizer now uses `nb-NO` when Norwegian is active, `en-US` for English
- Recognizer is recreated when language changes (proper `useEffect` dependency)
- `matchTextToIcons` receives the current locale

---

## 🟡 Medium Priority Improvements

### 9. Language Learning — Pedagogy & Content ⚠️ Needs Domain Experts
The technical framework for language learning is complete (flashcard / writing / speaking modes, 5 languages). What is missing is domain expertise:
- **Vocabulary ordering** — core/functional words should come before abstract ones. An SLP or language teacher should define the progression per language pair.
- **Spaced repetition** — implement SM-2 or Leitner algorithm so difficult cards reappear sooner. The current deck is sequential.
- **Native speaker review** — ES/FR/DE icon labels were machine-translated; native speakers should verify accuracy and natural phrasing.
- **Audio samples** — TTS is a good start but recorded audio from native speakers is more reliable for learners, especially for non-standard accents.

### 10. Full ES / FR / DE UI Translations
Currently ES, FR, and DE only have icon-label translations. All navigation, learning mode labels, auth pages, and dashboard text remain in English for those languages. A professional translator or bilingual contributor is needed per language. The contribution path is straightforward — add keys to the dictionary in `LanguageContext.tsx` matching the EN/NO pattern.

### 11. Collaboration & Contributor Onboarding
As the project grows it needs non-developer contributors:
- **SLPs (Speech-Language Pathologists)** — core AAC vocabulary curation, icon categorisation, learning progression
- **Special education teachers** — classroom-specific icon sets, difficulty levels
- **AAC users and families** — usability testing, real-world feedback
- **Translators** (ES, FR, DE, and future languages) — UI strings and icon labels
- Useful resources: [ISAAC](https://www.isaac-online.org), [ARASAAC](https://arasaac.org), [Cboard](https://www.cboard.io) community

### 12. Haptic Feedback
The DB schema already has `hapticEnabled`. `navigator.vibrate` is available in Android Chrome and most mobile browsers. A simple `vibrate(30)` on icon tap would improve the tactile experience for motor-impaired users. The accessibility preferences UI toggle is already wired to the DB — just needs the `vibrate` call in `IconGrid.tsx`.

### 13. Keyboard-Accessible Icon Navigation
ARIA labels exist on all icons but full keyboard nav (Tab to focus, Enter to select, arrow keys between icons) is not implemented. This is important for users with motor impairments who use keyboards or switch access devices.

### 14. Communication History View ✅ Implemented
Full `/dashboard/history` page is live:
- **Child view**: shows own sessions (up to 50), grouped by date
- **Supervisor view** (teacher / therapist / guardian with accepted pairings): dropdown lists all paired children/patients; switching the selector reloads sessions for that person
- Each session card: quoted sentence, time, icon chips (ARASAAC image + name label), and a **"Replay in communicator"** button that loads the icons into the sentence builder and navigates to `/communicate`
- `/api/sessions GET` extended with `?userId=` param — enforces pairing check before returning another user's data (returns `403` if no accepted pairing exists)
- `/api/sessions/paired-users GET` — new endpoint returning children linked to the current user
- Dashboard "Recent Activity" card is now a real link to `/dashboard/history`

### 15. Manage Custom Icons (Delete / Rename) ✅ Implemented
The `/dashboard/icons` page now has full icon management:
- **Delete**: a `×` button appears on card hover (top-right); clicking shows an inline "Delete this icon? / Delete / Cancel" confirmation overlay — no accidental deletes
- **Rename**: clicking an icon's name turns it into an editable `<input>`; press `Enter` to save, `Escape` to cancel, or clicking away saves automatically
- `/api/icons/[id]` DELETE — ownership-verified; returns 404 if icon doesn't belong to user
- `/api/icons/[id]` PATCH — ownership-verified rename; validates name (1–100 chars), lowercases before saving

### 16. Accessibility Preferences UI ✅ Implemented
High contrast, reduce motion, text size, and haptic toggles are all live in `/dashboard/settings`. Each setting dispatches to the DB via `PATCH /api/preferences` and applies DOM classes (`high-contrast`, `reduce-motion`, `text-large`) immediately, with `localStorage` fallback for offline. The haptic toggle is wired to the `hapticEnabled` DB column — see item 12 for the remaining `navigator.vibrate` call needed in `IconGrid.tsx`.

### 17. Open Board Format (OBF) Support
OBF (`.obz` files) is the open standard for AAC boards, supported by Snap Core First, Cboard, and others. Adding import/export would:
- Let users migrate from other AAC apps to Snakke
- Allow sharing boards between Snakke users
- Connect Snakke to the broader AAC community ecosystem

### 18. Switch Access / Scanning Mode
Many users of AAC software cannot use a touchscreen directly. They use a single physical switch — a large button, sip-and-puff tube, foot pedal, or Bluetooth button — to scan through options. The app highlights icons one at a time; the user presses their switch when the desired icon is highlighted. This is a standard feature in all clinical-grade AAC apps.

**Market context**: Proloquo2Go supports 23 grid layouts and multiple switch/keyguard configurations; Tobii Dynavox SNAP supports full eye-gaze. Snakke's absence of switch access excludes users with severe motor disabilities and blocks clinical/insurance-funded deployments. Adding even basic single-switch scanning would open this segment.

**Implementation plan**:
- A `useSwitchAccess` hook that manages the scan cursor state (current index, running/paused)
- Configurable scan interval (default 2 s, adjustable in `/dashboard/settings`)
- Visual highlight ring on the currently scanned icon (CSS `outline` respecting high-contrast mode)
- Activation: `keydown` listener for `Space` / `Enter` selects the highlighted icon; any key can be remapped
- Bluetooth switch devices present as a keyboard keypress — no special hardware API needed
- `switchAccessEnabled` boolean added to user preferences (DB + `uiSlice`)
- Toggle in `/dashboard/settings` under Accessibility section
- Scan order: left-to-right, top-to-bottom within the visible icon grid; wraps to start
- Auto-pause when sentence builder is focused; resume when icon grid regains focus

**Files to modify**:
- `src/hooks/useSwitchAccess.ts` — new hook
- `src/components/features/IconGrid.tsx` — accept `scanIndex` prop, apply highlight class
- `src/app/(app)/dashboard/settings/page.tsx` — add toggle + interval slider
- `src/lib/db/schema.ts` — add `switchAccessEnabled` + `scanInterval` to preferences
- `src/app/api/preferences/route.ts` — handle new fields in PATCH

### 19. Icon Search ✅ Implemented
A search bar on the communicate page searches all 95 built-in icons + any uploaded custom icons by name. Hides category tabs and recently-used strip during search; `×` clear button; empty-state message.

### 20. Sentence & Grid Drag-and-Drop Reordering ⬅️ Planned (Phase 2.6)
**Problem**: Icons can be removed from the sentence but new taps always append to the end. If a user taps icons out of order (e.g. "want cookie I") they must clear and rebuild — no insert or reorder is possible. Similarly, icons in the picker grid cannot be reordered.

**Plan** (see PLAN.md Phase 2.6 for full detail):
- **Sentence reordering**: `@dnd-kit/sortable` wrapping the sentence strip; drag handles visible on desktop, long-press on mobile to enter reorder mode; new Redux action `reorderSentenceIcons(fromIndex, toIndex)` in `communicationSlice`
- **Grid sorting**: per-user per-category icon order, persisted to preferences DB; drag-reordering in `IconGrid.tsx` and `/dashboard/icons`

### 21. Language Auto-Detection ✅ Implemented
On first visit (no localStorage preference), `LanguageContext` checks `navigator.language`. If the browser reports `nb-*`, `nn-*`, or `no-*`, Norwegian is set automatically. localStorage preference always takes priority on subsequent visits.

### 22. Progressive Image Loading for Custom Icons
Custom icons uploaded to Vercel Blob are full-size images displayed in small tiles. Add `next/image` with proper `width` and `height` props and a blur placeholder for better perceived performance.

---

## 🟢 Enhancement Ideas (Future)

### 23. Social Sharing of Boards
Allow users to export their board layout (icon arrangement + custom icons) as a shareable link or file. Other users could import it with one click. Great for therapists who want to share vocabulary sets.

### 24. Context-Aware Icon Suggestions
Time-of-day based suggestions:
- Morning: breakfast, school, bus
- Evening: dinner, bath, sleep, story
Uses the device clock only — no server needed. Simple and impactful.

### 25. Icon Colour Coding (Fitzgerald Key)
The Fitzgerald Key is a standard colour-coding system used in AAC:
- Yellow = pronouns (I, you, he)
- Green = verbs (eat, want, go)
- Orange = nouns (water, ball, cat)
- Blue = adjectives (big, hot, happy)
- Pink = social words (please, thank you)

The `color` field already exists in the icon schema and data model. Applying these colours consistently would make Snakke immediately recognisable to therapists familiar with AAC conventions.

### 26. Multi-Page Boards
Professional AAC users have dozens of vocabulary pages (home, school, hospital, playground). Allow users to create named boards and switch between them. Similar to how Snap Core First or TouchChat works.

### 27. Therapist Analytics Portal
A dedicated view for therapists that shows:
- Word frequency over time (which icons the child uses most)
- Time-of-day communication patterns
- Progress tracking (new words introduced this week)
- Printable vocabulary report

### 28. Offline-First AI (TensorFlow.js)
Replace the keyword matching engine with a lightweight semantic embedding model that runs entirely in the browser. Benefits:
- Works offline
- Better fuzzy matching ("watter" → water)
- Cross-language matching without separate keyword maps
- Personalises over time from usage patterns

### 29. Sentence History
Store recently spoken sentences on the communicate page itself (not just in the history dashboard). A small "History" tab or slide-up panel showing the last 10 sentences — tap to reload directly into the sentence builder without navigating to `/dashboard/history`. The `communication_sessions` DB table already stores this data.

---

## Technical Debt to Address

| Issue | File | Recommendation |
|---|---|---|
| Service worker ✅ Fixed | `public/` | Migrated to `@serwist/next`; `public/sw.js` generated at build time |
| `turbopack.root` warning in build | `next.config.ts` | Set `turbopack.root` to suppress warning |
| `MULTILINGUAL_SETUP.md` is outdated | `MULTILINGUAL_SETUP.md` | Update to reflect current React Context approach (not next-intl) |
| `plan.txt` at root is empty | `plan.txt` | Delete or migrate to `PLAN.md` |
| `olama chat` folder at root | root | Should be gitignored or removed |
| `NEXTAUTH_SECRET` in README ✅ Fixed | `README.md` | Updated to `AUTH_SECRET` + `AUTH_URL` (NextAuth v5) |
| RTK Query `baseApi` | `src/store/api/baseApi.ts` | Configured but no endpoints defined — either add endpoints or remove if unused |
| icon-192.png 404 | `public/` | `/icon-192.png` returns 404 — referenced in manifest but file missing |

---

## Competitive Landscape

| App | Strengths | What Snakke Does Better |
|---|---|---|
| **Cboard** | Open source, OBF support | Better offline PWA, smarter icon matching |
| **Snap Core First** | Industry standard | Free, open source, modern web |
| **TouchChat** | Robust vocabulary | No vendor lock-in, custom icons easy |
| **Proloquo2Go** | Best-in-class UX | Available on Android + web, not just iOS |
| **LetMeTalk** (Android) | Simple, free | Better i18n, web-based |

**Snakke's differentiators to lean into**:
1. **Truly free and open source** — no subscription
2. **Works offline** as a PWA without an app store
3. **Custom icon upload** with user's own photos
4. **ARASAAC pictograms** — professional AAC-grade symbols
5. **Multilingual** from the ground up (EN + NO, easily extendable)
6. **Modern tech** — easy to contribute to and extend
