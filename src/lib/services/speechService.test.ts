import { describe, expect, it } from 'vitest';
import { findVoiceForLanguage, resolveVoice } from './speechService';

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

  it('supports Nynorsk requests with Norwegian voices', () => {
    expect(findVoiceForLanguage([voice('no-NO')], 'nn-NO')?.lang).toBe('no-NO');
  });
});

describe('resolveVoice', () => {
  it('uses preferred voice URI when available', () => {
    const voices = [
      { ...voice('nb-NO'), voiceURI: 'voice-a', name: 'A' },
      { ...voice('nb-NO'), voiceURI: 'voice-b', name: 'B' },
    ];
    expect(resolveVoice(voices, 'nb-NO', 'voice-b')?.voiceURI).toBe('voice-b');
  });

  it('falls back to locale matching when preferred URI is missing', () => {
    const voices = [voice('en-US'), voice('nb-NO')];
    expect(resolveVoice(voices, 'nb-NO', 'missing')?.lang).toBe('nb-NO');
  });
});
