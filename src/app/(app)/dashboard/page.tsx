'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t('dashboard.welcome')}, {session?.user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('dashboard.role')}: <span className="font-medium capitalize">{session?.user?.role}</span>
          </p>
        </div>

        {/* Quick Start - Communicate Button */}
        <div className="mb-6">
          <Link
            href="/communicate"
            className="
              inline-flex items-center gap-3
              px-8 py-4 rounded-xl
              bg-primary text-white
              hover:bg-primary-hover
              shadow-lg hover:shadow-xl
              transition-all
              text-lg font-semibold
            "
          >
            <span className="text-2xl">💬</span>
            {t('dashboard.start')}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/communicate" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.communicate.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.communicate.desc')}
            </p>
          </Link>

          <Link href="/dashboard/history" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.history.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.history.desc')}
            </p>
          </Link>

          <Link href="/dashboard/settings" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚙️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.settings.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.settings.desc')}
            </p>
          </Link>

          <Link href="/dashboard/icons" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🖼️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.icons.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.icons.desc')}
            </p>
          </Link>

          <Link href="/dashboard/patients" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.patients.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.patients.desc')}
            </p>
          </Link>

          <Link href="/learn" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-primary/20 dark:border-primary/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎓</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('dashboard.cards.learn.title')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('dashboard.cards.learn.desc')}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
