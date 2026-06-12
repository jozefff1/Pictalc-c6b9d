import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import PlansPageContent from '@/components/features/PlansPageContent';

export const metadata: Metadata = {
  title: 'Plans and Roadmap',
  description:
    'Snakke roadmap page with current implementation status, upcoming priorities, and institutional research direction.',
};

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <PlansPageContent />
    </div>
  );
}
