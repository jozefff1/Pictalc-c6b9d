import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AboutContent from '@/components/features/AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Snakke is a free, open-source AAC (Augmentative and Alternative Communication) app for non-verbal and minimally verbal individuals — including children with autism, cerebral palsy, apraxia, and Down syndrome. Used by speech-language therapists, special educators, parents, and researchers. Built by Digital Ark AS (Norway).',
  keywords: [
    'AAC app',
    'augmentative and alternative communication',
    'non-verbal communication',
    'autism communication tool',
    'speech therapy app',
    'pictogram board',
    'ARASAAC',
    'cerebral palsy communication',
    'apraxia app',
    'assistive technology Norway',
    'gratis AAC app',
    'taleterapi',
    'kommunikasjonsapp',
    'Digital Ark AS',
  ],
  openGraph: {
    title: 'About Snakke — Free AAC Communication App',
    description:
      'Snakke helps non-verbal individuals express themselves through pictograms and text-to-speech. Free, offline-capable, privacy-first. Used by therapists, teachers, parents, and researchers in Norway and beyond.',
    locale: 'nb_NO',
    alternateLocale: ['en_US'],
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />
      <AboutContent />
    </div>
  );
}
