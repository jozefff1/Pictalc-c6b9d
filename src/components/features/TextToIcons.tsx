'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { matchTextToIcons } from '@/lib/ai/iconMatcher';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';
import IconMatchGrid from '@/components/features/communication/IconMatchGrid';
import { useUserSentences } from '@/hooks/useUserSentences';
import { useIconLabels } from '@/hooks/useIconLabels';
import { ICON_DATABASE } from '@/lib/data/icons';
import type { IconMatch } from '@/lib/ai/iconMatcher';
import {
  SENTENCE_DATABASE,
  SENTENCE_CATEGORIES,
  SENTENCE_CATEGORY_ICONS,
  SENTENCE_CATEGORY_LABELS,
  getPrioritySentences,
  getSentenceText,
  type SentenceCategory,
} from '@/lib/data/sentences';

type BrowserTab = SentenceCategory | 'my_phrases';

export default function TextToIcons() {
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const { labels: iconLabels } = useIconLabels(language);
  const { sentences: userSentences } = useUserSentences(session?.user?.id);
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState<IconMatch[]>([]);
  const [autoConverted, setAutoConverted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<BrowserTab>('needs');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const previousText = inputText;
    
    // Check if user just typed a space (completed a word)
    if (newText.endsWith(' ') && previousText.length > 0 && !previousText.endsWith(' ')) {
      // Extract the last completed word (before the new space)
      const words = previousText.trim().split(/\s+/);
      const completedWord = words[words.length - 1].toLowerCase();
      
      // Try to match and add to sentence
      const results = matchTextToIcons(completedWord, 1, language, customIcons, iconLabels);
      
      if (results.length > 0 && results[0].confidence >= 0.3) {
        dispatch(addIconToSentence(results[0].icon));
        setAutoConverted(true);
      }
    }
    
    setInputText(newText);

    // Get the current word being typed and show suggestions
    const currentWord = newText.trim().split(/\s+/).pop()?.toLowerCase() || '';
    
    if (currentWord && !newText.endsWith(' ')) {
      const results = matchTextToIcons(currentWord, 6, language, customIcons, iconLabels);
      setMatches(results);
    } else {
      setMatches([]);
    }
  };

  /** Converts a text string directly to icons and adds them to the sentence strip */
  const convertTextToIcons = (text: string) => {
    const words = text.toLowerCase().trim().split(/\s+/);
    let convertedCount = 0;
    words.forEach((word) => {
      const results = matchTextToIcons(word, 1, language, customIcons, iconLabels);
      if (results.length > 0 && results[0].confidence >= 0.3) {
        dispatch(addIconToSentence(results[0].icon));
        convertedCount++;
      }
    });
    setAutoConverted(convertedCount > 0);
    setInputText('');
    setMatches([]);
  };

  const handleConvertToIcons = () => {
    if (!inputText.trim()) return;
    setIsSearching(true);
    convertTextToIcons(inputText);
    setIsSearching(false);
  };

  const handleAddIcon = (match: IconMatch) => {
    dispatch(addIconToSentence(match.icon));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // On Enter, convert the last word if any
      if (inputText.trim()) {
        const words = inputText.trim().split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase();
        const results = matchTextToIcons(lastWord, 1, language, customIcons, iconLabels);

        if (results.length > 0 && results[0].confidence >= 0.3) {
          dispatch(addIconToSentence(results[0].icon));
          setAutoConverted(true);
        }
        
        // Clear input after pressing Enter
        setInputText('');
        setMatches([]);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="text-input" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t('type.title')}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t('type.hint')}
          </p>
          <div className="flex gap-2">
            <input
              id="text-input"
              type="text"
              value={inputText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder={t('type.placeholder')}
              className="
                flex-1 px-4 py-3 rounded-lg
                border-2 border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                text-lg
              "
            />
            <button
              onClick={handleConvertToIcons}
              disabled={!inputText.trim() || isSearching}
              className="
                px-6 py-3 rounded-lg
                bg-primary text-white
                hover:bg-primary-hover
                disabled:bg-gray-300 dark:disabled:bg-gray-700
                disabled:cursor-not-allowed
                transition-colors
                font-medium
                whitespace-nowrap
              "
            >
              {isSearching ? t('type.converting') : t('type.convert')}
            </button>
          </div>
          {autoConverted && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              {t('type.success')}
            </p>
          )}
        </div>

        {/* Additional Suggestions */}
        {matches.length > 0 && (
          <IconMatchGrid
            matches={matches}
            onAdd={handleAddIcon}
            label={t('type.suggestions')}
          />
        )}

        {/* No Results Message */}
        {matches.length === 0 && autoConverted && (
          <div className="text-center py-8 text-green-600 dark:text-green-400">
            <p className="text-lg mb-2">✓ All words converted to icons!</p>
            <p className="text-sm">Type another sentence to continue</p>
          </div>
        )}

        {/* Sentence Browser — shown when input is empty */}
        {!autoConverted && matches.length === 0 && !inputText && (
          <div className="mt-4">

            {/* ── Quick Phrases ─────────────────────────────────────── */}
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              ⚡ {t('type.quickPhrases')}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {getPrioritySentences().map((sentence) => (
                <button
                  key={sentence.id}
                  onClick={() => convertTextToIcons(getSentenceText(sentence, language))}
                  className="px-4 py-2.5 bg-primary/10 dark:bg-primary/20 border-2 border-primary/30 hover:border-primary hover:bg-primary/20 dark:hover:bg-primary/30 rounded-2xl text-sm font-semibold text-primary transition-all active:scale-95"
                >
                  {getSentenceText(sentence, language)}
                </button>
              ))}
            </div>

            {/* ── Category browser ──────────────────────────────────── */}
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              {t('type.examples')}
            </p>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SENTENCE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span>{SENTENCE_CATEGORY_ICONS[cat]}</span>
                  <span>{SENTENCE_CATEGORY_LABELS[cat][language] ?? SENTENCE_CATEGORY_LABELS[cat].en}</span>
                </button>
              ))}
              {/* My Phrases tab — only when user has custom sentences */}
              {userSentences.length > 0 && (
                <button
                  onClick={() => setActiveCategory('my_phrases')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeCategory === 'my_phrases'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-primary/10 hover:bg-primary/20 text-primary'
                  }`}
                >
                  <span>⭐</span>
                  <span>My Phrases</span>
                  <span className="ml-0.5 text-[10px] opacity-70">({userSentences.length})</span>
                </button>
              )}
            </div>

            {/* Sentence grid — click goes directly to icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeCategory === 'my_phrases'
                ? userSentences.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => convertTextToIcons(s.text)}
                      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-primary/20 dark:border-primary/30 rounded-2xl hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all active:scale-95 text-sm text-left group"
                    >
                      <span className="text-xl shrink-0">
                        {(() => {
                          const icon = ICON_DATABASE.find((i) => i.id === s.iconIds[0]);
                          return icon?.symbol ?? '⭐';
                        })()}
                      </span>
                      <span className="font-medium leading-snug group-hover:text-primary transition-colors">
                        {s.text}
                      </span>
                    </button>
                  ))
                : SENTENCE_DATABASE.filter((s) => s.category === activeCategory).map((sentence) => (
                    <button
                      key={sentence.id}
                      onClick={() => convertTextToIcons(getSentenceText(sentence, language))}
                      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all active:scale-95 text-sm text-left group"
                    >
                      <span className="text-xl">{SENTENCE_CATEGORY_ICONS[activeCategory as SentenceCategory]}</span>
                      <span className="font-medium leading-snug group-hover:text-primary transition-colors">
                        {getSentenceText(sentence, language)}
                      </span>
                    </button>
                  ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
