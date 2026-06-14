import { describe, expect, it } from 'vitest';
import { findVoiceForLanguage } from './speechService';

function voice(lang: string, localService = false): SpeechSynthesisVoice {
  return {
    default: false,
    lang,
    localService,
    name: lang,
    voiceURI: lang,
  };
}

describe('findVoiceForLanguage', () => {
  it('uses Chrome no-NO voice for Norwegian Bokmal', () => {
    expect(findVoiceForLanguage([voice('de-DE'), voice('no-NO')], 'nb-NO')?.lang).toBe('no-NO');
  });

  it('keeps English and Norwegian voices separate', () => {
    const voices = [voice('en-US'), voice('no-NO')];
    expect(findVoiceForLanguage(voices, 'en-US')?.lang).toBe('en-US');
    expect(findVoiceForLanguage(voices, 'nb-NO')?.lang).toBe('no-NO');
  });

  it('never selects an unrelated default language', () => {
    expect(findVoiceForLanguage([voice('de-DE', true)], 'nb-NO')).toBeNull();
  });
});
