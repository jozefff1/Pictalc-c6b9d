# Multilingual Setup (next-intl)

## Overview
Pictalk v2 now supports multiple languages using `next-intl`. Currently implemented:
- **English (en)** - Default
- **Norwegian (no)** - Full translation

## Architecture

### 1. URL Structure
All routes are now locale-prefixed:
- `/en/communicate` - English version
- `/no/communicate` - Norwegian version
- `/` - Redirects to `/en` (default locale)

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
