import { auth, signOut } from '@/lib/auth/config';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import DarkModeToggle from '@/components/common/DarkModeToggle';

async function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/login' });
      }}
    >
      <button
        type="submit"
        className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}

export default async function CommunicateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white px-4 py-4 dark:bg-black sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href={session ? '/dashboard' : '/'}
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Snakke
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <DarkModeToggle />

            {session ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <Link
                    href="/dashboard/profile"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    {session.user?.name}
                  </Link>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-gray-500 dark:text-gray-500 capitalize">
                    {session.user?.role}
                  </span>
                </div>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

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
          <p>© {new Date().getFullYear()} Snakke by Digital Ark AS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
