# Pictalk — Project Overview

> **Pictalk** is an open-source Augmentative and Alternative Communication (AAC) Progressive Web App designed for children and adults with communication challenges. It allows users to express themselves through icons, text-to-icon conversion, and speech recognition — both online and offline.

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
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Auth | NextAuth.js v5 beta |
| Database | Neon Serverless Postgres |
| ORM | Drizzle ORM |
| Storage | Vercel Blob |
| Offline | IndexedDB (via `idb`) |
| PWA | `@ducanh2912/next-pwa` |
| Deployment | Vercel |
| i18n | Custom React Context (client-side) |
| Email | Resend (planned) |

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
│   │   │   └── CustomIconUpload     # Upload personal icons
│   │   ├── common/
│   │   │   └── LanguageSwitcher     # EN/NO toggle
│   │   └── layout/
│   │       └── Header               # Top nav
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
│   │   └── LanguageContext.tsx      # i18n: EN + NO translations
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
| Role-based accounts (child/guardian/teacher/therapist) | ✅ |
| AAC icon board with 6 categories | ✅ |
| Text → Icon auto-conversion | ✅ |
| Speech → Icon conversion (Web Speech API) | ✅ |
| Sentence builder with TTS playback | ✅ |
| Custom icon upload (Vercel Blob) | ✅ |
| Custom icons integrated into icon matcher | ✅ |
| English + Norwegian UI and keyword matching | ✅ |
| Language auto-detection (navigator.language) | ✅ |
| Dark mode | ✅ |
| PWA (installable) | ✅ |
| Voice settings UI (speed, pitch) | ✅ |
| User profile page (view / edit name) | ✅ |
| Favourite phrases with IDB persistence | ✅ |
| Communication sessions saved locally (IDB-first) | ✅ |
| Offline-first IndexedDB storage | ✅ |
| Email verification (Resend) | ✅ |
| Password reset flow (Resend) | ✅ |
| Password history (prevent reuse of last 5) | ✅ |
| Forgot-password rejects unknown emails (404) | ✅ |
| Device pairing (QR code) | ❌ Not started |
| Guardian dashboard / analytics | ❌ Not started |
| ARASAAC integration | ❌ Not started |

---

## Known Decisions & Constraints

- **No `next-intl`**: Attempted and abandoned after persistent failures with Next.js App Router. Client-side React Context i18n is used instead. Do NOT reintroduce `next-intl`.
- **NextAuth v5**: Uses `AUTH_SECRET` env var (not `NEXTAUTH_SECRET`). `trustHost: true` is required for Vercel. Auth state is owned entirely by NextAuth — no Redux `authSlice`.
- **Forgot-password validates email**: The `/api/auth/forgot-password` endpoint returns a 404 error if the submitted email is not registered. Reset links are only sent to verified, existing accounts.
- **Password history**: The `password_history` table stores the last 5 hashes per user. On reset, the new password is checked against the current password and all stored history. Reuse returns "You cannot reuse a previous password."
- **Offline-first architecture**: IndexedDB (via `idb`) is the primary storage for sessions and favourite phrases. The DB (Neon) acts as cloud backup and research/analytics layer.
- **Emoji symbols for built-in icons**: The built-in icon database uses emoji as symbols. Custom icons use real images via Vercel Blob.
- **Keyword-based icon matching**: The current matcher (`iconMatcher.ts`) is keyword/string based. ML embeddings are planned for a future phase.
