import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import AppHeader from '@/components/layout/AppHeader';

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
      <AppHeader />
      <main className="flex-1 page-enter">{children}</main>
      <footer className="border-t border-border bg-white px-4 py-6 dark:bg-black">
        <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Snakke by Digital Ark AS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
