import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import SignOutButton from '@/components/layout/SignOutButton';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white px-4 py-4 dark:bg-black sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left: logo + dark mode toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              Snakke
            </Link>
            <DarkModeToggle />
          </div>

          {/* Right: nav + language + profile + sign out */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/communicate"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Communicate"
              >
                💬
              </Link>
              <Link
                href="/learn"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Learn
              </Link>
            </div>

            <LanguageSwitcher />

            {/* Profile — icon on mobile, name on sm+ */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Profile"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="hidden sm:inline">{session.user?.name}</span>
            </Link>

            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 page-enter">{children}</main>

      {/* Optional Footer for App Pages */}
      <footer className="border-t border-border bg-white px-4 py-6 dark:bg-black">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Snakke by Digital Ark AS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
