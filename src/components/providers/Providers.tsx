'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { LanguageProvider } from '@/contexts/LanguageContext';

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </Provider>
    </SessionProvider>
  );
}
