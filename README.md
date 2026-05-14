# Pictalk v2 - Modern AAC PWA

A Progressive Web App (PWA) for Augmentative and Alternative Communication (AAC), built with Next.js 15, TypeScript, and modern web technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Internationalization**: Custom React Context (client-side)
- **Database**: Neon Serverless Postgres
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js v5
- **Storage**: Vercel Blob
- **Offline**: IndexedDB (via idb library)
- **PWA**: @ducanh2912/next-pwa

## 📋 Prerequisites

- Node.js 18+ and npm
- A Neon database (free tier available at https://neon.tech)
- (Optional) Vercel account for deployment

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `DATABASE_URL`: Your Neon Postgres connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000` for development
   - `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob token (optional for now)

3. **Set up the database:**
   
   Push the schema to your database:
   ```bash
   npx drizzle-kit push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
pictalk-v2/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (app)/             # Protected app routes (dashboard)
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout with providers
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components (Header, Nav)
│   │   ├── providers/         # Context providers
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── auth/              # NextAuth configuration
│   │   ├── db/                # Database schema and client
│   │   ├── offline/           # IndexedDB for offline storage
│   │   ├── storage/           # Vercel Blob utilities
│   │   └── utils/             # Utilities, validators, constants
│   ├── store/
│   │   ├── slices/            # Redux slices
│   │   ├── api/               # RTK Query API definitions
│   │   └── index.ts           # Store configuration
│   ├── types/                 # TypeScript type definitions
│   └── hooks/                 # Custom React hooks
├── public/                     # Static assets
├── drizzle/                    # Database migrations
└── tests/                      # Test files
```

## 🎯 Features

### Implemented ✅
- **Authentication** (login/register)
- **Multilingual Support** (English + Norwegian)
  - Client-side i18n with React Context
  - 90+ icon translations
  - Category translations
  - Full UI translation coverage
  - localStorage persistence
- **Database schema** with 8 tables
- **Redux store** with 4 slices
- **Text-to-Icons** auto-conversion
- **Offline storage** with IndexedDB
- **PWA configuration** with manifest
- **Responsive design** with Tailwind
- **Dark mode support**
- **Accessibility features** (WCAG 2.1 AAA)

### In Progress 🚧
- Communication interface (partially complete)
- Icon management
- Device pairing (QR codes)
- Speech-to-Icons integration
- Offline sync engine

### Planned 📝
- Additional languages (Spanish, French, etc.)
- Custom icon upload
- Session logging and analytics
- Progressive enhancement
- Native app wrapper (Capacitor/Tauri)

### AI-Powered Features 🤖 (Future)
**Offline-First Architecture:**
- **Smart Icon Suggestions** - Local ML model predicts next icon (works offline)
- **Pattern Learning** - User-specific patterns stored in IndexedDB
- **Sentence Completion** - Local patterns + cloud AI enhancement
- **Contextual Awareness** - Time/location-based suggestions (offline)
- **Voice Personalization** - Web Speech API + custom TTS

**Cloud Enhancement (Optional):**
- **Multi-Language Translation** - Cached + Claude API for new translations
- **Advanced Reasoning** - Claude API for complex sentence generation
- **Learning Analytics** - Sync patterns for therapist insights
- **Model Updates** - Download improved ML models when online

**Technology Stack:**
- TensorFlow.js / ONNX Runtime Web (browser ML)
- IndexedDB (model & pattern storage)
- Claude API (Anthropic) for advanced features
- Web Speech API (native TTS)

## 🌍 Internationalization (i18n)

### Current Implementation

**Architecture**: Client-side i18n using React Context API

**Supported Languages**:
- 🇬🇧 English (default)
- 🇳🇴 Norwegian (Norsk)

**Translation Coverage**:
- UI components (buttons, labels, placeholders, hints)
- 90+ icon names (e.g., Water→Vann, Play→Leke, Happy→Glad)
- Category labels (Needs→Behov, Actions→Handlinger, etc.)
- Speech synthesis (text-to-speech in selected language)

**Features**:
- Language switcher in top navigation bar
- Instant language switching (no page reload)
- localStorage persistence (language choice saved)
- No routing changes (URLs remain `/communicate`, not `/en/communicate`)

**Files**:
- `src/contexts/LanguageContext.tsx` - Language provider and translations
- `src/components/common/LanguageSwitcher.tsx` - Language toggle UI

### ⚠️ Important: next-intl Issues (Documented)

**Problem**: We initially attempted to implement i18n using `next-intl` library with Next.js 15 App Router.

**Issues Encountered**:
1. **Routing Complexity**: Required `[locale]` dynamic segments in all routes
2. **Middleware Conflicts**: Middleware configuration caused persistent 404 errors
3. **Build Failures**: Over 200+ messages of debugging without resolution
4. **App Router Incompatibility**: next-intl's server-side approach conflicted with Next.js 15's App Router patterns

**Resolution**: Complete removal of next-intl and middleware.ts, replaced with simple client-side React Context approach.

**Lesson Learned**: For AAC apps requiring instant language switching without routing complexity, client-side i18n is more reliable and performant than server-side solutions with Next.js 15.

**If you need to add more languages**:
1. Add language to `Language` type in `LanguageContext.tsx`
2. Add translation dictionary with all keys
3. Add language button to `LanguageSwitcher.tsx`
4. No routing changes needed!

## 🧪 Testing

Run tests:
```bash
npm test
```

Run E2E tests:
```bash
npm run test:e2e
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy!

The app will automatically be configured as a PWA and work offline.

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | Yes |
| `NEXTAUTH_URL` | App URL (with protocol) | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | No* |

\* Required only for custom icon uploads

## 🤝 Contributing

This is a passion project to help children with communication challenges. Contributions are welcome!

## 📄 License

MIT

## 🙏 Acknowledgments

Built with love for children with communication challenges and their families.
