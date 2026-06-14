export const SPEECH_LOCALES = {
  en: 'en-US',
  no: 'nb-NO',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
} as const;

export type SpeechLanguage = keyof typeof SPEECH_LOCALES;

const LOCALE_ALIASES: Record<string, string[]> = {
  'nb-NO': ['nb-NO', 'nb', 'no-NO', 'no', 'nn-NO', 'nn'],
  'en-US': ['en-US', 'en-GB', 'en'],
  'es-ES': ['es-ES', 'es'],
  'fr-FR': ['fr-FR', 'fr'],
  'de-DE': ['de-DE', 'de'],
};

export function getSpeechLocale(language: string): string {
  return SPEECH_LOCALES[language as SpeechLanguage] ?? language;
}

export function getSpeechLocaleAliases(locale: string): string[] {
  const normalized = getSpeechLocale(locale);
  return LOCALE_ALIASES[normalized] ?? [normalized, normalized.split('-')[0]];
}

export function rankVoiceLanguage(voiceLanguage: string, requestedLocale: string): number {
  const normalizedVoice = voiceLanguage.toLowerCase();
  const aliases = getSpeechLocaleAliases(requestedLocale).map((alias) => alias.toLowerCase());
  const exactIndex = aliases.indexOf(normalizedVoice);

  if (exactIndex >= 0) return 100 - exactIndex;

  const requestedBase = aliases[0].split('-')[0];
  return normalizedVoice.split('-')[0] === requestedBase ? 50 : 0;
}
