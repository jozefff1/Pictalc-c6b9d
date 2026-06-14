# Snakke

> A source-available AAC (Augmentative and Alternative Communication) Progressive Web App prototype for children and adults with communication challenges.

Snakke lets users express themselves through picture-based communication
boards, text-to-icon conversion, and speech recognition. Selected communication
features persist locally; complete conflict-safe offline synchronization is
still planned.

🌐 **Live**: [snakke.vercel.app](https://snakke.vercel.app)

---

## Features

- 🎯 **Icon Board** — tap icons to build sentences across 6 AAC categories (101 built-in ARASAAC pictograms)
- ⌨️ **Text → Icons** — type a word and it auto-converts to matching icons
- 🎤 **Speech → Icons** — speak and your words become icons instantly
- 🖼️ **Custom Icons** — upload your own images as personal AAC symbols
- 🔊 **Text-to-Speech** — built sentence is spoken aloud via Web Speech API
- 🌍 **Multilingual** — English and Norwegian, with instant switching
- 🌙 **Dark Mode** — full dark theme support
- 📱 **PWA** — installable, mobile-first, with selected offline persistence
- 👥 **Multi-role accounts** — Child, Guardian, Therapist, Teacher

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Auth | NextAuth.js v5 |
| Database | Neon Serverless Postgres (Drizzle ORM) |
| Storage | Vercel Blob |
| Offline | IndexedDB (idb) |
| PWA | @serwist/next v9.5.11 |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/jozefff1/snakke.git
cd snakke
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root and add the required values:

```bash
touch .env.local
```

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Neon Postgres pooled connection string | ✅ |
| `AUTH_SECRET` | Random secret for JWT (`openssl rand -base64 32`) | ✅ |
| `AUTH_URL` | `http://localhost:3000` for local dev | Dev only |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (for custom icon uploads) | ✅ |
| `RESEND_API_KEY` | Resend API key (for email verification + password reset) | ✅ |
| `RESEND_FROM_EMAIL` | Verified sender address override | Optional |
| `RESEND_WEBHOOK_SECRET` | Svix secret for inbound Resend webhook verification | Inbound email only |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used in invite emails) | Optional |

> **Note**: This project uses **NextAuth.js v5**. The secret variable is `AUTH_SECRET` and the URL variable is `AUTH_URL` (not `NEXTAUTH_SECRET` / `NEXTAUTH_URL`).

### 3. Push database schema

```bash
npm run db:push
```

> **Migration note**: `src/lib/db/schema.ts` includes the staged Phase 9 tenant/RLS
> foundation (`tenants` and nullable `users.tenant_id`). Review the generated
> changes before pushing them to an existing database. Until that migration is
> applied everywhere, auth routes intentionally use explicit compatible column
> lists instead of selecting or inserting every field from the Drizzle schema.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, Register, Verify-email, Forgot/Reset-password
│   ├── (app)/
│   │   ├── communicate/     # Main AAC board
│   │   └── dashboard/       # User dashboard
│   │       ├── history/     # Communication session history
│   │       ├── icons/       # Custom icon upload + management
│   │       ├── patients/    # Pairing management (invite, access control)
│   │       ├── profile/     # User profile (view/edit)
│   │       └── settings/    # Voice + accessibility preferences
│   ├── about/               # About Snakke (bilingual EN/NO)
│   ├── research/            # Research & Institutional info page (bilingual EN/NO)
│   ├── plans/               # Roadmap & delivery plans page (bilingual EN/NO)
│   ├── api/
│   │   ├── auth/            # NextAuth + registration + verify/reset API
│   │   ├── icons/           # Custom icon upload/fetch/rename/delete API
│   │   ├── pairings/        # Pairing invite + accept API
│   │   ├── patients/        # Patient session access API
│   │   ├── preferences/     # Voice + accessibility preferences API
│   │   ├── profile/         # User profile read/update API
│   │   └── sessions/        # Communication session log API
│   ├── learn/               # Language learning mode
│   └── page.tsx             # Landing page
├── components/
│   ├── features/            # AAC board, sentence builder, icon upload, learning, pairing, info pages
│   ├── common/              # Language switcher, dark mode toggle
│   └── layout/              # Header + AppHeader (both fully localised via t())
├── lib/
│   ├── ai/                  # Icon matcher + keyword maps (EN/NO)
│   ├── auth/                # NextAuth v5 config
│   ├── data/icons.ts        # Built-in icon database
│   ├── db/                  # Drizzle client + withTenantContext() + schema (10 tables)
│   └── services/            # Web Speech API wrapper
├── contexts/
│   └── LanguageContext.tsx  # i18n: EN/NO full + ES/FR/DE icon labels (React Context)
└── store/                   # Redux slices (communication, pairing, ui)
```

---

## Database Schema

The Drizzle schema defines 10 tables: `tenants`, `users`, `devices`, `pairings`, `pairing_requests`, `messages`, `communication_sessions`, `user_preferences`, `custom_icons`, `password_history`.

`tenants` and `users.tenant_id` are Phase 9 foundation definitions. Existing
databases may not contain them until the reviewed tenant migration is applied.

Push schema to your database:
```bash
npm run db:push
```

Open Drizzle Studio to inspect data:
```bash
npm run db:studio
```

---

## Internationalization

Snakke uses a **client-side React Context** for translations (English + Norwegian).

- Language choice persists via `localStorage`
- Instant switching — no page reload
- Icon keyword maps are locale-aware (`src/lib/ai/keywordMappings/`)

> ⚠️ Do NOT use `next-intl`. It has persistent incompatibilities with Next.js 15+ App Router. See `docs/i18n.md` for full context.

To add a new language:
1. Add to `Language` type in `src/contexts/LanguageContext.tsx`
2. Add translation dictionary
3. Add keyword map in `src/lib/ai/keywordMappings/<lang>.ts`
4. Add button to `src/components/common/LanguageSwitcher.tsx`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import into Vercel — **no Root Directory setting needed** (Next.js at repo root)
3. Add environment variables in Vercel → Settings → Environment Variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN`
4. Deploy ✅

---

## Documentation

| File | Description |
|---|---|
| `docs/PROJECT_BRIEF.md` | Authoritative regulatory and market-validation brief, status dated June 14, 2026 |
| `docs/DOCUMENTATION_ALIGNMENT.md` | Comparison of every documentation file against the project brief |
| `PROJECT_OVERVIEW.md` | Architecture, schema, feature status |
| `PLAN.md` | Phased development roadmap |
| `SUGGESTIONS.md` | Improvement ideas and technical recommendations |
| `CHANGELOG.md` | Version history |
| `SETUP.md` | Quick setup and troubleshooting guide |
| `docs/i18n.md` | Comprehensive i18n guide |
| `docs/SPEECH_ARCHITECTURE.md` | Offline-first TTS/STT provider architecture and delivery plan |

> For legal, compliance, accessibility, medical-device, AI, NAV, procurement,
> funding, and production-readiness claims, `docs/PROJECT_BRIEF.md` takes
> precedence over older planning or historical documents.

---

## Roadmap

- [x] Email verification + password reset (Resend)
- [x] Favourite phrases (save/load sentences, IndexedDB-persisted)
- [x] Voice + accessibility preferences UI (`/dashboard/settings`)
- [x] ARASAAC pictogram integration (101 built-in icons via static CDN)
- [x] Communication session history with supervisor patient selector
- [x] Supervisor/guardian pairing flow (invite link + email + QR + accept/revoke)
- [x] QR code pairing — generate, display, 5-min expiry, scan to invite; supervisor auto-redirects to direct comm on accept
- [x] Language learning mode — 5 languages, 3 modes (flashcard/writing/speaking)
- [x] Fully translated dashboard (EN + NO) — profile, settings, patients, history
- [x] Sentence icon reordering via drag-and-drop (@dnd-kit)
- [x] `/about`, `/research`, `/plans` information pages — bilingual EN/NO, accessible nav + footer
- [x] All header navigation labels localised (EN + NO) — no hardcoded strings remain
- [x] Tenant/RLS foundation defined in code (`tenants`, nullable `users.tenant_id`, `withTenantContext()`)
- [ ] Apply and verify the tenant/RLS migration in every environment
- [ ] Dynamic ARASAAC search (30,000+ symbols at runtime)
- [ ] Full ES/FR/DE UI translations (icon labels only for now)
- [ ] Icon grid reordering (Phase 2.6.2 — planned)
- [ ] Spaced repetition for language learning (SM-2)
- [ ] Full offline sync (IndexedDB + background sync)
- [ ] Open Board Format (OBF/OBZ) import/export
- [ ] Switch access / scanning mode
- [ ] Institutional org model + research consent framework (Phase 9)
- [ ] iOS/Android App Store via Capacitor

See [`PLAN.md`](./PLAN.md) for the full phased roadmap.

---

## Contributing

Snakke is a passion project to help children with communication challenges and their families. Contributions — bug fixes, translations, new icons, accessibility improvements — are very welcome.

---

## License

No project license file is currently included. Usage, modification, and
distribution rights must be formalized before describing Snakke as open-source.

---

## Acknowledgements

Built with love for children who communicate differently. 💙

Inspired by the global AAC community and open-source tools like [Cboard](https://www.cboard.io/), [LetMeTalk](https://letstalkit.de/), and the [ARASAAC](https://arasaac.org/) pictogram library.
