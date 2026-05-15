# Pictalk — Suggestions & Improvement Ideas

This document captures improvement suggestions, UX observations, and technical recommendations based on a full review of the codebase, existing documentation, and the AAC market landscape.

---

## 🔴 Critical (Fix Soon)

### 1. Auth Secret in Production
The `AUTH_SECRET` must be set in Vercel's environment variables. Without it, all logins will silently fail in production. A strong, unique secret has been generated — ensure it is added in Vercel → Settings → Environment Variables.

### 2. No `/error` Route
The auth config previously redirected to `/error` which doesn't exist, causing a 404 on any auth failure. Fixed to redirect to `/login` instead. Consider adding a dedicated, user-friendly error page at `/app/(auth)/error/page.tsx`.

### 3. No Email Verification
Users can register with any email — real or fake. Before v1.0, add a basic email confirmation step using Resend or Nodemailer to verify ownership. This prevents spam accounts and enables password reset.

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

### 7. Favourite Phrases
Power users will want to save frequently used sentences (e.g., "I want water", "I need help", "I feel sick"). Implement:
- Save current sentence as a favourite with a custom name
- Display favourites in a pinned section
- One-tap load of a favourite phrase
- The Redux `favoritePhrases` slice already exists — just needs UI

### 8. Voice Settings
The Web Speech API supports `rate`, `pitch`, and `voice` selection. Currently these aren't user-configurable. The `user_preferences` DB table already has `voiceSpeed` and `voicePitch` columns — they just need to be wired up to the TTS call and a settings UI page.

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

### 12. Language Auto-Detection
Currently the app defaults to English on first load. A simple improvement: detect `navigator.language` on first visit and set the language automatically. If the browser reports `nb-NO` or `nn-NO`, switch to Norwegian.

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
| `summary 03.03.2025.txt` at root | root | Archive or delete — likely stale |
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
