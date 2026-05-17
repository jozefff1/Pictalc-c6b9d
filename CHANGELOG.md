# Changelog

All notable changes to Pictalk v2 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (May 17, 2026 — session 4)
- **Premium landing page redesign** (`src/app/page.tsx`)
  - Dark glassmorphism hero (`from-slate-900 via-blue-950`) with animated floating emoji icons
  - Stats strip: 89+ icons · 2 languages · 100% offline · Free
  - Live demo preview: mock communication board showing 8 icon tiles
  - 6-column feature grid with coloured icon backgrounds
  - Persona cards for Children, Parents & Guardians, Therapists & Teachers
  - Full-width gradient CTA banner with "Create Free Account" button
  - Dark footer with GitHub link
- **Icon press animation** (`src/components/features/IconGrid.tsx`, `src/app/globals.css`)
  - `@keyframes icon-tap` — spring-feel scale snap (0.87 → 1.07 → 1) over 300 ms
  - `tappedId` state in `IconGrid` triggers `icon-tapped` class; resets after 350 ms
  - Animation skipped automatically when `.reduce-motion` class is present
- **Page enter transition** (`src/app/globals.css`, `src/app/(app)/layout.tsx`)
  - `@keyframes page-enter` — 220 ms fade + 10 px upward slide
  - `page-enter` class applied to `<main>` in the authenticated app shell
  - Disabled under `.reduce-motion` and `prefers-reduced-motion`
- **Floating hero animation** (`globals.css`)
  - `@keyframes float-drift` — gentle 6 s ease-in-out drift for background emoji icons on landing page

### Added (May 17, 2026 — session 3)
- **Dark mode toggle button** (`src/components/common/DarkModeToggle.tsx`)
  - Sun/moon SVG button in both app header and public landing header
  - Toggles `dark` / `light` class on `<html>` element; persists to `localStorage['pictalk-theme']`
  - FOUC-prevention inline script in `src/app/layout.tsx` applies class before first paint
  - `DarkModeToggle` uses `mounted` guard to avoid hydration mismatch
- **Icon search bar** on `/communicate`
  - Searches across all 89 built-in icons + user's custom icons by name
  - Hides category tabs and recently-used strip while search is active
  - `×` clear button; empty-state localised message (`communicate.searchEmpty`)
  - New translation keys added to `LanguageContext.tsx`: `communicate.searchPlaceholder`, `communicate.searchEmpty`

### Fixed (May 17, 2026 — session 3)
- **Dark mode not working (Tailwind v4 regression)**
  - Root cause: `darkMode: 'class'` in `tailwind.config.ts` is a Tailwind v3 option ignored by v4
  - Fix: added `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css` so `dark:` utilities respond to the `.dark` class
  - CSS variable overrides moved from `@media (prefers-color-scheme: dark) { :root }` to a `.dark {}` selector; system preference retained as fallback via `:root:not(.dark):not(.light)`
  - `DarkModeToggle.toggle()` now also adds/removes the `light` class to prevent the system-preference fallback from overriding an explicit light-mode choice
- **LanguageSwitcher hydration mismatch**
  - `useState` initialiser now always returns `'en'` (safe for SSR); `useEffect` reads `localStorage` and `navigator.language` client-side
  - Removed unused `t` import; added `aria-pressed` to EN/NO buttons

### Fixed (May 17, 2026 — session 2)
- **Build errors** (three TypeScript errors)
  - `communicate/page.tsx` — `icon.label` → `icon.name`
  - `indexedDB.ts` — `MetadataValue` union extended with `unknown[]`
  - `baseApi.ts` — removed dead `state.auth.token` reference

  - Client-side internationalization using React Context API
  - English and Norwegian language support
  - 90+ icon name translations
  - Category label translations (Needs, Actions, Feelings, People, Places, Custom)
  - Full UI text translation coverage
  - Language switcher component in top navigation (🇬🇧 EN / 🇳🇴 NO)
  - localStorage persistence for language preference
  - Speech synthesis support in selected language
  
- **Text-to-Icons Auto-Conversion** (2026-02-11)
  - Automatic icon conversion on space key press
  - Text remains visible while icons build up in sentence builder
  - Confidence threshold matching (0.3 minimum)
  - Real-time icon suggestions while typing
  
- **Communication Interface** (2026-02-10)
  - Icon grid with category filtering
  - Sentence builder with visual icon display
  - Text-to-Icons mode
  - Speech-to-Icons mode (placeholder)
  - Click icon to remove from sentence
  - Speak button with text-to-speech
  - Clear sentence button

### Changed
- **i18n Architecture Decision** (2026-02-12)
  - Abandoned next-intl after 200+ messages of debugging failures
  - Implemented simple client-side React Context solution instead
  - Removed middleware.ts and [locale] routing structure
  - URLs remain clean: `/communicate` instead of `/en/communicate`

### Fixed
- **Text-to-Icons UX Issues** (2026-02-11)
  - Fixed auto-conversion blocking input after first letter
  - Fixed icons not appearing in sentence builder
  - Fixed text visibility during typing
  - Lowered confidence threshold to accept more matches
  
- **Build Errors** (2026-02-11)
  - Fixed corrupted console.log causing parsing errors
  - Fixed missing module imports
  - Cleaned up duplicate navigation headers

### Removed
- **next-intl Integration** (2026-02-12)
  - Removed next-intl package
  - Removed src/middleware.ts
  - Removed src/i18n.ts configuration
  - Removed src/app/[locale] routing structure
  - Removed src/components/features/LanguageSwitcher.tsx (old version)
  - Removed messages/en.json and messages/no.json

### Security
- No security updates in this version

## [0.1.0] - 2026-02-08

### Added
- Initial Next.js 15 project setup with App Router
- TypeScript configuration
- Tailwind CSS styling
- Redux Toolkit state management
- NextAuth.js v5 authentication
- Drizzle ORM with Neon Postgres
- Database schema (8 tables)
- PWA configuration with offline support
- IndexedDB for offline storage
- Dark mode support
- Basic icon database with emoji symbols
- Icon matching algorithm with keyword mappings
- Dashboard page structure
- Authentication pages (login, register)

### Technical Decisions

#### Why Client-Side i18n Instead of next-intl?

**Problem**: 
After 200+ messages of attempting to integrate next-intl with Next.js 15 App Router, we encountered persistent failures:
- Routing conflicts with `[locale]` dynamic segments
- Middleware configuration incompatibilities
- Server-side rendering issues with App Router
- Build failures and cache corruption
- Complex URL structure (`/en/communicate` vs `/communicate`)

**Solution**: 
Implemented simple client-side React Context for translations:
- Instant language switching without page reload
- No routing complexity or middleware
- localStorage persistence
- Perfect for AAC apps requiring quick language changes
- More reliable with Next.js 15 App Router

**Files Created**:
- `src/contexts/LanguageContext.tsx` - Complete i18n implementation
- `src/components/common/LanguageSwitcher.tsx` - Language toggle UI
- `docs/i18n.md` - Comprehensive i18n documentation

**Lesson Learned**:
For authenticated PWAs with Next.js 15 App Router where SEO isn't a priority, client-side i18n is simpler, more reliable, and better suited than server-side solutions like next-intl.

---

## Version History

- **v0.1.0** (2026-02-08) - Initial setup with auth and database
- **Unreleased** - Multilingual support, communication interface, text-to-icons

---

## Future Roadmap

### v0.2.0 (Planned)
- [ ] Complete Speech-to-Icons integration
- [ ] Device pairing with QR codes
- [ ] Offline sync engine
- [ ] Custom icon upload
- [ ] Session logging

### v0.3.0 (Planned)
- [ ] Additional languages (Spanish, French, German)
- [ ] Advanced icon matching with ML
- [ ] Analytics dashboard
- [ ] Therapist portal

### v1.0.0 (Planned)
- [ ] Production-ready release
- [ ] Full offline functionality
- [ ] Native app wrappers (iOS/Android)
- [ ] ARASAAC icon integration
- [ ] Multi-user support
