import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import ResearchPageContent from '@/components/features/ResearchPageContent';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Research information for Snakke: consent-first data model, institutional collaboration, analytics roadmap, and compliance framework for AAC studies.',
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <ResearchPageContent />
    </div>
  );
}
