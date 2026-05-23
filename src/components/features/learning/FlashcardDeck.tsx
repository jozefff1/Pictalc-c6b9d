'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage, LANGUAGES, type Language } from '@/contexts/LanguageContext';
import { ICON_DATABASE } from '@/lib/data/icons';
import type { IconCategory } from '@/types/models';

const CATEGORY_ICONS: Record<IconCategory | 'all', string> = {
  all: '🌐',
  needs: '🍽️',
  actions: '🎮',
  feelings: '😊',
  people: '👫',
  places: '🏠',
  custom: '⭐',
};

const CATEGORIES: (IconCategory | 'all')[] = ['all', 'needs', 'actions', 'feelings', 'people', 'places'];

function speak(text: string, lang: Language) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const langMap: Record<Language, string> = {
    en: 'en-US', no: 'nb-NO', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
  };
  utter.lang = langMap[lang];
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function FlashcardDeck() {
  const { t, tLang, learnFrom, learnTarget } = useLanguage();

  const [category, setCategory] = useState<IconCategory | 'all'>('all');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knew, setKnew] = useState(0);
  const [didntKnow, setDidntKnow] = useState(0);
  const [done, setDone] = useState(false);
  const [imgError, setImgError] = useState(false);

  const deck = useMemo(() => {
    const base = category === 'all'
      ? ICON_DATABASE.filter((ic) => ic.category !== 'custom')
      : ICON_DATABASE.filter((ic) => ic.category === category);
    // Only include icons that have a translation in the target language
    return base.filter((ic) => tLang(`icon.${ic.id}`, learnTarget) !== `icon.${ic.id}`);
  }, [category, learnTarget, tLang]);

  const card = deck[index];

  const reset = useCallback((newCategory?: IconCategory | 'all') => {
    setIndex(0);
    setRevealed(false);
    setKnew(0);
    setDidntKnow(0);
    setDone(false);
    setImgError(false);
    if (newCategory !== undefined) setCategory(newCategory);
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    if (card) speak(tLang(`icon.${card.id}`, learnTarget), learnTarget);
  };

  const advance = (gotIt: boolean) => {
    if (gotIt) setKnew((k) => k + 1);
    else setDidntKnow((d) => d + 1);

    if (index + 1 >= deck.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
      setImgError(false);
    }
  };

  if (deck.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        No cards available for this category and language combination.
      </div>
    );
  }

  const fromFlag = LANGUAGES[learnFrom].flag;
  const targetFlag = LANGUAGES[learnTarget].flag;

  return (
    <div>
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

      {/* Session complete */}
      {done ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">{t('learn.sessionDone')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t('learn.score')}: <span className="text-green-500 font-bold">{knew}</span> / {deck.length}
          </p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {t('learn.restart')}
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{index + 1} {t('learn.cardOf')} {deck.length}</span>
            <span className="flex gap-3">
              <span className="text-green-500">✓ {knew}</span>
              <span className="text-red-400">✗ {didntKnow}</span>
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-6">
            <div
              className="bg-primary h-1.5 rounded-full transition-all"
              style={{ width: `${((index) / deck.length) * 100}%` }}
            />
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">

            {/* Hint label (learnFrom) */}
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
              <span>{fromFlag}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {tLang(`icon.${card.id}`, learnFrom)}
              </span>
            </div>

            {/* Icon image */}
            <div className="flex items-center justify-center p-10">
              {!imgError && card.imageUrl ? (
                <div className="relative w-36 h-36">
                  <Image
                    src={card.imageUrl}
                    alt={tLang(`icon.${card.id}`, learnFrom)}
                    fill
                    className="object-contain"
                    onError={() => setImgError(true)}
                    unoptimized
                  />
                </div>
              ) : (
                <span className="text-8xl" aria-hidden="true">{card.symbol}</span>
              )}
            </div>

            {/* Reveal / answer */}
            <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-5 text-center">
              {!revealed ? (
                <button
                  onClick={handleReveal}
                  className="rounded-xl bg-primary px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {t('learn.tapToReveal')} {targetFlag}
                </button>
              ) : (
                <>
                  <p className="text-2xl font-bold mb-1">
                    {targetFlag} {tLang(`icon.${card.id}`, learnTarget)}
                  </p>
                  <button
                    onClick={() => speak(tLang(`icon.${card.id}`, learnTarget), learnTarget)}
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
          </div>
        </>
      )}
    </div>
  );
}
