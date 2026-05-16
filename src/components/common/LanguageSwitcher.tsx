'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`
          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${
            language === 'en'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }
        `}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => setLanguage('no')}
        className={`
          px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
          ${
            language === 'no'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }
        `}
        aria-label="Switch to Norwegian"
        aria-pressed={language === 'no'}
      >
        🇳🇴 NO
      </button>
    </div>
  );
}
