'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';

const FLOATING = [
  ['🍽️', '8%',  '18%', '0s'],
  ['💧', '83%', '22%', '1.2s'],
  ['😊', '18%', '72%', '2.4s'],
  ['🏠', '76%', '66%', '0.8s'],
  ['🎮', '50%', '88%', '1.8s'],
  ['💤', '91%', '48%', '3s'],
] as const;

const DEMO_ICON_KEYS = [
  { symbol: '🍽️', key: 'icon.eat',   color: '#ff9d4d' },
  { symbol: '💧', key: 'icon.drink', color: '#5ac8fa' },
  { symbol: '😊', key: 'icon.happy', color: '#ff6b8b' },
  { symbol: '🆘', key: 'icon.help',  color: '#ff3b30' },
  { symbol: '💤', key: 'icon.sleep', color: '#bf5af2' },
  { symbol: '🎮', key: 'icon.play',  color: '#4cd964' },
  { symbol: '🏠', key: 'icon.home',  color: '#4a90e2' },
  { symbol: '❤️', key: 'icon.love',  color: '#ff6b8b' },
] as const;

export default function LandingPage() {
  const { t } = useLanguage();

  const FEATURES = [
    { icon: '🎯', titleKey: 'home.features.icon_comm.title', descKey: 'home.features.icon_comm.desc', color: '#4a90e2' },
    { icon: '🔊', titleKey: 'home.features.tts.title',       descKey: 'home.features.tts.desc',       color: '#5ac8fa' },
    { icon: '📱', titleKey: 'home.features.offline.title',   descKey: 'home.features.offline.desc',   color: '#4cd964' },
    { icon: '⭐', titleKey: 'home.features.custom.title',    descKey: 'home.features.custom.desc',    color: '#ff9d4d' },
    { icon: '📊', titleKey: 'home.features.history.title',   descKey: 'home.features.history.desc',   color: '#bf5af2' },
    { icon: '🔒', titleKey: 'home.features.private.title',   descKey: 'home.features.private.desc',   color: '#ff6b8b' },
  ] as const;

  const WHO = [
    {
      emoji: '👧',
      roleKey: 'home.who.children.role',
      descKey: 'home.who.children.desc',
      bgClass: 'from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40',
      borderClass: 'border-blue-200 dark:border-blue-800',
    },
    {
      emoji: '👨‍👩‍👧',
      roleKey: 'home.who.parents.role',
      descKey: 'home.who.parents.desc',
      bgClass: 'from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40',
      borderClass: 'border-purple-200 dark:border-purple-800',
    },
    {
      emoji: '🏫',
      roleKey: 'home.who.therapists.role',
      descKey: 'home.who.therapists.desc',
      bgClass: 'from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40',
      borderClass: 'border-green-200 dark:border-green-800',
    },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <a href="#main-content" className="skip-to-main">{t('home.skip')}</a>
      <Header />

      <main id="main-content" className="flex-1">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 py-28 px-4">

          {/* Floating background icons */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            {FLOATING.map(([emoji, left, top, delay], i) => (
              <span
                key={i}
                className="absolute text-4xl opacity-[0.08] float-icon"
                style={{ left, top, animationDelay: delay }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div className="relative container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-700/50 bg-blue-900/30 px-4 py-1.5 text-sm text-blue-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
              {t('home.hero.badge')}
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              {t('home.hero.headline1')}<br />
              <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {t('home.hero.headline2')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-700/50 hover:-translate-y-0.5"
              >
                {t('home.hero.cta.start')}
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-lg font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                {t('home.hero.cta.login')}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats row ────────────────────────────────────── */}
        <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-10 px-4">
          <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">89+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.stats.icons')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.stats.languages')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.stats.offline')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{t('home.stats.free')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.stats.forever')}</div>
            </div>
          </div>
        </section>

        {/* ── Demo preview ─────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t('home.demo.title')}</h2>
              <p className="text-gray-500 dark:text-gray-400">{t('home.demo.subtitle')}</p>
            </div>

            {/* Mock communication board */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400" aria-hidden="true"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400" aria-hidden="true"></div>
                <div className="w-3 h-3 rounded-full bg-green-400" aria-hidden="true"></div>
                <div className="ml-3 flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-1.5 text-sm text-gray-400 truncate">
                  I want &rarr; eat &rarr; water
                </div>
                <div className="ml-auto rounded-lg bg-primary px-4 py-1.5 text-sm text-white font-medium whitespace-nowrap">
                  {t('home.demo.speak')}
                </div>
              </div>

              {/* Icon grid preview */}
              <div className="p-6 grid grid-cols-4 sm:grid-cols-8 gap-3">
                {DEMO_ICON_KEYS.map((icon) => (
                  <div
                    key={icon.key}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-shadow"
                    style={{
                      borderColor: `${icon.color}40`,
                      backgroundColor: `${icon.color}12`,
                    }}
                    aria-label={t(icon.key)}
                  >
                    <span className="text-3xl mb-1" aria-hidden="true">{icon.symbol}</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t(icon.key)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/communicate"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
              >
                {t('home.demo.cta')}
              </Link>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{t('home.demo.note')}</p>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">{t('home.features.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">{t('home.features.subtitle')}</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div
                  key={f.titleKey}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${f.color}22` }}
                    aria-hidden="true"
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(f.titleKey)}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t(f.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who is it for ────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">{t('home.who.title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">{t('home.who.subtitle')}</p>

            <div className="grid md:grid-cols-3 gap-6">
              {WHO.map((p) => (
                <div
                  key={p.roleKey}
                  className={`rounded-2xl border ${p.borderClass} bg-linear-to-br ${p.bgClass} p-7`}
                >
                  <div className="text-5xl mb-4" aria-hidden="true">{p.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{t(p.roleKey)}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{t(p.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="py-24 px-4 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-blue-100 mb-8 text-lg">{t('home.cta.subtitle')}</p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-10 py-4 text-lg font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              {t('home.cta.button')}
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-gray-950 py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div className="text-xl font-bold text-white">Snakke</div>
          <nav aria-label="Footer navigation" className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">{t('home.footer.about')}</Link>
            <Link href="/login" className="hover:text-white transition-colors">{t('home.hero.cta.login')}</Link>
            <Link href="/register" className="hover:text-white transition-colors">{t('auth.register')}</Link>
            <a
              href="https://github.com/jozefff1/Pictalc-c6b9d"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
          <p>&copy; 2026 <a href="mailto:info@arken.pro" className="hover:text-white transition-colors">Digital Ark AS</a>. {t('home.footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
