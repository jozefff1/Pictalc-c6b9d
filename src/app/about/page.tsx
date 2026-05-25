import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AboutContent from '@/components/features/AboutContent';

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

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header />
      <AboutContent />
    </div>
  );
}
