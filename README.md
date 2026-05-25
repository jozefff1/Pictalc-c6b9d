# Snakke

> An open-source AAC (Augmentative and Alternative Communication) Progressive Web App for children and adults with communication challenges.

Snakke lets users express themselves through picture-based communication boards, text-to-icon conversion, and speech recognition — **online and offline**.

🌐 **Live**: [pictalc-c6b9d.vercel.app](https://pictalc-c6b9d.vercel.app)

---

## Features

- 🎯 **Icon Board** — tap icons to build sentences across 6 AAC categories
- ⌨️ **Text → Icons** — type a word and it auto-converts to matching icons
- 🎤 **Speech → Icons** — speak and your words become icons instantly
- 🖼️ **Custom Icons** — upload your own images as personal AAC symbols
- 🔊 **Text-to-Speech** — built sentence is spoken aloud via Web Speech API
- 🌍 **Multilingual** — English and Norwegian, with instant switching
- 🌙 **Dark Mode** — full dark theme support
- 📱 **PWA** — installable, works offline, mobile-first
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
git clone https://github.com/jozefff1/Pictalc-c6b9d.git
cd Pictalc-c6b9d
npm install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | Neon Postgres pooled connection string | ✅ |
| `AUTH_SECRET` | Random secret for JWT (`openssl rand -base64 32`) | ✅ |
| `AUTH_URL` | `http://localhost:3001` for local dev | Dev only |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (for custom icon uploads) | ✅ |
| `RESEND_API_KEY` | Resend API key (for email verification + password reset) | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used in invite emails) | Optional |

> **Note**: This project uses **NextAuth.js v5**. The secret variable is `AUTH_SECRET` and the URL variable is `AUTH_URL` (not `NEXTAUTH_SECRET` / `NEXTAUTH_URL`).

### 3. Push database schema

```bash
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

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
│   ├── features/            # AAC board, sentence builder, icon upload, learning, pairing
│   ├── common/              # Language switcher, dark mode toggle
│   └── layout/              # Header
├── lib/
│   ├── ai/                  # Icon matcher + keyword maps (EN/NO)
│   ├── auth/                # NextAuth v5 config
│   ├── data/icons.ts        # Built-in icon database
│   ├── db/                  # Drizzle client + schema (9 tables)
│   └── services/            # Web Speech API wrapper
├── contexts/
│   └── LanguageContext.tsx  # i18n: EN/NO full + ES/FR/DE icon labels (React Context)
└── store/                   # Redux slices (communication, pairing, ui)
```

---

## Database Schema

9 tables: `users`, `devices`, `pairings`, `pairing_requests`, `messages`, `communication_sessions`, `user_preferences`, `custom_icons`, `password_history`

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
| `PROJECT_OVERVIEW.md` | Architecture, schema, feature status |
| `PLAN.md` | Phased development roadmap |
| `SUGGESTIONS.md` | Improvement ideas and technical recommendations |
| `CHANGELOG.md` | Version history |
| `SETUP.md` | Quick setup and troubleshooting guide |
| `docs/i18n.md` | Comprehensive i18n guide |

---

## Roadmap

- [x] Email verification + password reset (Resend)
- [x] Favourite phrases (save/load sentences, IndexedDB-persisted)
- [x] Voice + accessibility preferences UI (`/dashboard/settings`)
- [x] ARASAAC pictogram integration (95 built-in icons via static CDN)
- [x] Communication session history with supervisor patient selector
- [x] Supervisor/guardian pairing flow (invite link + email + accept/revoke)
- [x] Language learning mode — 5 languages, 3 modes (flashcard/writing/speaking)
- [x] Fully translated dashboard (EN + NO) — profile, settings, patients, history
- [ ] Dynamic ARASAAC search (30,000+ symbols at runtime)
- [ ] Full ES/FR/DE UI translations (icon labels only for now)
- [ ] Device pairing via QR code (schema + API done; QR UI not started)
- [ ] Spaced repetition for language learning (SM-2)
- [ ] Full offline sync (IndexedDB + background sync)
- [ ] Open Board Format (OBF/OBZ) import/export
- [ ] Switch access / scanning mode
- [ ] iOS/Android App Store via Capacitor

See [`PLAN.md`](./PLAN.md) for the full phased roadmap.

---

## Contributing

Snakke is a passion project to help children with communication challenges and their families. Contributions — bug fixes, translations, new icons, accessibility improvements — are very welcome.

---

## License

MIT — free to use, modify, and distribute.

---

## Acknowledgements

Built with love for children who communicate differently. 💙

Inspired by the global AAC community and open-source tools like [Cboard](https://www.cboard.io/), [LetMeTalk](https://letstalkit.de/), and the [ARASAAC](https://arasaac.org/) pictogram library.
