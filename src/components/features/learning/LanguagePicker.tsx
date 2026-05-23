'use client';

import { useLanguage, LANGUAGES, type Language } from '@/contexts/LanguageContext';

const ALL_LANGUAGES = Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][];

function LangButton({
  lang,
  selected,
  onClick,
  disabled,
}: {
  lang: Language;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const info = LANGUAGES[lang];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all
        ${selected
          ? 'border-primary bg-primary text-white shadow-md'
          : disabled
            ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-sm'
        }`}
    >
      <span className="text-lg">{info.flag}</span>
      <span>{info.nativeName}</span>
    </button>
  );
}

export default function LanguagePicker() {
  const { t, learnFrom, learnTarget, setLearnFrom, setLearnTarget, swapLearnLanguages } = useLanguage();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-center">

        {/* learnFrom */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            {t('learn.iKnow')}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGES.map(([code]) => (
              <LangButton
                key={code}
                lang={code}
                selected={learnFrom === code}
                disabled={learnTarget === code}
                onClick={() => setLearnFrom(code)}
              />
            ))}
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swapLearnLanguages}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center justify-center text-lg hover:border-primary hover:text-primary transition-colors"
            aria-label={t('learn.swap')}
            title={t('learn.swap')}
          >
            ⇄
          </button>
        </div>

        {/* learnTarget */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            {t('learn.iAmLearning')}
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_LANGUAGES.map(([code]) => (
              <LangButton
                key={code}
                lang={code}
                selected={learnTarget === code}
                disabled={learnFrom === code}
                onClick={() => setLearnTarget(code)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
