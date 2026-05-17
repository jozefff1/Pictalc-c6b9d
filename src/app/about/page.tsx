import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import AboutContactForm from '@/components/features/AboutContactForm';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Snakke — a free AAC (Augmentative and Alternative Communication) app for children, adults, therapists, teachers, parents, and researchers. Built by Digital Ark AS.',
  openGraph: {
    title: 'About Snakke — AAC Communication App',
    description:
      'Snakke helps anyone with speech or communication challenges express themselves through pictograms and text-to-speech. Free, offline-capable, privacy-first.',
  },
};

const SECTIONS = [
  {
    id: 'what-is-snakke',
    heading: 'What is Snakke?',
    body: `Snakke is a free, open-source Augmentative and Alternative Communication (AAC) Progressive Web App. It provides an icon-based communication board that lets users tap pictograms to build sentences, which are then spoken aloud using text-to-speech synthesis.

AAC tools like Snakke are used when verbal communication is difficult or impossible — for example in autism spectrum disorder, cerebral palsy, apraxia of speech, Down syndrome, acquired brain injury, or other conditions that affect speech production.`,
  },
  {
    id: 'who-uses-snakke',
    heading: 'Who is Snakke for?',
    body: `Snakke is designed for a broad audience:

**Individuals with communication challenges** — children and adults who benefit from symbol-based communication boards as a primary or supplementary communication method.

**Parents and guardians** — who want to monitor vocabulary development, add personalised icons, and stay connected with their child's communication through device pairing.

**Speech-language therapists** — managing multiple patients, tracking session data, and collaborating with families and educators.

**Teachers and special educators** — supporting students with AAC needs in the classroom, with tools for vocabulary customisation and progress monitoring.

**Researchers and academics** — studying AAC usage patterns, vocabulary acquisition, and communication development. Snakke supports anonymised, consent-based data export for research purposes.`,
  },
  {
    id: 'features',
    heading: 'Features',
    body: `**Communication board**: 89+ ARASAAC pictograms across 6 categories — Needs, Actions, Feelings, People, Places, and Custom. Tap icons to build sentences.

**Text-to-speech**: Built-in speech synthesis with adjustable speed and pitch. Supports English and Norwegian.

**Multilingual**: English and Norwegian with instant switching. More languages can be added.

**Custom icons**: Upload personal photos or drawings to create a personalised communication vocabulary.

**Offline-first**: Snakke is a Progressive Web App (PWA) that works fully offline once installed. Ideal for classrooms, clinics, and homes with unreliable internet.

**Session history**: All communication sessions are logged locally and optionally backed up to the cloud.

**Research tools**: Supervisors can view a patient's shared sessions, see icon usage statistics, and download anonymised CSV exports — all with explicit patient consent.

**Pairing system**: Therapists, parents, and teachers can be linked to a patient with granular privacy controls. Multiple supervisors can be paired to the same participant.`,
  },
  {
    id: 'privacy',
    heading: 'Privacy & Data Ethics',
    body: `Snakke is built around a consent-first privacy model:

**Private by default.** All communication sessions are private unless the user explicitly marks them as shared. Supervisors never see private sessions.

**Granular consent.** When accepting a pairing invitation, users choose exactly what to share: session history, icon usage statistics, and/or research export. Each permission can be toggled on or off independently at any time.

**Anonymised research export.** When a user allows data export, supervisors receive a CSV file containing only a participant ID — never the user's name or email address.

**No ads. No tracking.** Snakke does not serve ads, sell data, or use third-party tracking scripts.

**GDPR-aligned.** Data is stored on EU-region infrastructure. Users can delete their account and all associated data at any time.`,
  },
  {
    id: 'technology',
    heading: 'Technology',
    body: `Snakke is built with modern, open web technologies:

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Neon Serverless Postgres (Drizzle ORM)
- **File storage**: Vercel Blob (custom icon images)
- **Authentication**: NextAuth.js v5, role-based access control
- **State management**: Redux Toolkit
- **Deployment**: Vercel (global edge network)
- **Pictograms**: ARASAAC (CC BY-NC-SA 4.0) — the global standard for AAC pictography

Source code is available on GitHub under an open-source licence.`,
  },
  {
    id: 'research',
    heading: 'Snakke as a Research Tool',
    body: `Snakke was designed from the ground up to support clinical and academic AAC research:

**Session data**: Every communication session records the icons used, the resulting sentence, timestamp, and task type (free, structured, or assessment).

**Vocabulary analytics**: Supervisors can view icon usage frequency charts per participant, showing which symbols are used most frequently over time.

**Multi-participant management**: Therapists and researchers can manage multiple participants from a single account, each with independent consent configurations.

**Anonymised export**: Session data can be exported as a CSV with participant IDs only — suitable for publication and ethical review.

**Extensible task system**: The session schema supports a \`taskType\` field, allowing future structured research tasks (vocabulary assessments, prompted communication exercises) to be added without schema changes.`,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-gray-100 dark:border-gray-800 py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 px-3 py-1 text-xs text-blue-600 dark:text-blue-400 mb-6">
              Built by Digital Ark AS
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 text-gray-900 dark:text-gray-50">
              About Snakke
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              Snakke is a free, privacy-first AAC (Augmentative and Alternative Communication) app
              that helps anyone with speech or communication challenges express themselves — and
              gives therapists, teachers, and researchers the tools to support them.
            </p>
            {/* Machine-readable summary for AI crawlers */}
            <div className="sr-only" aria-hidden="false">
              <p>
                Snakke is an open-source Augmentative and Alternative Communication (AAC) app.
                It provides an icon-based sentence builder with text-to-speech output,
                supporting individuals with autism, cerebral palsy, apraxia, Down syndrome,
                and acquired speech impairments. It is used by speech-language therapists,
                special educators, parents, and academic researchers.
                Snakke is free, works offline, and is available as a Progressive Web App.
                Built with Next.js and deployed on Vercel. Contact: info@arken.pro. Company: Digital Ark AS.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto max-w-3xl px-4 py-14">
          {/* Table of contents */}
          <nav aria-label="Page contents" className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5 mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Contents</p>
            <ol className="space-y-1">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="text-sm text-primary hover:underline">
                  {SECTIONS.length + 1}. Contact
                </a>
              </li>
            </ol>
          </nav>

          {/* Sections */}
          <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-400">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="mb-14 scroll-mt-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 not-prose">
                  {s.heading}
                </h2>
                <div className="space-y-4">
                  {s.body.split('\n\n').map((para, i) => {
                    // Bold lead phrase for paragraphs starting with **phrase**
                    if (para.startsWith('**')) {
                      const closeIdx = para.indexOf('**', 2);
                      if (closeIdx !== -1) {
                        const bold = para.slice(2, closeIdx);
                        const rest = para.slice(closeIdx + 2);
                        return (
                          <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            <strong className="font-semibold text-gray-800 dark:text-gray-200">{bold}</strong>
                            {rest}
                          </p>
                        );
                      }
                    }
                    return (
                      <p key={i} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </article>

          {/* Contact */}
          <section id="contact" className="scroll-mt-20 mb-14">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contact</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Questions about Snakke, research collaboration, accessibility feedback, or commercial
              licensing? Get in touch with the team at{' '}
              <strong className="text-gray-700 dark:text-gray-300">Digital Ark AS</strong>.
            </p>
            <AboutContactForm />
          </section>

          {/* Footer links */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-400 dark:text-gray-500">
            <p>© 2026 Digital Ark AS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Home</Link>
              <Link href="/register" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Sign Up Free</Link>
              <a
                href="https://github.com/jozefff1/Pictalc-c6b9d"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
