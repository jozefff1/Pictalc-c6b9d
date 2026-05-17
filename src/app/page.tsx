import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";

const DEMO_ICONS = [
  { symbol: '🍽️', label: 'Eat',   color: '#ff9d4d' },
  { symbol: '💧', label: 'Drink', color: '#5ac8fa' },
  { symbol: '😊', label: 'Happy', color: '#ff6b8b' },
  { symbol: '🆘', label: 'Help',  color: '#ff3b30' },
  { symbol: '💤', label: 'Sleep', color: '#bf5af2' },
  { symbol: '🎮', label: 'Play',  color: '#4cd964' },
  { symbol: '🏠', label: 'Home',  color: '#4a90e2' },
  { symbol: '❤️', label: 'Love',  color: '#ff6b8b' },
] as const;

const FLOATING = [
  ['🍽️', '8%',  '18%', '0s'],
  ['💧', '83%', '22%', '1.2s'],
  ['😊', '18%', '72%', '2.4s'],
  ['🏠', '76%', '66%', '0.8s'],
  ['🎮', '50%', '88%', '1.8s'],
  ['💤', '91%', '48%', '3s'],
] as const;

export default async function Home() {
  const session = await auth();
  if (session) redirect('/dashboard');

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <Header />

      <main id="main-content" className="flex-1">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-28 px-4">

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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-700/50 bg-blue-900/30 px-4 py-1.5 text-sm text-blue-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
              AAC — Augmentative &amp; Alternative Communication
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              Every child deserves<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                a voice.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Pictalk is a modern AAC app that helps children and individuals with
              communication challenges express themselves through icons and speech —
              online or offline.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-lg font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-700/50 hover:-translate-y-0.5"
              >
                Get Started Free →
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-lg font-semibold text-white hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats row ────────────────────────────────────── */}
        <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-10 px-4">
          <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {(
              [
                ['89+', 'Built-in icons'],
                ['2', 'Languages (EN/NO)'],
                ['100%', 'Works offline'],
                ['Free', 'Forever'],
              ] as const
            ).map(([stat, label]) => (
              <div key={label}>
                <div className="text-3xl font-bold text-primary">{stat}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo preview ─────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">See it in action</h2>
              <p className="text-gray-500 dark:text-gray-400">Tap icons to build sentences. Speak with one tap.</p>
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
                  🔊 Speak
                </div>
              </div>

              {/* Icon grid preview */}
              <div className="p-6 grid grid-cols-4 sm:grid-cols-8 gap-3">
                {DEMO_ICONS.map((icon) => (
                  <div
                    key={icon.label}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-shadow"
                    style={{
                      borderColor: `${icon.color}40`,
                      backgroundColor: `${icon.color}12`,
                    }}
                    aria-label={icon.label}
                  >
                    <span className="text-3xl mb-1" aria-hidden="true">{icon.symbol}</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{icon.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">Everything you need</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Built for real-world AAC use — reliable, fast, and accessible.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(
                [
                  { icon: '🎯', title: 'Icon-Based Communication', desc: 'Tap icons to build sentences. 89+ ARASAAC pictograms across 6 categories.', color: '#4a90e2' },
                  { icon: '🔊', title: 'Natural Text-to-Speech', desc: 'Adjustable speed and pitch. Speaks in English and Norwegian.', color: '#5ac8fa' },
                  { icon: '📱', title: 'Works Offline', desc: 'Progressive Web App — install it and use it anywhere, even without internet.', color: '#4cd964' },
                  { icon: '⭐', title: 'Custom Icons', desc: 'Upload your own photos and icons to personalise the board for each child.', color: '#ff9d4d' },
                  { icon: '📊', title: 'Communication History', desc: 'Supervisors can review past sessions and track vocabulary progress.', color: '#bf5af2' },
                  { icon: '🔒', title: 'Private &amp; Secure', desc: 'Your data stays private. No ads. No tracking. Secure authentication.', color: '#ff6b8b' },
                ] as const
              ).map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: `${f.color}22` }}
                    aria-hidden="true"
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who is it for ────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">Who is Pictalk for?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Designed around the people who use it every day.</p>

            <div className="grid md:grid-cols-3 gap-6">
              {(
                [
                  {
                    emoji: '👧',
                    role: 'Children',
                    desc: "Children with autism, cerebral palsy, apraxia, or other conditions that affect verbal communication. Simple, colourful, and fast.",
                    bgClass: 'from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40',
                    borderClass: 'border-blue-200 dark:border-blue-800',
                  },
                  {
                    emoji: '👨‍👩‍👧',
                    role: 'Parents & Guardians',
                    desc: "Monitor communication sessions, add personalised icons, and pair your device to view your child's board in real time.",
                    bgClass: 'from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40',
                    borderClass: 'border-purple-200 dark:border-purple-800',
                  },
                  {
                    emoji: '🏫',
                    role: 'Therapists & Teachers',
                    desc: "Manage multiple students, review history across all paired users, and customise vocabulary for each individual.",
                    bgClass: 'from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40',
                    borderClass: 'border-green-200 dark:border-green-800',
                  },
                ] as const
              ).map((p) => (
                <div
                  key={p.role}
                  className={`rounded-2xl border ${p.borderClass} bg-gradient-to-br ${p.bgClass} p-7`}
                >
                  <div className="text-5xl mb-4" aria-hidden="true">{p.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{p.role}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────── */}
        <section className="py-24 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">Free forever. No credit card required.</p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-10 py-4 text-lg font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Create Free Account →
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-gray-950 py-10 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div className="text-xl font-bold text-white">Pictalk</div>
          <nav aria-label="Footer navigation" className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Sign Up</Link>
            <a
              href="https://github.com/jozefff1/Pictalc-c6b9d"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
          <p>&copy; 2026 Pictalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

