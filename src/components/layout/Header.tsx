'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import DarkModeToggle from '@/components/common/DarkModeToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

interface HeaderProps {
  showAuth?: boolean;
}

export default function Header({ showAuth = true }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border bg-white px-4 py-4 dark:bg-black">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: logo + dark mode toggle */}
        <div className="flex items-center gap-3">
          <Link
            href={session ? '/dashboard' : '/'}
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Snakke
          </Link>
          <DarkModeToggle />
        </div>

        <div className="flex items-center gap-2">
          {showAuth && (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                href="/communicate"
                title="Communication board"
                aria-label="Open communication board"
                className="rounded-lg p-2 text-xl leading-none hover:bg-muted transition-colors"
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
          )}

          <LanguageSwitcher />

          {showAuth && (
            session ? (
              <>
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
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
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
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
