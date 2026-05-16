'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { indexedDB } from '@/lib/offline/indexedDB';
import { setFavoritePhrases } from '@/store/slices/communicationSlice';
import type { Icon } from '@/types/models';

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

// Handles IDB rehydration on mount and persists favourites on change
function StoreSync() {
  useEffect(() => {
    // Rehydrate favourite phrases from IndexedDB
    indexedDB
      .getFavoritePhrases()
      .then((phrases) => {
        if (phrases.length > 0) {
          store.dispatch(
            setFavoritePhrases(
              phrases as Array<{ id: string; icons: Icon[]; sentence: string }>
            )
          );
        }
      })
      .catch(() => {});

    // Subscribe: persist favourites to IDB whenever they change
    let prev = store.getState().communication.favoritePhrases;
    const unsubscribe = store.subscribe(() => {
      const current = store.getState().communication.favoritePhrases;
      if (current !== prev) {
        prev = current;
        indexedDB.saveFavoritePhrases(current).catch(() => {});
      }
    });

    return unsubscribe;
  }, []);

  return null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <StoreSync />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </Provider>
    </SessionProvider>
  );
}
