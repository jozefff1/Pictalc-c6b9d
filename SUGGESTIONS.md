# Pictalk — Suggestions & Improvement Ideas

This document captures improvement suggestions, UX observations, and technical recommendations based on a full review of the codebase, existing documentation, and the AAC market landscape.

_Last updated: May 17, 2026 (session 3)_

---

## 🔴 Critical (Fix Soon)

### 1. Auth Secret in Production
The `AUTH_SECRET` must be set in Vercel's environment variables. Without it, all logins will silently fail in production. A strong, unique secret has been generated — ensure it is added in Vercel → Settings → Environment Variables.

### 2. Service Worker Missing ⚠️ PWA Cannot Install
`@ducanh2912/next-pwa` is configured in `next.config.ts` and the manifest is in place, but **no `public/sw.js` file exists**. The PWA will fail to install on any device. The service worker must be generated (next-pwa does this at build time — verify the production build output).

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

### 5. Landing Page Redesign ⚠️ Partially Done
The current landing page has a basic hero section and a 3-card features block — functional but not compelling. First impressions matter enormously for an app aimed at caregivers and therapists evaluating AAC tools. Recommend:
- Live demo / preview of the icon board (screenshot or interactive embed)
- Clear value proposition ("Works offline, always ready")
- "Who is this for?" section (child, guardian, therapist, teacher)
- Testimonials or trust signals
- Glassmorphism / premium dark design matching the app

### 6. ARASAAC Integration ✅ Implemented (Static CDN)
All 89 built-in icons now use real ARASAAC pictograms (CC BY-NC-SA 4.0):
- Image URL format: `https://static.arasaac.org/pictograms/{id}/{id}_500.png`
- IDs selected via the ARASAAC public API, preferring `aac:true + schematic:true` results
- `IconGrid.tsx` renders `<img>` when `imageUrl` is set, falls back to emoji symbol
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
- Confidence threshold lowered from `0.7` to `0.3` (matching `TextToIcons`) — partial matches now auto-add to sentence

### 9. Email Verification ✅ Implemented
Full email verification flow via Resend:
- On register: 32-byte hex token, 24h expiry, verification email sent
- `/api/auth/verify-email` POST route validates token, marks `emailVerified: true`
- `/verify-email` page: "check inbox" state (`?email=`) or auto-verify state (`?token=`)
- Unverified users are blocked from signing in

### 10. Forgot Password / Reset ✅ Implemented
Full password reset flow:
- `/forgot-password` page — email form, sends reset link, 1-hour expiry
- `/reset-password?token=` page — new password with strength validation
- `/api/auth/reset-password` — prevents reuse of last 5 passwords (password history table)

### 11. Recently Used Icons ✅ Implemented
`recentIcons` (max 20) is tracked in Redux `communicationSlice` whenever an icon is added to the sentence. A **"Recently Used" strip** is displayed above the category tabs on the communicate page:
- Shows the last 8 icons as tappable tiles (ARASAAC image + label)
- Tapping adds the icon back to the sentence builder
- Strip is hidden when empty (first session)
- Labelled "Recently Used" (EN) / "Nylig brukt" (NO)
- Persisted in Redux (survives hot-reload in dev)

---

## 🟡 Medium Priority Improvements

### 12. Communication History View ✅ Implemented
Full `/dashboard/history` page is live:
- **Child view**: shows own sessions (up to 50), grouped by date
- **Supervisor view** (teacher / therapist / guardian with accepted pairings): dropdown lists all paired children/patients; switching the selector reloads sessions for that person
- Each session card: quoted sentence, time, icon chips (ARASAAC image + name label), and a **"Replay in communicator"** button that loads the icons into the sentence builder and navigates to `/communicate`
- `/api/sessions GET` extended with `?userId=` param — enforces pairing check before returning another user's data (returns `403` if no accepted pairing exists)
- `/api/sessions/paired-users GET` — new endpoint returning children linked to the current user
- Dashboard "Recent Activity" card is now a real link to `/dashboard/history`

### 13. Manage Custom Icons (Delete / Rename) ✅ Implemented
The `/dashboard/icons` page now has full icon management:
- **Delete**: a `×` button appears on card hover (top-right); clicking shows an inline "Delete this icon? / Delete / Cancel" confirmation overlay — no accidental deletes
- **Rename**: clicking an icon's name turns it into an editable `<input>`; press `Enter` to save, `Escape` to cancel, or clicking away saves automatically
- `/api/icons/[id]` DELETE — ownership-verified; returns 404 if icon doesn't belong to user
- `/api/icons/[id]` PATCH — ownership-verified rename; validates name (1–100 chars), lowercases before saving

### 14. Accessibility Preferences UI
The DB schema (`userPreferences`) supports: `hapticEnabled`, `highContrast`, `textSize`, `reduceMotion`. The API (`/api/preferences PATCH`) accepts all these fields. However, **the settings page only shows voice speed and pitch** — the accessibility settings have no UI. Adding toggle switches for high contrast, reduce motion, and a text size slider would make the app significantly more accessible.

### 15. Open Board Format (OBF) Support
OBF (`.obz` files) is the open standard for AAC boards, supported by Snap Core First, Cboard, and others. Adding import/export would:
- Let users migrate from other apps to Pictalk
- Allow sharing boards between Pictalk users
- Connect Pictalk to the broader AAC community ecosystem

### 16. Switch Access / Scanning Mode
Many users of AAC software cannot use a touchscreen directly. They use a single switch (button) to scan through options. This is standard in AAC apps. Implementation:
- A scanning cursor that moves through icons automatically
- A timing interval setting
- Activate on switch press (spacebar / any key / Bluetooth button)

### 17. Icon Search ⬅️ Next Up
A search bar on the communicate page that queries all 89 built-in icons + any uploaded custom icons by name. Essential as the library grows. The `searchIcons()` helper already exists in `src/lib/data/icons.ts`.

### 18. Haptic Feedback
`navigator.vibrate` is not called anywhere. The DB schema supports `hapticEnabled` preference. A short vibration on icon tap would benefit users with visual impairments. Low effort, high impact for accessibility.

### 19. Language Auto-Detection ✅ Implemented
On first visit (no localStorage preference), `LanguageContext` checks `navigator.language`. If the browser reports `nb-*`, `nn-*`, or `no-*`, Norwegian is set automatically. localStorage preference always takes priority on subsequent visits.

### 20. Progressive Image Loading for Custom Icons
Custom icons uploaded to Vercel Blob are full-size images displayed in small tiles. Add `next/image` with proper `width` and `height` props and a blur placeholder for better perceived performance.

---

## 🟢 Enhancement Ideas (Future)

### 21. Social Sharing of Boards
Allow users to export their board layout (icon arrangement + custom icons) as a shareable link or file. Other users could import it with one click. Great for therapists who want to share vocabulary sets.

### 22. Context-Aware Icon Suggestions
Time-of-day based suggestions:
- Morning: breakfast, school, bus
- Evening: dinner, bath, sleep, story
Uses the device clock only — no server needed. Simple and impactful.

### 23. Icon Colour Coding (Fitzgerald Key)
The Fitzgerald Key is a standard colour-coding system used in AAC:
- Yellow = pronouns (I, you, he)
- Green = verbs (eat, want, go)
- Orange = nouns (water, ball, cat)
- Blue = adjectives (big, hot, happy)
- Pink = social words (please, thank you)

The `color` field already exists in the icon schema and data model. Applying these colours consistently would make Pictalk immediately recognisable to therapists familiar with AAC conventions.

### 24. Multi-Page Boards
Professional AAC users have dozens of vocabulary pages (home, school, hospital, playground). Allow users to create named boards and switch between them. Similar to how Snap Core First or TouchChat works.

### 25. Therapist Analytics Portal
A dedicated view for therapists that shows:
- Word frequency over time (which icons the child uses most)
- Time-of-day communication patterns
- Progress tracking (new words introduced this week)
- Printable vocabulary report

### 26. Offline-First AI (TensorFlow.js)
Replace the keyword matching engine with a lightweight semantic embedding model that runs entirely in the browser. Benefits:
- Works offline
- Better fuzzy matching ("watter" → water)
- Cross-language matching without separate keyword maps
- Personalises over time from usage patterns

---

## Technical Debt to Address

| Issue | File | Recommendation |
|---|---|---|
| Service worker not generated | `public/` | Verify `next-pwa` build output; `sw.js` must exist for PWA install |
| `turbopack.root` warning in build | `next.config.ts` | Set `turbopack.root` to suppress warning |
| `MULTILINGUAL_SETUP.md` is outdated | `MULTILINGUAL_SETUP.md` | Update to reflect current React Context approach (not next-intl) |
| `plan.txt` at root is empty | `plan.txt` | Delete or migrate to `PLAN.md` |
| `summary 03.03.2025.txt` at root | root | Archive or delete — stale Expo-era summary |
| `olama chat` folder at root | root | Should be gitignored or removed |
| `NEXTAUTH_SECRET` in README.md | `README.md` | Update to `AUTH_SECRET` (NextAuth v5) |
| RTK Query `baseApi` | `src/store/api/baseApi.ts` | Configured but no endpoints defined — either add endpoints or remove if unused |
| icon-192.png 404 | `public/` | `/icon-192.png` returns 404 — referenced in manifest but file missing |

---

## Competitive Landscape

| App | Strengths | What Pictalk Can Do Better |
|---|---|---|
| **Cboard** | Open source, OBF support | Better offline PWA, smarter icon matching |
| **Snap Core First** | Industry standard | Free, open source, modern web |
| **TouchChat** | Robust vocabulary | No vendor lock-in, custom icons easy |
| **Proloquo2Go** | Best-in-class UX | Available on Android + web, not just iOS |
| **LetMeTalk** (Android) | Simple, free | Better i18n, web-based |

**Pictalk's differentiators to lean into**:
1. **Truly free and open source** — no subscription
2. **Works offline** as a PWA without an app store
3. **Custom icon upload** with user's own photos
4. **ARASAAC pictograms** — professional AAC-grade symbols
5. **Multilingual** from the ground up (EN + NO, easily extendable)
6. **Modern tech** — easy to contribute to and extend

### 1. Auth Secret in Production
The `AUTH_SECRET` must be set in Vercel's environment variables. Without it, all logins will silently fail in production. A strong, unique secret has been generated — ensure it is added in Vercel → Settings → Environment Variables.

### 2. No `/error` Route
The auth config previously redirected to `/error` which doesn't exist, causing a 404 on any auth failure. Fixed to redirect to `/login` instead. Consider adding a dedicated, user-friendly error page at `/app/(auth)/error/page.tsx`.

### 3. No Email Verification ✅ Implemented
Email verification via **Resend** is now implemented:
- On register: 32-byte hex token generated, saved with 24h expiry, email sent via Resend
- `/api/auth/verify-email` POST route validates token and marks `emailVerified: true`
- `/verify-email` page: shows "check inbox" state or auto-verifies from `?token=` URL param
- Unverified users (new-flow) are blocked from signing in

### 4. BLOB_READ_WRITE_TOKEN for Production
Vercel Blob uploads require `BLOB_READ_WRITE_TOKEN` in the Vercel environment. Confirm this is set — without it, all custom icon uploads will fail silently in production.

---

## 🟠 High Priority Improvements

### 5. Landing Page Redesign
The current landing page is functional but basic. First impressions matter enormously for an app aimed at caregivers and therapists evaluating AAC tools. Recommend:
- Hero section with a live demo of the icon board
- Clear value proposition ("Works offline, always ready")
- Screenshots/GIF of the app in action
- Testimonials or "Who is this for?" section
- Glassmorphism / premium dark design

### 6. Emoji Icons → Real Pictograms (ARASAAC)
The built-in icon database uses emoji symbols (🍎, 💧, etc.). While functional, these are not recognised AAC symbols. Professional AAC apps use standardised pictogram libraries.

**Recommendation**: Integrate the [ARASAAC API](https://api.arasaac.org/):
```
GET https://api.arasaac.org/v1/pictograms/search/en?q=water
```
Free, open-source, 30,000+ symbols, available in 20+ languages. This single change would make Pictalk a serious AAC tool.

### 7. Favourite Phrases ✅ Implemented
Save frequently used sentences (e.g., "I want water", "I need help"). Implemented:
- Save current sentence as a favourite
- Display favourites in a pinned section
- One-tap load of a favourite phrase
- Persisted to IndexedDB (`metadata` store, key `favorite_phrases`) — survives page refresh offline
- Redux `favoritePhrases` slice with IDB rehydration on app mount

### 8. Voice Settings ✅ Implemented
The Web Speech API supports `rate`, `pitch`, and `voice` selection. Now fully implemented:
- `/dashboard/settings` page with speed and pitch sliders (0.5–2.0)
- Settings auto-saved to `/api/preferences` (Neon DB) on every change
- `SentenceBuilder` reads `voiceSpeed` and `voicePitch` from preferences on mount
- Language-aware TTS: EN → `en-US`, NO → `nb-NO`

---

## 🟡 Medium Priority Improvements

### 9. Open Board Format (OBF) Support
OBF (`.obz` files) is the open standard for AAC boards, supported by Snap Core First, Cboard, and others. Adding import/export would:
- Let users migrate from other apps to Pictalk
- Allow sharing boards between Pictalk users
- Connect Pictalk to the broader AAC community ecosystem

### 10. Switch Access / Scanning Mode
Many users of AAC software cannot use a touchscreen directly. They use a single switch (button) to scan through options. This is standard in AAC apps. Implementation:
- A scanning cursor that moves through icons automatically
- A timing interval setting
- Activate on switch press (spacebar / any key / Bluetooth button)

### 11. Icon Search
As the icon library grows (especially with ARASAAC), a search bar on the icon grid becomes essential. Currently users must browse by category. A search input that queries both built-in and custom icons would drastically improve usability.

### 12. Language Auto-Detection ✅ Implemented
On first visit (no localStorage preference), `LanguageContext` checks `navigator.language`. If the browser reports `nb-*`, `nn-*`, or `no-*`, Norwegian is set automatically. localStorage preference always takes priority on subsequent visits.

### 13. Progressive Image Loading for Custom Icons
Custom icons uploaded to Vercel Blob are full-size images displayed in small tiles. Add `next/image` with proper `width` and `height` props and a blur placeholder for better perceived performance.

---

## 🟢 Enhancement Ideas (Future)

### 14. Social Sharing of Boards
Allow users to export their board layout (icon arrangement + custom icons) as a shareable link or file. Other users could import it with one click. Great for therapists who want to share vocabulary sets.

### 15. Sentence History
Store the last N sentences spoken (already partially modelled in `communication_sessions` table). Show a "History" tab with previously spoken sentences — user can tap to replay or re-add to sentence builder.

### 16. Context-Aware Icon Suggestions
Time-of-day based suggestions:
- Morning: breakfast, school, bus
- Evening: dinner, bath, sleep, story
Uses the device clock only — no server needed. Simple and impactful.

### 17. Icon Colour Coding (Fitzgerald Key)
The Fitzgerald Key is a standard colour-coding system used in AAC:
- Yellow = pronouns (I, you, he)
- Green = verbs (eat, want, go)
- Orange = nouns (water, ball, cat)
- Blue = adjectives (big, hot, happy)
- Pink = social words (please, thank you)

The `color` field already exists in the icon schema and data model. Applying these colours consistently would make Pictalk immediately recognisable to therapists familiar with AAC conventions.

### 18. Multi-Page Boards
Professional AAC users have dozens of vocabulary pages (home, school, hospital, playground). Allow users to create named boards and switch between them. Similar to how Snap Core First or TouchChat works.

### 19. Therapist Analytics Portal
A dedicated view for therapists that shows:
- Word frequency over time (which icons the child uses most)
- Time-of-day communication patterns
- Progress tracking (new words introduced this week)
- Printable vocabulary report

### 20. Offline-First AI (TensorFlow.js)
Replace the keyword matching engine with a lightweight semantic embedding model that runs entirely in the browser. Benefits:
- Works offline
- Better fuzzy matching ("watter" → water)
- Cross-language matching without separate keyword maps
- Personalises over time from usage patterns

---

## Technical Debt to Address

| Issue | File | Recommendation |
|---|---|---|
| `turbopack.root` warning in build | `next.config.ts` | Set `turbopack.root` to suppress warning |
| `MULTILINGUAL_SETUP.md` is outdated | `MULTILINGUAL_SETUP.md` | Update to reflect current React Context approach (not next-intl) |
| `plan.txt` at root is empty | `plan.txt` | Delete or migrate to `PLAN.md` |
| `summary 03.03.2025.txt` at root | root | Archive or delete — stale Expo-era summary |
| `olama chat` folder at root | root | Should be gitignored or removed |
| No `.gitignore` entry for `olama chat` | `.gitignore` | Add `olama chat/` to .gitignore |
| `NEXTAUTH_SECRET` in README.md | `README.md` | Update to `AUTH_SECRET` (NextAuth v5) |
| `next-env.d.ts` not in `.gitignore` | `.gitignore` | This file is auto-generated — should be gitignored |

---

## Competitive Landscape

| App | Strengths | What Pictalk Can Do Better |
|---|---|---|
| **Cboard** | Open source, OBF support | Better offline PWA, smarter icon matching |
| **Snap Core First** | Industry standard | Free, open source, modern web |
| **TouchChat** | Robust vocabulary | No vendor lock-in, custom icons easy |
| **Proloquo2Go** | Best-in-class UX | Available on Android + web, not just iOS |
| **LetMeTalk** (Android) | Simple, free | Better i18n, web-based |

**Pictalk's differentiators to lean into**:
1. **Truly free and open source** — no subscription
2. **Works offline** as a PWA without an app store
3. **Custom icon upload** with user's own photos
4. **Multilingual** from the ground up
5. **Modern tech** — easy to contribute to and extend
