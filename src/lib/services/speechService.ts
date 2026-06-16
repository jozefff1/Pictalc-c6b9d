/**
 * Speech Service - Text-to-Speech and Speech-to-Text
 * Uses Web Speech API for browser-native functionality
 */

import { STORAGE_KEYS } from '../utils/constants';

export interface SpeechConfig {
  speed?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  voiceURI?: string;
  lang?: string;
}

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

const LANGUAGE_ALIASES: Record<string, string[]> = {
  nb: ['nb', 'no', 'nn'],
  no: ['nb', 'no', 'nn'],
  nn: ['nb', 'no', 'nn'],
};

function languageBase(locale: string): string {
  return locale.toLowerCase().split(/[-_]/)[0];
}

function normalizeLocale(locale: string): string {
  return locale.toLowerCase().replace('_', '-');
}

function getLocaleCandidates(requestedLocale: string): string[] {
  const normalized = normalizeLocale(requestedLocale);
  const base = languageBase(normalized);

  if (base === 'nb' || base === 'nn' || base === 'no') {
    return Array.from(new Set([normalized, 'no-no', 'nb-no', 'nn-no', 'no']));
  }

  return [normalized];
}

function getSpeechPreferenceKey(locale: string): string {
  const base = languageBase(locale);
  if (base === 'nb' || base === 'nn' || base === 'no') return 'no';
  return base;
}

type SpeechVoicePreferences = Record<string, string>;

function readVoicePreferences(): SpeechVoicePreferences {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPEECH_VOICE_PREFERENCES);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed as SpeechVoicePreferences : {};
  } catch {
    return {};
  }
}

function writeVoicePreferences(preferences: SpeechVoicePreferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SPEECH_VOICE_PREFERENCES, JSON.stringify(preferences));
}

export function getPreferredVoiceURI(locale: string): string | null {
  const key = getSpeechPreferenceKey(locale);
  const preferences = readVoicePreferences();
  return preferences[key] ?? null;
}

export function setPreferredVoiceURI(locale: string, voiceURI: string): void {
  const key = getSpeechPreferenceKey(locale);
  const preferences = readVoicePreferences();
  preferences[key] = voiceURI;
  writeVoicePreferences(preferences);
}

export function clearPreferredVoiceURI(locale: string): void {
  const key = getSpeechPreferenceKey(locale);
  const preferences = readVoicePreferences();
  delete preferences[key];
  writeVoicePreferences(preferences);
}

export function findVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  requestedLocale: string,
): SpeechSynthesisVoice | null {
  const requested = normalizeLocale(requestedLocale);
  const requestedBase = languageBase(requested);
  const acceptedBases = LANGUAGE_ALIASES[requestedBase] ?? [requestedBase];

  const matching = voices.filter((voice) => acceptedBases.includes(languageBase(voice.lang)));
  if (matching.length === 0) return null;

  return matching.find((voice) => normalizeLocale(voice.lang) === requested)
    ?? matching.find((voice) => voice.localService)
    ?? matching[0];
}

export function resolveVoice(
  voices: SpeechSynthesisVoice[],
  requestedLocale: string,
  preferredVoiceURI?: string | null,
): SpeechSynthesisVoice | null {
  if (preferredVoiceURI) {
    const preferred = voices.find((voice) => voice.voiceURI === preferredVoiceURI);
    if (preferred) return preferred;
  }
  return findVoiceForLanguage(voices, requestedLocale);
}

// Check if browser supports speech synthesis
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Check if browser supports speech recognition
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Text-to-Speech: Speak text aloud
 */
export function speakText(text: string, config: SpeechConfig = {}): Promise<void> {
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
    utterance.lang = config.lang ?? 'en-US';
    
    if (config.voice) {
      utterance.voice = config.voice;
      utterance.lang = config.voice.lang;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoiceURI = config.voiceURI ?? getPreferredVoiceURI(utterance.lang);
      const localeCandidates = getLocaleCandidates(utterance.lang);
      let matchingVoice: SpeechSynthesisVoice | null = null;

      for (const locale of localeCandidates) {
        matchingVoice = resolveVoice(voices, locale, preferredVoiceURI);
        if (matchingVoice) break;
      }

      if (matchingVoice) {
        utterance.voice = matchingVoice;
        utterance.lang = matchingVoice.lang;
      } else if (localeCandidates.length > 1) {
        // Android engines vary between no-NO and nb-NO support. Keep a Norwegian fallback.
        utterance.lang = 'no-NO';
      }
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

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
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

    const synth = window.speechSynthesis;
    const initial = synth.getVoices();
    if (initial.length > 0) {
      resolve(initial);
      return;
    }

    let settled = false;
    const settle = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      if (typeof synth.removeEventListener === 'function') {
        synth.removeEventListener('voiceschanged', onVoicesChanged);
      }
      if (synth.onvoiceschanged === onVoicesChanged) {
        synth.onvoiceschanged = null;
      }
      clearTimeout(fallbackTimeout);
      resolve(voices);
    };

    const onVoicesChanged = () => {
      settle(synth.getVoices());
    };

    const fallbackTimeout = setTimeout(() => {
      settle(synth.getVoices());
    }, 1200);

    if (typeof synth.addEventListener === 'function') {
      synth.addEventListener('voiceschanged', onVoicesChanged);
    } else {
      synth.onvoiceschanged = onVoicesChanged;
    }
  });
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
      this.recognition.lang = config.lang ?? 'en-US';
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
