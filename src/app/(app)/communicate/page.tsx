'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { getIconsByCategory } from '@/lib/data/icons';
import CategorySelector from '@/components/features/CategorySelector';
import IconGrid from '@/components/features/IconGrid';
import SentenceBuilder from '@/components/features/SentenceBuilder';
import TextToIcons from '@/components/features/TextToIcons';
import SpeechToIcons from '@/components/features/SpeechToIcons';

type CommunicationMode = 'icons' | 'text' | 'speech';

export default function CommunicatePage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<CommunicationMode>('icons');
  const selectedCategory = useAppSelector((state) => state.communication.selectedCategory);
  const icons = getIconsByCategory(selectedCategory as 'needs' | 'actions' | 'feelings' | 'people' | 'places' | 'custom');

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
