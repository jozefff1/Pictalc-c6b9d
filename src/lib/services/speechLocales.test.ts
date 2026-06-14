import { describe, expect, it } from 'vitest';
import {
  getSpeechLocale,
  getSpeechLocaleAliases,
  rankVoiceLanguage,
} from './speechLocales';

describe('speech locales', () => {
  it('maps the app Norwegian language to Norwegian Bokmal', () => {
    expect(getSpeechLocale('no')).toBe('nb-NO');
  });

  it('keeps an explicit locale unchanged', () => {
    expect(getSpeechLocale('en-GB')).toBe('en-GB');
  });

  it('allows Norwegian voice aliases as fallbacks', () => {
    expect(getSpeechLocaleAliases('no')).toContain('no-NO');
    expect(rankVoiceLanguage('nb-NO', 'no')).toBeGreaterThan(rankVoiceLanguage('nn-NO', 'no'));
  });

  it('does not rank an unrelated language', () => {
    expect(rankVoiceLanguage('de-DE', 'nb-NO')).toBe(0);
  });
});
