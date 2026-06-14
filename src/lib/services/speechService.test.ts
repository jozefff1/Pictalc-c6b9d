import { describe, expect, it } from 'vitest';
import { selectBestBrowserVoice } from './speechService';

function voice(
  lang: string,
  options: { localService?: boolean; default?: boolean } = {},
): SpeechSynthesisVoice {
  return {
    default: options.default ?? false,
    lang,
    localService: options.localService ?? false,
    name: lang,
    voiceURI: lang,
  };
}

describe('browser voice selection', () => {
  it('prefers an exact Norwegian Bokmal voice', () => {
    const selected = selectBestBrowserVoice(
      [voice('en-US', { localService: true }), voice('nb-NO')],
      'nb-NO',
    );

    expect(selected?.lang).toBe('nb-NO');
  });

  it('prefers an installed local voice among equal language matches', () => {
    const selected = selectBestBrowserVoice(
      [voice('en-US'), voice('en-US', { localService: true })],
      'en-US',
    );

    expect(selected?.localService).toBe(true);
  });

  it('returns null when no language matches', () => {
    expect(selectBestBrowserVoice([voice('de-DE')], 'nb-NO')).toBeNull();
  });
});
