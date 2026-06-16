'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useLanguage, LANGUAGES, type Language } from '@/contexts/LanguageContext';
import { ICON_DATABASE } from '@/lib/data/icons';
import { SENTENCE_DATABASE, getSentenceText } from '@/lib/data/sentences';
import type { IconCategory } from '@/types/models';
import { speakText } from '@/lib/services/speechService';

type Mode = 'flashcard' | 'writing' | 'speaking';

const CATEGORY_ICONS: Record<IconCategory | 'all' | 'sentences', string> = {
  all: '🌐',
  needs: '🍽️',
  actions: '🎮',
  feelings: '😊',
  people: '👫',
  places: '🏠',
  custom: '⭐',
  sentences: '💬',
};

const CATEGORIES: (IconCategory | 'all' | 'sentences')[] = ['all', 'needs', 'actions', 'feelings', 'people', 'places', 'sentences'];

const LANG_BCP47: Record<Language, string> = {
  en: 'en-US', no: 'no-NO', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
};

function speak(text: string, lang: Language) {
  void speakText(text, { lang: LANG_BCP47[lang], speed: 0.9 });
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff]/gi, '');
}

export default function FlashcardDeck() {
  const { t, tLang, learnFrom, learnTarget } = useLanguage();

  const [mode, setMode] = useState<Mode>('flashcard');
  const [category, setCategory] = useState<IconCategory | 'all' | 'sentences'>('all');
  const [index, setIndex] = useState(0);
  const [knew, setKnew] = useState(0);
  const [didntKnow, setDidntKnow] = useState(0);
  const [done, setDone] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Flashcard state
  const [revealed, setRevealed] = useState(false);

  // Writing state
  const [input, setInput] = useState('');
  const [writeResult, setWriteResult] = useState<'correct' | 'wrong' | null>(null);

  // Speaking state
  const [listenState, setListenState] = useState<'idle' | 'listening' | 'correct' | 'wrong' | 'unsupported' | 'nospeech'>('idle');
  const [heardText, setHeardText] = useState('');
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const sentenceDeck = useMemo(() => SENTENCE_DATABASE, []);
  const sentenceCard = category === 'sentences' ? sentenceDeck[index] ?? null : null;

  const deck = useMemo(() => {
    if (category === 'sentences') return [];
    const base = category === 'all'
      ? ICON_DATABASE.filter((ic) => ic.category !== 'custom')
      : ICON_DATABASE.filter((ic) => ic.category === category);
    return base.filter((ic) => tLang(`icon.${ic.id}`, learnTarget) !== `icon.${ic.id}`);
  }, [category, learnTarget, tLang]);

  const effectiveDeckLength = category === 'sentences' ? sentenceDeck.length : deck.length;

  const card = deck[index];

  const resetCardState = useCallback(() => {
    setRevealed(false);
    setInput('');
    setWriteResult(null);
    setListenState('idle');
    setHeardText('');
    setImgError(false);
  }, []);

  const reset = useCallback((newCategory?: IconCategory | 'all' | 'sentences') => {
    setIndex(0);
    setKnew(0);
    setDidntKnow(0);
    setDone(false);
    resetCardState();
    if (newCategory !== undefined) setCategory(newCategory);
  }, [resetCardState]);

  const advance = useCallback((gotIt: boolean) => {
    if (gotIt) setKnew((k) => k + 1);
    else setDidntKnow((d) => d + 1);

    if (index + 1 >= effectiveDeckLength) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      resetCardState();
    }
  }, [index, effectiveDeckLength, resetCardState]);

  // --- Writing mode ---
  const handleWriteSubmit = () => {
    if (!input.trim()) return;
    let correctText: string;
    if (sentenceCard) {
      correctText = normalize(getSentenceText(sentenceCard, learnTarget));
    } else {
      if (!card) return;
      correctText = normalize(tLang(`icon.${card.id}`, learnTarget));
    }
    const isCorrect = normalize(input) === correctText;
    setWriteResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      const textToSpeak = sentenceCard
        ? getSentenceText(sentenceCard, learnTarget)
        : (card ? tLang(`icon.${card.id}`, learnTarget) : '');
      speak(textToSpeak, learnTarget);
    }
  };

  // --- Speaking mode ---
  const startListening = () => {
    const SR = (typeof window !== 'undefined') &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    if (!SR) { setListenState('unsupported'); return; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec: any = new SR();
    recognitionRef.current = rec;
    rec.lang = LANG_BCP47[learnTarget];
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    setListenState('listening');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      const transcripts = Array.from({ length: event.results[0].length }, (_: unknown, i: number) =>
        event.results[0][i].transcript as string
      );
      let targetNorm: string;
      let textToSpeak: string;
      if (sentenceCard) {
        textToSpeak = getSentenceText(sentenceCard, learnTarget);
        targetNorm = normalize(textToSpeak);
      } else {
        textToSpeak = card ? tLang(`icon.${card!.id}`, learnTarget) : '';
        targetNorm = normalize(textToSpeak);
      }
      const matched = transcripts.some((tr) => normalize(tr) === targetNorm);
      setHeardText(transcripts[0] ?? '');
      setListenState(matched ? 'correct' : 'wrong');
      if (matched) speak(textToSpeak, learnTarget);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (event: any) => {
      setListenState(event.error === 'no-speech' ? 'nospeech' : 'idle');
    };
    rec.onend = () => {
      if (recognitionRef.current === rec) recognitionRef.current = null;
    };
    rec.start();
  };

  if (category !== 'sentences' && deck.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No cards available for this category and language combination.
      </div>
    );
  }

  const fromFlag = LANGUAGES[learnFrom].flag;
  const targetFlag = LANGUAGES[learnTarget].flag;
  const targetWord = card ? tLang(`icon.${card.id}`, learnTarget) : '';
  const targetSentence = sentenceCard ? getSentenceText(sentenceCard, learnTarget) : '';
  const fromSentence = sentenceCard ? getSentenceText(sentenceCard, learnFrom) : '';

  // --- Session complete screen ---
  if (done) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">{t('learn.sessionDone')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('learn.score')}: <span className="text-green-500 font-bold">{knew}</span> / {effectiveDeckLength}
        </p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t('learn.restart')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Mode switcher */}
      <div className="flex justify-center gap-2 mb-5">
        {(['flashcard', 'writing', 'speaking'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); reset(); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${mode === m
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }`}
          >
            {m === 'flashcard' && '🃏'}
            {m === 'writing' && '✏️'}
            {m === 'speaking' && '🎤'}
            <span>{t(`learn.mode${m.charAt(0).toUpperCase() + m.slice(1)}`)}</span>
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => reset(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${category === cat
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50'
              }`}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span className="capitalize">{cat === 'all' ? t('learn.filterAll') : t(`category.${cat}`)}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>{index + 1} {t('learn.cardOf')} {effectiveDeckLength}</span>
        <span className="flex gap-3">
          <span className="text-green-500">✓ {knew}</span>
          <span className="text-red-400">✗ {didntKnow}</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${(index / effectiveDeckLength) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        {/* Hint label (learnFrom) */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <span>{fromFlag}</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {sentenceCard ? fromSentence : (card && tLang(`icon.${card.id}`, learnFrom))}
          </span>
        </div>

        {/* Icon image / sentence display */}
        {sentenceCard ? (
          <div className="flex items-center justify-center px-8 py-12">
            <p className="text-3xl font-bold text-center leading-snug">{fromSentence}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-10">
            {!imgError && card?.imageUrl ? (
              <div className="relative w-36 h-36">
                <Image
                  src={card.imageUrl}
                  alt={card ? tLang(`icon.${card.id}`, learnFrom) : ''}
                  fill
                  className="object-contain"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              </div>
            ) : (
              <span className="text-8xl" aria-hidden="true">{card?.symbol}</span>
            )}
          </div>
        )}

        {/* Bottom action area */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-5">

          {/* ── FLASHCARD MODE ── */}
          {mode === 'flashcard' && (
            <div className="text-center">
              {!revealed ? (
                <button
                  onClick={() => {
                    setRevealed(true);
                    speak(sentenceCard ? targetSentence : targetWord, learnTarget);
                  }}
                  className="rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {t('learn.tapToReveal')} {targetFlag}
                </button>
              ) : (
                <>
                  <p className={`font-bold mb-1 ${sentenceCard ? 'text-xl' : 'text-2xl'}`}>
                    {targetFlag} {sentenceCard ? targetSentence : targetWord}
                  </p>
                  <button
                    onClick={() => speak(sentenceCard ? targetSentence : targetWord, learnTarget)}
                    className="text-primary text-sm hover:underline mb-4 inline-block"
                    aria-label="Hear pronunciation"
                  >
                    🔊 {LANGUAGES[learnTarget].nativeName}
                  </button>
                  <div className="flex gap-3 justify-center mt-2">
                    <button
                      onClick={() => advance(false)}
                      className="flex-1 rounded-xl border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                    >
                      {t('learn.didntKnow')}
                    </button>
                    <button
                      onClick={() => advance(true)}
                      className="flex-1 rounded-xl border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 px-4 py-2.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
                    >
                      {t('learn.knew')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── WRITING MODE ── */}
          {mode === 'writing' && (
            <div className="text-center">
              {writeResult === null ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); handleWriteSubmit(); }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                    <span>{targetFlag}</span>
                    <span>{LANGUAGES[learnTarget].nativeName}</span>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('learn.typeAnswer')}
                    className="w-full max-w-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2.5 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-xl bg-primary px-8 py-2.5 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {t('learn.submit')}
                  </button>
                </form>
              ) : writeResult === 'correct' ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-2xl font-bold text-green-500">{t('learn.correct')}</p>
                  <p className="text-lg">{targetFlag} {sentenceCard ? targetSentence : targetWord}</p>
                  <button
                    onClick={() => advance(true)}
                    className="rounded-xl bg-green-500 px-8 py-2.5 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('learn.next')} →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-red-500 font-medium">{t('learn.tryAgain')}</p>
                  <p className="text-xl font-bold">{targetFlag} {sentenceCard ? targetSentence : targetWord}</p>
                  <button
                    onClick={() => speak(sentenceCard ? targetSentence : targetWord, learnTarget)}
                    className="text-primary text-sm hover:underline"
                    aria-label="Hear pronunciation"
                  >
                    🔊 {LANGUAGES[learnTarget].nativeName}
                  </button>
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => { setWriteResult(null); setInput(''); }}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      ↩ {t('learn.typeAnswer').replace('…', '')}
                    </button>
                    <button
                      onClick={() => advance(false)}
                      className="rounded-xl bg-primary px-5 py-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t('learn.next')} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SPEAKING MODE ── */}
          {mode === 'speaking' && (
            <div className="text-center">
              {listenState === 'unsupported' && (
                <p className="text-sm text-gray-400">{t('learn.speechUnsupported')}</p>
              )}

              {listenState === 'idle' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
                    <span>{targetFlag}</span>
                    <span>{LANGUAGES[learnTarget].nativeName}</span>
                  </div>
                  <button
                    onClick={startListening}
                    className="rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    🎤 {t('learn.speakNow')}
                  </button>
                </div>
              )}

              {listenState === 'listening' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center animate-pulse">
                    <span className="text-2xl">🎤</span>
                  </div>
                  <p className="text-sm text-gray-400">{t('learn.listening')}</p>
                </div>
              )}

              {listenState === 'nospeech' && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-sm text-gray-400">{t('learn.noSpeech')}</p>
                  <button
                    onClick={startListening}
                    className="rounded-xl bg-primary px-8 py-2.5 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    🎤 {t('learn.speakNow')}
                  </button>
                </div>
              )}

              {listenState === 'correct' && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-2xl font-bold text-green-500">{t('learn.correct')}</p>
                  <p className="text-lg">{targetFlag} {sentenceCard ? targetSentence : targetWord}</p>
                  {heardText && (
                    <p className="text-sm text-gray-400">🎤 &ldquo;{heardText}&rdquo;</p>
                  )}
                  <button
                    onClick={() => advance(true)}
                    className="rounded-xl bg-green-500 px-8 py-2.5 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t('learn.next')} →
                  </button>
                </div>
              )}

              {listenState === 'wrong' && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-red-500 font-medium">{t('learn.tryAgain')}</p>
                  <p className="text-xl font-bold">{targetFlag} {sentenceCard ? targetSentence : targetWord}</p>
                  {heardText && (
                    <p className="text-sm text-gray-400">🎤 &ldquo;{heardText}&rdquo;</p>
                  )}
                  <button
                    onClick={() => speak(sentenceCard ? targetSentence : targetWord, learnTarget)}
                    className="text-primary text-sm hover:underline"
                    aria-label="Hear pronunciation"
                  >
                    🔊 {LANGUAGES[learnTarget].nativeName}
                  </button>
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => setListenState('idle')}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      🎤 {t('learn.speakNow')}
                    </button>
                    <button
                      onClick={() => advance(false)}
                      className="rounded-xl bg-primary px-5 py-2 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      {t('learn.next')} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
