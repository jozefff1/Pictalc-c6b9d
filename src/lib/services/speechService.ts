/**
 * Speech Service - Text-to-Speech and Speech-to-Text
 * Uses Web Speech API for browser-native functionality
 */

export interface SpeechConfig {
  speed?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

export interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
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
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
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
