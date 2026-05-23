# Multilingual Setup

_Last updated: May 23, 2026_

> ⚠️ **Important**: An earlier attempt used `next-intl` with `[locale]` route segments. It was completely removed due to persistent failures with Next.js 15/16 App Router (routing conflicts, middleware incompatibility, build failures). **Do NOT reintroduce `next-intl`.**

---

## Architecture

Snakke uses a **client-side React Context** for all i18n. There are no locale-prefixed routes, no middleware, and no server-side translation. Language switching is instant with no page reload.

### Core file: `src/contexts/LanguageContext.tsx`

```
LanguageContext
├── language (UI language)          — useSyncExternalStore (SSR-safe)
├── setLanguage()                   — updates localStorage + external store
├── t(key)                          — translate key in current UI language
├── tIcon(iconId)                   — shorthand for t(`icon.${iconId}`)
├── tLang(key, lang)               — translate key in any explicit language
├── learnFrom / learnTarget         — useState + useEffect (localStorage)
├── setLearnFrom / setLearnTarget   — update learn language pair
└── swapLearnLanguages()            — swap learnFrom ↔ learnTarget
```

### Supported languages

| Code | Language  | Native name | Flag | UI strings | Icon labels |
|------|-----------|-------------|------|------------|-------------|
| `en` | English   | English     | 🇬🇧  | ✅ Full     | ✅ Full      |
| `no` | Norwegian | Norsk       | 🇳🇴  | ✅ Full     | ✅ Full      |
| `es` | Spanish   | Español     | 🇪🇸  | ❌ EN only  | ✅ Full      |
| `fr` | French    | Français    | 🇫🇷  | ❌ EN only  | ✅ Full      |
| `de` | German    | Deutsch     | 🇩🇪  | ❌ EN only  | ✅ Full      |

ES, FR, DE are available for language **learning** (icon labels only). Full UI translation requires professional translators — see SUGGESTIONS.md §10.

---

## Translation key namespaces

| Namespace | Purpose | EN | NO | ES/FR/DE |
|-----------|---------|----|----|----------|
| `app.*` | App name, description | ✅ | ✅ | — |
| `nav.*` | Navigation labels | ✅ | ✅ | — |
| `auth.*` | Login/register/reset pages | ✅ | ✅ | — |
| `communicate.*` | AAC board UI | ✅ | ✅ | — |
| `sentence.*` | Sentence builder | ✅ | ✅ | — |
| `type.*` | Text-to-icons panel | ✅ | ✅ | — |
| `category.*` | Icon category labels | ✅ | ✅ | — |
| `dashboard.*` | Dashboard pages | ✅ | ✅ | — |
| `language.*` | Language switcher labels | ✅ | ✅ | — |
| `icon.*` | Icon names (89 icons) | ✅ | ✅ | ✅ |
| `home.*` | Landing page content | ✅ | ✅ | — |
| `learn.*` | Learning mode UI | ✅ | ✅ | — |

---

## localStorage keys (from `src/lib/utils/constants.ts`)

```ts
STORAGE_KEYS.LANGUAGE      // 'snakke-language'     — UI language
STORAGE_KEYS.LEARN_FROM    // 'snakke-learn-from'   — learning source language
STORAGE_KEYS.LEARN_TARGET  // 'snakke-learn-target' — learning target language
```

---

## Adding a new UI language (e.g. Polish `pl`)

1. Add `'pl'` to the `Language` type in `LanguageContext.tsx`
2. Add an entry to the `LANGUAGES` map: `{ name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' }`
3. Add a translation dictionary with all key namespaces (copy EN as a starting template)
4. The `LanguageSwitcher` component reads `LANGUAGES` automatically — no UI changes needed
5. Rebuild — no routing or middleware changes required

---

## Adding or updating a translation key

1. Open `src/contexts/LanguageContext.tsx`
2. Find the relevant namespace in the EN dictionary (e.g. `'learn.submit': 'Check'`)
3. Add/update the same key in every other language dictionary
4. Keys missing from a language fall back to English automatically (the `t()` function walks `en` as fallback)

---

## Language Learning vs UI Language

These are independent:

- **UI language** (`language`) controls all page text — nav, buttons, labels
- **Learn languages** (`learnFrom`, `learnTarget`) control the flashcard deck source/target

A user can have their UI in Norwegian while learning Spanish from French. All combinations are valid.

---

## Why not next-intl?

See `copilot-instructions.md` for the full history. Short version:
- `[locale]` segments caused 404s throughout the app
- Middleware conflicted with NextAuth v5 middleware
- SSR + App Router hydration issues with `NextIntlClientProvider`
- Build cache corruption across multiple sessions

The client-side Context approach has zero routing complexity, instant switching, SSR-safe via `useSyncExternalStore`, and is perfectly suited for an AAC app where fast language switching is a UX requirement.


### 2. Files Structure
```
src/
├── app/
│   ├── [locale]/           # Locale-based routes
│   │   ├── layout.tsx      # Locale-specific layout with NextIntlClientProvider
│   │   ├── page.tsx        # Home page
│   │   ├── (app)/          # Authenticated routes
│   │   ├── (auth)/         # Auth routes
│   │   └── api/            # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Root page (redirects to /en)
├── i18n.ts                 # i18n configuration
├── middleware.ts           # Locale detection & routing
└── lib/
    └── ai/
        └── keywordMappings/
            ├── en.ts       # English AAC keywords
            └── no.ts       # Norwegian AAC keywords
messages/
├── en.json                 # English translations
└── no.json                 # Norwegian translations
```

### 3. Translation Files
Located in `/messages/`:
- `en.json` - English UI text & icon names
- `no.json` - Norwegian UI text & icon names

Structure:
```json
{
  "common": { ... },
  "auth": { ... },
  "dashboard": { ... },
  "communicate": {
    "textToIcons": { ... },
    "speechToIcons": { ... },
    ...
  },
  "icons": {
    "needs": { "eat": "Spise", ... },
    "actions": { "play": "Leke", ... },
    ...
  }
}
```

### 4. Keyword Mappings for Icon Matching
**Critical for AAC functionality!**

Separate keyword files per locale:
- `src/lib/ai/keywordMappings/en.ts` - English AAC keywords
- `src/lib/ai/keywordMappings/no.ts` - Norwegian AAC keywords

Example (Norwegian):
```typescript
'eat': ['spise', 'spiser', 'mat', 'sulten', 'måltid', ...],
'water': ['vann', 'h2o', 'væske'],
```

The icon matcher automatically uses the correct locale's keywords when matching user input to icons.

## Usage in Components

### Using Translations
```tsx
import { useTranslations, useLocale } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('communicate.textToIcons');
  const locale = useLocale();

  return (
    <div>
      <h1>{t('label')}</h1>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Icon Matching with Locale
```tsx
import { matchTextToIcons } from '@/lib/ai/iconMatcher';
import { useLocale } from 'next-intl';

const locale = useLocale();
const results = matchTextToIcons('water', 10, locale);
// Norwegian: matches "vann", "væske"
// English: matches "water", "h2o"
```

### Language Switcher
Add to any component:
```tsx
import LanguageSwitcher from '@/components/features/LanguageSwitcher';

<LanguageSwitcher />
```

## Configuration

### Supported Locales
Defined in `src/i18n.ts`:
```typescript
export const locales = ['en', 'no'] as const;
```

### Default Locale
Set in `src/middleware.ts`:
```typescript
defaultLocale: 'en'
```

### Speech Recognition Locale
Auto-configured based on user's selected locale:
- `en` → `en-US`
- `no` → `nb-NO` (Norwegian Bokmål)

## Adding a New Language

1. **Add locale to config** (`src/i18n.ts`):
```typescript
export const locales = ['en', 'no', 'sv'] as const; // Add Swedish
```

2. **Create translation file** (`messages/sv.json`):
```json
{
  "common": { "appName": "Pictalk", ... },
  ...
}
```

3. **Create keyword mappings** (`src/lib/ai/keywordMappings/sv.ts`):
```typescript
export const KEYWORD_MAP_SV: Record<string, string[]> = {
  'eat': ['äta', 'mat', 'hungrig', ...],
  ...
};
```

4. **Update icon matcher** (`src/lib/ai/iconMatcher.ts`):
```typescript
import { KEYWORD_MAP_SV } from './keywordMappings/sv';

const KEYWORD_MAPS = {
  en: KEYWORD_MAP_EN,
  no: KEYWORD_MAP_NO,
  sv: KEYWORD_MAP_SV, // Add Swedish
};
```

5. **Update language switcher** (optional):
```tsx
{loc === 'sv' ? '🇸🇪 SV' : ...}
```

## Best Practices

### For AAC Keywords
- Include **common misspellings** (e.g., "watter" for "water")
- Add **regional variants** (e.g., "soda" vs "pop")
- Include **child-friendly terms** (e.g., "boo-boo" for "pain")
- Add **emotional descriptors** (e.g., "owie" for "pain")

### For UI Translations
- Keep text **short and clear** (AAC users often have limited reading skills)
- Use **simple vocabulary**
- Include **visual cues** where possible (emojis in placeholders)

### For Speech Recognition
- Test with **native speakers** of each language
- Consider **regional accents** (e.g., Norwegian dialects)
- May need to add dialect-specific keywords

## Testing

### Test Text-to-Icon Conversion
**English**: Type "water" → should show 💧 Water icon  
**Norwegian**: Type "vann" → should show 💧 Water icon

### Test Speech-to-Icon
**English**: Say "I want water" → should auto-add icons  
**Norwegian**: Say "Jeg vil ha vann" → should auto-add icons

### Test Language Switching
1. Navigate to `/en/communicate`
2. Click language switcher → "🇳🇴 NO"
3. URL changes to `/no/communicate`
4. UI updates to Norwegian

## Deployment Notes

### Environment Variables
No additional environment variables needed for next-intl.

### Vercel Configuration
Next-intl middleware is automatically handled. No special Vercel config required.

### SEO Considerations
- Each locale has its own URL (good for SEO)
- `hreflang` tags auto-generated by Next.js
- Consider adding locale-specific metadata in `layout.tsx`

## Localization Status

### ✅ Fully Translated
- UI labels and buttons
- Icon names (display only)
- Icon keyword mappings (text-to-icon matching)
- Speech recognition language
- Error messages
- Help text

### ⏳ Not Yet Translated
- Email templates (future)
- Database content (user-generated)
- API error messages
- Console logs (development only)

## Future Enhancements

### Phase 2
- Add more languages (Swedish, Danish, German)
- Dialect support (e.g., British vs American English)
- User-customizable keyword mappings

### Phase 3 (AI/ML)
- Replace keyword matching with embeddings (language-agnostic)
- Cross-language semantic matching
- Auto-translation of custom icons

## Support

For questions about multilingual support:
1. Check `messages/` files for UI text
2. Check `src/lib/ai/keywordMappings/` for AAC keywords
3. Review next-intl docs: https://next-intl-docs.vercel.app/
