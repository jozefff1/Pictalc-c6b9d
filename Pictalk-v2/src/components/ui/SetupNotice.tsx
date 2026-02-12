'use client';

import { useState } from 'react';

export function SetupNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
            Database Setup Required
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
            To test registration and login, you need to set up a database:
          </p>
          <ol className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1 list-decimal list-inside">
            <li>Create a free account at <a href="https://neon.tech" target="_blank" rel="noopener noreferrer" className="underline">neon.tech</a></li>
            <li>Create a new database</li>
            <li>Copy your connection string</li>
            <li>Update <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">DATABASE_URL</code> in .env.local</li>
            <li>Run: <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">npx drizzle-kit push</code></li>
          </ol>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
