'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { getIconsByCategory, searchIcons } from '@/lib/data/icons';
import { setCustomIcons, addIconToSentence } from '@/store/slices/communicationSlice';
import CategorySelector from '@/components/features/CategorySelector';
import IconGrid from '@/components/features/IconGrid';
import SentenceBuilder from '@/components/features/SentenceBuilder';
import TextToIcons from '@/components/features/TextToIcons';
import SpeechToIcons from '@/components/features/SpeechToIcons';

type CommunicationMode = 'icons' | 'text' | 'speech';

export default function CommunicatePage() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<CommunicationMode>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  const selectedCategory = useAppSelector((state) => state.communication.selectedCategory);
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const recentIcons = useAppSelector((state) => state.communication.recentIcons);
  
  useEffect(() => {
    // Fetch custom icons on mount
    fetch('/api/icons')
      .then(res => res.ok ? res.json() : { icons: [] })
      .then(data => {
        if (data.icons) {
          dispatch(setCustomIcons(data.icons));
        }
      })
      .catch(err => console.error('Failed to load custom icons:', err));
  }, [dispatch]);

  const defaultIcons = getIconsByCategory(selectedCategory as any);
  const filteredCustomIcons = customIcons.filter(icon => icon.category === selectedCategory);
  const categoryIcons = [...defaultIcons, ...filteredCustomIcons];

  // Search: built-in matches + custom icon matches, deduped by id
  const trimmedQuery = searchQuery.trim();
  const searchResults = trimmedQuery
    ? [
        ...searchIcons(trimmedQuery),
        ...customIcons.filter(i => i.name.toLowerCase().includes(trimmedQuery.toLowerCase())),
      ].filter((icon, idx, arr) => arr.findIndex(x => x.id === icon.id) === idx)
    : [];

  const iconsToShow = trimmedQuery ? searchResults : categoryIcons;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sentence Builder - Always Visible */}
      <SentenceBuilder isPrivate={isPrivate} />

      {/* Mode Tabs + Privacy Toggle */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setMode('icons')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'icons'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">🎯</span>
              {t('communicate.tab.icons')}
            </button>
            <button
              onClick={() => setMode('text')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'text'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">⌨️</span>
              {t('communicate.tab.type')}
            </button>
            <button
              onClick={() => setMode('speech')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'speech'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">🎤</span>
              {t('communicate.tab.speech')}
            </button>
          </div>
          {/* Privacy toggle */}
          <button
            onClick={() => setIsPrivate((p) => !p)}
            title={isPrivate ? 'Private session — not shared with supervisors' : 'Shared session — visible to supervisors'}
            className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isPrivate
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            }`}
          >
            {isPrivate ? '🔒' : '🔓'}
            <span className="hidden sm:inline">{isPrivate ? 'Private' : 'Shared'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {mode === 'icons' && (
          <div>
            {/* Search bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="relative max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('communicate.searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Recently used — hidden during search */}
            {!trimmedQuery && recentIcons.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t('communicate.recent')}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {recentIcons.slice(0, 8).map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => dispatch(addIconToSentence(icon))}
                      className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 transition-all w-16"
                      title={icon.name}
                    >
                      {icon.imageUrl ? (
                        <img
                          src={icon.imageUrl}
                          alt={icon.name}
                          width={40}
                          height={40}
                          className="object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-2xl leading-none">{icon.symbol}</span>
                      )}
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate w-full text-center">
                        {icon.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category tabs — hidden during search */}
            {!trimmedQuery && <CategorySelector />}

            {/* Icon grid — search results or category icons */}
            {trimmedQuery && iconsToShow.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400 text-sm">
                {t('communicate.searchEmpty')} &ldquo;{trimmedQuery}&rdquo;
              </div>
            ) : (
              <IconGrid icons={iconsToShow} />
            )}
          </div>
        )}

        {mode === 'text' && <TextToIcons />}

        {mode === 'speech' && <SpeechToIcons />}
      </main>
    </div>
  );
}
