# Pictalk v2 - Next.js PWA Setup Progress

## Project Overview
AAC (Augmentative and Alternative Communication) app for children with communication challenges. Modern PWA built with Next.js 15, TypeScript, Tailwind CSS, deployed on Vercel with offline-first capabilities.

## Setup Checklist

- [ ] Clarify Project Requirements
- [ ] Scaffold the Project  
- [ ] Customize the Project
- [ ] Install Required Extensions
- [ ] Compile the Project
- [ ] Create and Run Task
- [ ] Launch the Project
- [ ] Ensure Documentation is Complete

## Project Details
- **Type**: Next.js 15 PWA
- **Language**: TypeScript
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State**: Redux Toolkit + RTK Query
- **i18n**: Custom React Context (client-side)
- **Database**: Vercel Postgres (Drizzle ORM)
- **Storage**: Vercel Blob
- **Auth**: NextAuth.js v5
- **Deployment**: Vercel

## Translation Implementation

### Current Status: ✅ Implemented (English + Norwegian)

**Architecture**: Client-side i18n using React Context API
- File: `src/contexts/LanguageContext.tsx`
- Component: `src/components/common/LanguageSwitcher.tsx`

**Coverage**:
- 90+ icon translations
- Category labels
- Full UI text
- Speech synthesis

**Important**: ⚠️ DO NOT use next-intl library

### next-intl Issues (Critical - Read Before Implementing i18n)

**Problem History**: 
We attempted next-intl integration with Next.js 15 App Router for over 200+ messages with persistent failures.

**Specific Issues**:
1. Routing conflicts with `[locale]` segments causing 404 errors
2. Middleware configuration incompatibility
3. Server-side rendering issues with App Router
4. Build failures and cache corruption
5. Complex routing structure (`/en/communicate` vs `/communicate`)

**Resolution**: 
Complete removal of next-intl. Implemented simple client-side React Context for translations.

**Why Client-Side Works Better**:
- Instant language switching without page reload
- No routing complexity
- No middleware conflicts
- localStorage persistence
- Perfect for AAC apps requiring quick language changes

**If Adding New Languages**:
1. Edit `LanguageContext.tsx` - add language to type
2. Add translation dictionary
3. Add button to `LanguageSwitcher.tsx`
4. No routing or middleware changes needed!
