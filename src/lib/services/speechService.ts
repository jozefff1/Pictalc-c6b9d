/**
 * Speech Service - Text-to-Speech and Speech-to-Text
 * Browser speech is the built-in fallback. Downloadable local neural or
 * opt-in online providers can be registered without changing feature code.
 */

import { getSpeechLocale, rankVoiceLanguage } from './speechLocales';

export interface SpeechConfig {
  speed?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

export interface SpeechSynthesisProvider {
  id: string;
  priority: number;
  isAvailable(): boolean;
  speak(text: string, config: SpeechConfig): Promise<void>;
  stop(): void;
}

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

const externalSpeechProviders: SpeechSynthesisProvider[] = [];

export function registerSpeechSynthesisProvider(provider: SpeechSynthesisProvider): () => void {
  const existingIndex = externalSpeechProviders.findIndex((item) => item.id === provider.id);
  if (existingIndex >= 0) externalSpeechProviders.splice(existingIndex, 1);
  externalSpeechProviders.push(provider);

  return () => {
    const index = externalSpeechProviders.findIndex((item) => item.id === provider.id);
    if (index >= 0) externalSpeechProviders.splice(index, 1);
  };
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported(): boolean {
  return externalSpeechProviders.some((provider) => provider.isAvailable())
    || (typeof window !== 'undefined' && 'speechSynthesis' in window);
}

// Check if browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Text-to-Speech: Speak text aloud
 */
function speakWithBrowser(text: string, config: SpeechConfig = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    if (!text || text.trim().length === 0) {
      reject(new Error('No text to speak'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply configuration
    utterance.rate = config.speed ?? 1.0;
    utterance.pitch = config.pitch ?? 1.0;
    utterance.volume = config.volume ?? 1.0;
    utterance.lang = getSpeechLocale(config.lang ?? 'en-US');
    
    if (config.voice) {
      utterance.voice = config.voice;
    } else {
      utterance.voice = selectBestBrowserVoice(
        window.speechSynthesis.getVoices(),
        utterance.lang,
      );
    }

    // Android Chrome workaround: after cancel(), the engine may silently pause
    // new utterances. Poll resume() while speaking to prevent this.
    let resumeInterval: ReturnType<typeof setInterval> | null = null;
    const cleanup = () => {
      if (resumeInterval) { clearInterval(resumeInterval); resumeInterval = null; }
    };

    utterance.onstart = () => {
      resumeInterval = setInterval(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }, 250);
    };
    utterance.onend = () => { cleanup(); resolve(); };
    utterance.onerror = (event) => {
      cleanup();
      // interrupted/canceled are not real errors (e.g. new speak() called)
      if (event.error === 'interrupted' || event.error === 'canceled') {
        resolve();
      } else {
        reject(new Error(`Speech error: ${event.error}`));
      }
    };

    // 50ms delay after cancel() to avoid Android Chrome's silent-pause race condition
    setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
  });
}

const browserSpeechProvider: SpeechSynthesisProvider = {
  id: 'browser',
  priority: 0,
  isAvailable: () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  speak: speakWithBrowser,
  stop: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },
};

/**
 * Text-to-Speech: use the highest-priority available provider.
 *
 * A downloaded local neural provider should use a priority above 0. Browser
 * speech remains available as the zero-download fallback.
 */
export async function speakText(text: string, config: SpeechConfig = {}): Promise<void> {
  if (!text || text.trim().length === 0) throw new Error('No text to speak');

  const providers = [...externalSpeechProviders, browserSpeechProvider]
    .filter((provider) => provider.isAvailable())
    .sort((a, b) => b.priority - a.priority);

  if (providers.length === 0) {
    throw new Error('Speech synthesis not supported in this browser');
  }

  let latestError: unknown;
  for (const provider of providers) {
    try {
      await provider.speak(text, { ...config, lang: getSpeechLocale(config.lang ?? 'en-US') });
      return;
    } catch (error) {
      latestError = error;
    }
  }

  throw latestError instanceof Error ? latestError : new Error('Speech synthesis failed');
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  externalSpeechProviders.forEach((provider) => provider.stop());
  browserSpeechProvider.stop();
}

/**
 * Get available voices
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // Voices might not be loaded yet
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

export function selectBestBrowserVoice(
  voices: SpeechSynthesisVoice[],
  requestedLocale: string,
): SpeechSynthesisVoice | null {
  const ranked = voices
    .map((voice, index) => ({
      voice,
      index,
      score:
        rankVoiceLanguage(voice.lang, requestedLocale)
        + (voice.localService ? 10 : 0)
        + (voice.default ? 1 : 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked[0]?.voice ?? null;
}

/**
 * Speech Recognition Class
 */
export class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private onResultCallback?: (transcript: string, isFinal: boolean) => void;
  private onErrorCallback?: (error: string) => void;
  private onEndCallback?: () => void;

  constructor(config: SpeechRecognitionConfig = {}) {
    if (!isSpeechRecognitionSupported()) {
      throw new Error('Speech recognition not supported in this browser');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    if (this.recognition) {
      this.recognition.lang = getSpeechLocale(config.lang ?? 'en-US');
      this.recognition.continuous = config.continuous ?? false;
      this.recognition.interimResults = config.interimResults ?? true;
      this.recognition.maxAlternatives = config.maxAlternatives ?? 1;

      // Set up event handlers
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;

        if (this.onResultCallback) {
          this.onResultCallback(transcript, isFinal);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };
    }
  }

  /**
   * Start listening
   */
  start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): void {
    if (this.isListening) {
      this.stop();
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;

    try {
      this.recognition?.start();
      this.isListening = true;
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : 'Failed to start recognition');
      }
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Abort listening
   */
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }
}

// Type definitions for browsers that don't have them
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
