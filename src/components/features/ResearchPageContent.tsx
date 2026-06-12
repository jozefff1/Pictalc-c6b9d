'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const CONTENT = {
  en: {
    badge: 'Research and Institutional Information',
    title: 'Snakke for Research, Schools, and Clinical Institutions',
    intro:
      'Snakke is an AAC platform designed for families, therapists, teachers, and researchers. The platform combines offline-first communication tools with consent-based data sharing and institution-ready governance.',
    cards: [
      {
        title: 'Consent-First Data Model',
        text: 'Research participation is designed to be explicit and revocable. Consent status, withdrawal events, and data-access actions are planned as auditable events so institutions can demonstrate ethical compliance.',
      },
      {
        title: 'Institutional Multi-Tenancy',
        text: 'School districts, clinics, and research groups require strict tenant isolation. Snakke is planned with role-based organizations and database-level policy controls to prevent cross-tenant data leakage.',
      },
      {
        title: 'Clinical and Educational Use',
        text: 'Therapists and educators can track communication sessions, vocabulary trends, and participant progress while maintaining user-controlled privacy boundaries.',
      },
      {
        title: 'Compliance Roadmap',
        text: 'The roadmap prioritizes GDPR-oriented governance and supports future expansion for HIPAA/FERPA-aligned institutional requirements where applicable.',
      },
    ],
    capabilityTitle: 'Current and Planned Research Capabilities',
    bullets: [
      'Communication session logging with icon-level event detail.',
      'Pairing workflows for supervised collaboration between participants and professionals.',
      'Planned consent registry and withdrawal workflow for study participation.',
      'Planned audit trail for sensitive data access and exports.',
      'Planned institutional dashboards for organizations and research teams.',
    ],
    ctaTitle: 'Read the Implementation Roadmap',
    ctaText: 'See the phased delivery plan for institutional architecture, compliance hardening, and research features.',
    ctaPlans: 'View Plans Page',
    ctaAbout: 'About Snakke',
    footerTitle: 'Digital Ark AS - Snakke Research Information',
    footerHome: 'Home',
    footerAbout: 'About',
    footerPlans: 'Plans',
  },
  no: {
    badge: 'Informasjon for forskning og institusjoner',
    title: 'Snakke for forskning, skoler og kliniske institusjoner',
    intro:
      'Snakke er en ASK-plattform laget for familier, terapeuter, laerere og forskere. Plattformen kombinerer offline-forstekommunikasjon med samtykkebasert datadeling og styring tilpasset institusjoner.',
    cards: [
      {
        title: 'Samtykke-forst datamodell',
        text: 'Forskningsdeltakelse er laget for a vaere eksplisitt og mulig a trekke tilbake. Samtykkestatus, tilbaketrekking og datatilgang planlegges som sporbare hendelser slik at institusjoner kan dokumentere etisk etterlevelse.',
      },
      {
        title: 'Institusjonell flerleietaker-modell',
        text: 'Skoleeiere, klinikker og forskningsgrupper krever streng isolasjon mellom leietakere. Snakke planlegges med rollebaserte organisasjoner og databasepolicyer som hindrer kryss-tilgang mellom organisasjoner.',
      },
      {
        title: 'Klinisk og pedagogisk bruk',
        text: 'Terapeuter og laerere kan folge kommunikasjonsokter, ordforradstrender og deltakerfremgang samtidig som brukerstyrte personverngrenser bevares.',
      },
      {
        title: 'Roadmap for etterlevelse',
        text: 'Roadmappen prioriterer GDPR-orientert styring og stotter senere utvidelser for institusjonelle krav tilpasset HIPAA/FERPA der det er relevant.',
      },
    ],
    capabilityTitle: 'Navaerende og planlagte forskningskapabiliteter',
    bullets: [
      'Logging av kommunikasjonsokter med detaljdata pa ikon-niva.',
      'Parkoblingsflyt for veiledet samarbeid mellom deltakere og fagpersoner.',
      'Planlagt samtykkeregister og flyt for tilbaketrekking i studier.',
      'Planlagt revisjonsspor for sensitiv datatilgang og eksport.',
      'Planlagte institusjonsdashbord for organisasjoner og forskningsteam.',
    ],
    ctaTitle: 'Se implementeringsplanen',
    ctaText: 'Se faseplanen for institusjonell arkitektur, etterlevelsesherding og forskningsfunksjoner.',
    ctaPlans: 'Vis plansiden',
    ctaAbout: 'Om Snakke',
    footerTitle: 'Digital Ark AS - Forskningsinformasjon for Snakke',
    footerHome: 'Hjem',
    footerAbout: 'Om',
    footerPlans: 'Planer',
  },
} as const;

export default function ResearchPageContent() {
  const { language } = useLanguage();
  const c = language === 'no' ? CONTENT.no : CONTENT.en;

  return (
    <main id="main-content" className="container mx-auto max-w-4xl px-4 py-12">
      <section className="mb-10">
        <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          {c.badge}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          {c.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          {c.intro}
        </p>
      </section>

      <section className="mb-10 grid gap-6 md:grid-cols-2" aria-label="Research pillars">
        {c.cards.map((card) => (
          <article key={card.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="mb-10 rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{c.capabilityTitle}</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {c.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <h2 className="text-2xl font-bold">{c.ctaTitle}</h2>
        <p className="mt-2 text-sm text-blue-50">{c.ctaText}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/plans" className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">
            {c.ctaPlans}
          </Link>
          <Link href="/about" className="inline-flex items-center rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            {c.ctaAbout}
          </Link>
        </div>
      </section>

      <footer className="mt-12 border-t border-gray-200 px-1 py-8 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>{c.footerTitle}</p>
          <nav aria-label="Research page footer links" className="flex flex-wrap gap-5">
            <Link href="/" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerHome}</Link>
            <Link href="/about" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerAbout}</Link>
            <Link href="/plans" className="hover:text-gray-800 dark:hover:text-gray-200">{c.footerPlans}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
