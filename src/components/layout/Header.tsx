'use client';

import Link from 'next/link';
import DarkModeToggle from '@/components/common/DarkModeToggle';

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  return (
    <header className="border-b border-border bg-white px-4 py-4 dark:bg-black">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Pictalk
        </Link>
        
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          {showAuth && (
            <nav className="flex gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
