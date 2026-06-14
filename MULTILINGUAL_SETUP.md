# Multilingual Setup

_Archived and redirected: June 14, 2026_

The maintained internationalization documentation is:

- [`docs/i18n.md`](docs/i18n.md) — current React Context architecture,
  translation coverage, usage, testing, and maintenance
- [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — regulatory and
  market-validation baseline

Snakke uses client-side React Context from
`src/contexts/LanguageContext.tsx`. It does not use `next-intl`, locale-prefixed
routes, locale middleware, or `/messages/*.json` translation files.

The previous version of this document mixed the current React Context approach
with an obsolete `next-intl` implementation guide. That obsolete section was
removed because following it would break the current routing and translation
architecture.

Current language scope:

| Language | UI | Icon labels |
|---|---|---|
| Norwegian (`no`, default) | Full | 101 |
| English (`en`) | Full | 101 |
| Spanish (`es`) | English fallback | 101 |
| French (`fr`) | English fallback | 101 |
| German (`de`) | English fallback | 101 |

Do not claim professional translation quality for ES/FR/DE until native-speaker
review has been completed.
