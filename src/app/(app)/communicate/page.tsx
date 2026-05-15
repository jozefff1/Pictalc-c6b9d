'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { getIconsByCategory } from '@/lib/data/icons';
import { setCustomIcons } from '@/store/slices/communicationSlice';
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
  
  const selectedCategory = useAppSelector((state) => state.communication.selectedCategory);
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  
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
  
  const icons = [...defaultIcons, ...filteredCustomIcons];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Sentence Builder - Always Visible */}
      <SentenceBuilder />

      {/* Mode Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
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
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {mode === 'icons' && (
          <div>
            <CategorySelector />
            <IconGrid icons={icons} />
          </div>
        )}

        {mode === 'text' && <TextToIcons />}

        {mode === 'speech' && <SpeechToIcons />}
      </main>
    </div>
  );
}
