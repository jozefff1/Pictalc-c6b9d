import { auth, signOut } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

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
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Pictalk
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {session.user?.name}
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-500 dark:text-gray-500 capitalize">
                {session.user?.role}
              </span>
            </div>
            
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Optional Footer for App Pages */}
      <footer className="border-t border-border bg-white px-4 py-6 dark:bg-black">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Pictalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
