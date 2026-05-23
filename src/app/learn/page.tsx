import type { Metadata } from 'next';
import LearnPage from '@/components/features/learning/LearnPage';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Practise vocabulary across languages with icon-based flashcards.',
};

export default function Learn() {
  return <LearnPage />;
}
