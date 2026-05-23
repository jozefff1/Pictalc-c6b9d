# Snakke — Project Overview

> **Snakke** is an open-source Augmentative and Alternative Communication (AAC) Progressive Web App designed for children and adults with communication challenges. It allows users to express themselves through icons, text-to-icon conversion, and speech recognition — both online and offline. It also includes a language learning module to help users (and their caregivers) build vocabulary across five languages.

---

## What is AAC?

Augmentative and Alternative Communication (AAC) refers to all forms of communication outside of oral speech that are used to express thoughts, needs, wants, and ideas. Pictalk is a digital AAC tool that translates words and speech into visual symbol-based communication boards.

---

## Who Is This For?

| User Role | Description |
|---|---|
| **Child** | Primary AAC user. Communicates via icons. |
| **Guardian** | Parent or caregiver who monitors and configures the child's board. |
| **Therapist** | Speech-language therapist who sets up boards and reviews progress. |
| **Teacher** | School-based support who may configure classroom-specific icons. |

---

## Current Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, webpack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit + RTK Query |
| Auth | NextAuth.js v5 |
| Database | Neon Serverless Postgres |
| ORM | Drizzle ORM ^0.45.2 |
| Storage | Vercel Blob |
| Offline | IndexedDB (via `idb`) |
| PWA | `@serwist/next` v9.5.11 + `serwist` |
| Deployment | Vercel (auto-deploy from `snakke` remote) |
| i18n | Custom React Context (client-side, **not** next-intl) |
| Languages | EN, NO, ES, FR, DE |
| Email | Resend |

---

## Architecture

```
Root
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Login, Register, Verify-email, Forgot/Reset-password pages
│   │   ├── (app)/                   # Protected routes
│   │   │   ├── communicate/         # Main AAC board
│   │   │   └── dashboard/           # User dashboard + icons
│   │   │       └── icons/           # Custom icon upload
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   │   ├── auth/register/       # Registration API
│   │   │   ├── auth/verify-email/   # Email token verification API
│   │   │   ├── auth/forgot-password/ # Request password reset email
│   │   │   ├── auth/reset-password/  # Validate token + save new password
│   │   │   ├── icons/               # Custom icon API (Blob + DB)
│   │   │   ├── sessions/            # Communication session log API
│   │   │   ├── preferences/         # Voice + theme preferences API
│   │   │   └── profile/             # User profile read/update API
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Landing page
│   ├── components/
│   │   ├── features/
│   │   │   ├── CategorySelector     # AAC category tabs
│   │   │   ├── IconGrid             # Icon display grid
│   │   │   ├── SentenceBuilder      # Built sentence + TTS
│   │   │   ├── TextToIcons          # Type → icons
│   │   │   ├── SpeechToIcons        # Speak → icons
│   │   │   ├── CustomIconUpload     # Upload personal icons
│   │   │   ├── LandingPage.tsx      # Client-side landing page
│   │   │   └── learning/
│   │   │       ├── LearnPage.tsx        # /learn page wrapper
│   │   │       ├── LanguagePicker.tsx   # Pick learnFrom / learnTarget
│   │   │       └── FlashcardDeck.tsx    # Flashcard/Writing/Speaking modes
│   │   ├── common/
│   │   │   ├── LanguageSwitcher.tsx # Language selector (EN/NO/ES/FR/DE)
│   │   │   └── DarkModeToggle.tsx   # Sun/moon toggle
│   │   └── layout/
│   │       └── Header.tsx           # Top nav (💬 communicate + Learn links)
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── iconMatcher.ts       # Text → icon matching engine
│   │   │   └── keywordMappings/
│   │   │       ├── en.ts            # English keyword map
│   │   │       └── no.ts            # Norwegian keyword map
│   │   ├── auth/config.ts           # NextAuth v5 config
│   │   ├── data/icons.ts            # Built-in icon database
│   │   ├── db/
│   │   │   ├── client.ts            # Neon Drizzle client
│   │   │   └── schema.ts            # All DB table definitions
│   │   ├── offline/indexedDB.ts     # Offline storage utilities
│   │   └── services/speechService   # Web Speech API wrapper
│   ├── contexts/
│   │   └── LanguageContext.tsx      # i18n: EN/NO/ES/FR/DE + learnFrom/learnTarget state
│   ├── store/
│   │   ├── slices/
│   │   │   ├── communicationSlice   # Icons, sentence, favoritePhrases, customIcons
│   │   │   ├── pairingSlice         # Device pairing state
│   │   │   └── uiSlice             # Theme, modals
│   │   └── index.ts                 # Redux store setup
│   └── types/                       # Shared TypeScript types
├── public/
│   └── manifest.json                # PWA manifest
├── drizzle.config.ts                # Drizzle Kit config
├── next.config.ts                   # Next.js + PWA config
└── tailwind.config.ts               # Tailwind config
```

---

## Database Schema (8 Tables)

```
users                → All user accounts
devices              → Registered devices per user
pairings             → Guardian ↔ Child relationships
pairing_requests     → Temporary QR pairing tokens
messages             → Communication history between users
communication_sessions → Icon sentence session logs
user_preferences     → Per-user settings (theme, language, TTS)
custom_icons         → User-uploaded icon images (Blob URL + metadata)
password_history     → Last 5 password hashes per user (prevents password reuse)
```

---

## Key Features (Current)

| Feature | Status |
|---|---|
| Email/password registration and login | ✅ |
| Email verification + password reset (Resend) | ✅ |
| Password history — prevent reuse of last 5 | ✅ |
| Role-based accounts (child/guardian/teacher/therapist) | ✅ |
| AAC icon board — 89 icons, 6 categories | ✅ |
| ARASAAC pictograms (static CDN, CC BY-NC-SA 4.0) | ✅ |
| Text → Icon auto-conversion (keyword matcher) | ✅ |
| Speech → Icon conversion (Web Speech API) | ✅ |
| Sentence builder with TTS playback | ✅ |
| Custom icon upload (Vercel Blob, MIME/size validated) | ✅ |
| Custom icons in matcher + manage (rename/delete) | ✅ |
| Recently used icons row | ✅ |
| Icon search bar | ✅ |
| Favourite phrases (IDB-persisted) | ✅ |
| Communication session history | ✅ |
| Multilingual UI — EN + NO full, ES/FR/DE icon labels | ✅ |
| Language switcher in header (all pages) | ✅ |
| 5-language learning mode — Flashcard / Writing / Speaking | ✅ |
| Dark mode (Tailwind v4 class-based, FOUC-free) | ✅ |
| PWA — installable, service worker (Serwist) | ✅ |
| Offline-first IndexedDB storage | ✅ |
| Voice settings UI (speed, pitch, test) | ✅ |
| User profile page (view / edit name) | ✅ |
| Accessibility preferences (high contrast, reduce motion, text size, haptic) | ✅ |
| Premium landing page (translated, glassmorphism) | ✅ |
| Security headers (CSP-ready, X-Frame, Referrer-Policy) | ✅ |
| Device pairing (QR code) | ❌ Not started |
| Guardian real-time dashboard | ❌ Not started |
| Dynamic ARASAAC API search (30,000+ symbols) | ❌ Not started |

---

## Known Decisions & Constraints

- **No `next-intl`**: Attempted and abandoned after persistent failures with Next.js App Router (routing conflicts, middleware issues, build failures). Client-side React Context i18n is used instead. **Do NOT reintroduce `next-intl`.**
- **Build flags**: Must use `next build --webpack` and `next dev --webpack` — Serwist (PWA) is incompatible with Next.js 16's default Turbopack.
- **Git remotes**: `origin` → `Pictalc-copy.git` (backup), `snakke` → `snakke.git` (Vercel deployment). Always push to `snakke` to trigger a deploy.
- **NextAuth v5**: Uses `AUTH_SECRET` env var (not `NEXTAUTH_SECRET`). `trustHost: true` required for Vercel. Auth state is owned by NextAuth — no Redux `authSlice`.
- **Forgot-password validates email**: `/api/auth/forgot-password` returns 404 if the email is not registered. Reset links are only sent to verified, existing accounts.
- **Password history**: `password_history` table stores last 5 hashes per user. Reuse returns "You cannot reuse a previous password."
- **Offline-first**: IndexedDB (via `idb`) is the primary store for sessions and favourite phrases. Neon DB is the cloud backup and analytics layer.
- **ARASAAC pictograms**: Built-in icons use `https://static.arasaac.org/pictograms/{id}/{id}_500.png`. Emoji symbol is the fallback on image error. License: CC BY-NC-SA 4.0.
- **Keyword-based icon matching**: `iconMatcher.ts` is keyword/string based. ML embeddings planned for Phase 6.
- **Language learning**: `learnFrom` / `learnTarget` are any two of EN/NO/ES/FR/DE, freely swappable. Persisted in `localStorage`. ES/FR/DE currently only have icon-label translations — UI strings remain English for those languages until professional translators contribute.
- **`Permissions-Policy`**: `microphone=(self)` is set in security headers — required for the speaking mode in the learning feature.
