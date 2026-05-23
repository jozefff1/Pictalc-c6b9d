'use client';

import Header from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguagePicker from './LanguagePicker';
import FlashcardDeck from './FlashcardDeck';

export default function LearnPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('learn.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('learn.subtitle')}</p>
        </div>

        <LanguagePicker />
        <FlashcardDeck />
      </main>
    </div>
  );
}
