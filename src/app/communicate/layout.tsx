import { auth } from '@/lib/auth/config';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';

export default async function CommunicateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      {/* Guest banner */}
      {!session && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800 px-4 py-2.5">
          <div className="container mx-auto flex items-center justify-between gap-4 text-sm">
            <p className="text-blue-700 dark:text-blue-300">
              👤 <strong>Guest mode</strong> — sentences are not saved.{' '}
              <span className="hidden sm:inline">Sign up to save history and sync across devices.</span>
            </p>
            <Link
              href="/register"
              className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Sign up free
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 page-enter">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-4 py-6 dark:bg-black">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Snakke by Digital Ark AS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
