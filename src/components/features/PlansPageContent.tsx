'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const CONTENT = {
  en: {
    badge: 'Product and Delivery Roadmap',
    title: 'Snakke Plans and Delivery Priorities',
    intro:
      'This page summarizes current product status and upcoming phases. The direction is to keep the app useful for families while scaling responsibly for therapists, schools, institutions, and research projects.',
    phases: [
      {
        title: 'Phase 0-4: Core Product and Reliability',
        items: [
          'AAC communication board, custom icons, and sentence builder with text-to-speech',
          'Pairing workflows for family and supervisor collaboration',
          'PWA setup with offline-first behavior and service worker support',
          'Authentication, profile management, and preferences',
        ],
      },
      {
        title: 'Phase 5-6: Icon and Intelligence Expansion',
        items: [
          'Community-contributed icon library with moderation and sharing',
          'Improved icon discovery and semantic matching',
          'Enhanced multilingual support and learning workflows',
        ],
      },
      {
        title: 'Phase 7-8: Accessibility and Growth',
        items: [
          'Switch-access and advanced accessibility coverage',
          'Broader distribution strategy and stakeholder-specific information pages',
          'Structured onboarding for parents, therapists, schools, and institutions',
        ],
      },
      {
        title: 'Phase 9: Institutional and Research Platform',
        items: [
          'Organization model for schools, clinics, and research groups',
          'Consent registry, audit logging, and data governance controls',
          'Institutional analytics and controlled research data export',
          'Compliance-focused implementation for privacy and governance',
        ],
      },
    ],
    nextTitle: 'What is next',
    nextText:
      'The immediate execution focus is compliance-first infrastructure: multi-tenant hardening, consent and audit foundations, and organizational role management. This creates a safe base for institutional pilots and research collaboration.',
    btnResearch: 'Research Information',
    btnAbout: 'About Snakke',
    footerTitle: 'Snakke roadmap summary',
    footerHome: 'Home',
    footerAbout: 'About',
    footerResearch: 'Research',
  },
  no: {
    badge: 'Produkt- og leveranseroadmap',
    title: 'Snakke planer og leveranseprioriteringer',
    intro:
      'Denne siden oppsummerer naavaerende produktstatus og kommende faser. Retningen er a holde appen nyttig for familier samtidig som den skaleres ansvarlig for terapeuter, skoler, institusjoner og forskningsprosjekter.',
    phases: [
      {
        title: 'Fase 0-4: Kjerneprodukt og robusthet',
        items: [
          'ASK-kommunikasjonsbrett, egendefinerte ikoner og setningsbygger med tekst-til-tale',
          'Parkoblingsflyt for samarbeid mellom familie og veiledere',
          'PWA-oppsett med offline-forst adferd og service worker-stotte',
          'Autentisering, profilhandtering og preferanser',
        ],
      },
      {
        title: 'Fase 5-6: Utvidelse av ikonbibliotek og intelligens',
        items: [
          'Fellesskapsbidratt ikonbibliotek med moderering og deling',
          'Bedre ikonoppdagelse og semantisk matching',
          'Forbedret flerspraklig stotte og laeringsflyter',
        ],
      },
      {
        title: 'Fase 7-8: Tilgjengelighet og vekst',
        items: [
          'Switch-access og avansert tilgjengelighetsdekning',
          'Bredere distribusjonsstrategi og interessentspesifikke informasjonssider',
          'Strukturert onboarding for foreldre, terapeuter, skoler og institusjoner',
        ],
      },
      {
        title: 'Fase 9: Institusjons- og forskningsplattform',
        items: [
          'Organisasjonsmodell for skoler, klinikker og forskningsgrupper',
          'Samtykkeregister, revisjonsspor og datastyringskontroller',
          'Institusjonsanalyse og kontrollert forskningseksport',
          'Etterlevelsesfokusert implementering for personvern og styring',
        ],
      },
    ],
    nextTitle: 'Hva er neste steg',
    nextText:
      'Umiddelbart fokus er etterlevelsesforst infrastruktur: flerleietaker-herding, grunnlag for samtykke og revisjonsspor, samt organisasjonsbasert rollestyring. Dette skaper et trygt grunnlag for institusjonelle piloter og forskningssamarbeid.',
    btnResearch: 'Forskningsinformasjon',
    btnAbout: 'Om Snakke',
    footerTitle: 'Oppsummering av Snakke-roadmap',
    footerHome: 'Hjem',
    footerAbout: 'Om',
    footerResearch: 'Forskning',
  },
} as const;

export default function PlansPageContent() {
  const { language } = useLanguage();
  const c = language === 'no' ? CONTENT.no : CONTENT.en;

  return (
    <main id="main-content" className="container mx-auto max-w-4xl px-4 py-12">
      <section className="mb-10">
        <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
          {c.badge}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">{c.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{c.intro}</p>
      </section>

      <section aria-label="Roadmap phases" className="space-y-5">
        {c.phases.map((phase) => (
          <article key={phase.title} className="rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{phase.title}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{c.nextTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{c.nextText}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/research" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            {c.btnResearch}
          </Link>
          <Link href="/about" className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            {c.btnAbout}
          </Link>
        </div>
      </section>

      <footer className="mt-12 border-t border-gray-200 px-1 py-8 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>{c.footerTitle}</p>
          <nav aria-label="Plans page footer links" className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerHome}</Link>
            <Link href="/about" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerAbout}</Link>
            <Link href="/research" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerResearch}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
