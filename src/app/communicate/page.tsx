'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIconLabels } from '@/hooks/useIconLabels';
import { getIconsByCategory, searchIcons } from '@/lib/data/icons';
import { setCustomIcons, addIconToSentence, clearSentence } from '@/store/slices/communicationSlice';
import CategorySelector from '@/components/features/CategorySelector';
import IconGrid from '@/components/features/IconGrid';
import SentenceBuilder from '@/components/features/SentenceBuilder';
import TextToIcons from '@/components/features/TextToIcons';
import SpeechToIcons from '@/components/features/SpeechToIcons';
import CommunicateThread, { type ThreadMessage } from '@/components/features/communication/CommunicateThread';
import type { Icon } from '@/types/models';

type CommunicationMode = 'icons' | 'text' | 'speech';

export default function CommunicatePage() {
  const { t, language } = useLanguage();
  const { labels } = useIconLabels(language);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<CommunicationMode>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasPairedUsers, setHasPairedUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [threadCollapsed, setThreadCollapsed] = useState(true);

  const selectedCategory = useAppSelector((state) => state.communication.selectedCategory);
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const recentIcons = useAppSelector((state) => state.communication.recentIcons);
  const sentence = useAppSelector((state) => state.communication.sentence) as Icon[];

  useEffect(() => {
    // Only fetch custom icons for authenticated users
    if (!session?.user?.id) return;
    fetch('/api/icons')
      .then(res => res.ok ? res.json() : { icons: [] })
      .then(data => {
        if (data.icons) {
          dispatch(setCustomIcons(data.icons));
        }
      })
      .catch(err => console.error('Failed to load custom icons:', err));
  }, [dispatch, session?.user?.id]);

  const defaultIcons = getIconsByCategory(selectedCategory as any);
  const filteredCustomIcons = customIcons.filter(icon => icon.category === selectedCategory);
  const categoryIcons = [...defaultIcons, ...filteredCustomIcons];

  // Search: built-in matches + custom icon matches, deduped by id
  const trimmedQuery = searchQuery.trim();
  const searchResults = trimmedQuery
    ? [
        ...searchIcons(trimmedQuery),
        ...customIcons.filter(i => i.name.toLowerCase().includes(trimmedQuery.toLowerCase())),
      ].filter((icon, idx, arr) => arr.findIndex(x => x.id === icon.id) === idx)
    : [];

  const iconsToShow = trimmedQuery ? searchResults : categoryIcons;

  const getLabel = useCallback((icon: Icon) => labels[icon.id] || icon.name, [labels]);

  const handleSendToThread = useCallback(async () => {
    if (sentence.length === 0 || !session?.user?.id) return;
    const thread = (window as unknown as Record<string, { addMessage: (m: ThreadMessage) => void; getActiveRoom: () => { userId: string; name: string } | null }>).__snakkeThread;
    const activeRoom = thread?.getActiveRoom();
    if (!activeRoom) return;
    const sentenceText = sentence.map(getLabel).join(' ');
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: activeRoom.userId,
          content: { type: 'icons', icons: sentence.map((ic) => ({ id: ic.id, name: ic.name, imageUrl: ic.imageUrl, symbol: ic.symbol })), sentence: sentenceText },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        thread.addMessage({ ...data.message, senderName: null });
        dispatch(clearSentence());
      }
    } finally { setSending(false); }
  }, [sentence, session?.user?.id, getLabel, dispatch]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* ── Thread panel — collapsible ── */}
      {session?.user?.id && hasPairedUsers && (
        <div className={threadCollapsed ? 'shrink-0' : 'flex-1 min-h-0 flex flex-col border-b-2 border-gray-200 dark:border-gray-700'}>
          <CommunicateThread
            currentUserId={session.user.id}
            iconLabels={labels}
            collapsed={threadCollapsed}
            onToggleCollapse={() => setThreadCollapsed((p) => !p)}
            onRoomLoaded={(rooms) => setHasPairedUsers(rooms.length > 0)}
            onNewMessage={() => { /* badge already shown inside CommunicateThread */ }}
          />
        </div>
      )}

      {/* Invisible room loader when not yet known */}
      {session?.user?.id && !hasPairedUsers && (
        <div className="hidden">
          <CommunicateThread
            currentUserId={session.user.id}
            iconLabels={labels}
            onRoomLoaded={(rooms) => setHasPairedUsers(rooms.length > 0)}
          />
        </div>
      )}

      {/* ── SentenceBuilder — compact, with Send ── */}
      <div className="shrink-0">
        <SentenceBuilder
          isPrivate={isPrivate}
          compact={true}
          onSend={hasPairedUsers && session?.user?.id ? handleSendToThread : undefined}
          sendDisabled={sentence.length === 0 || sending}
        />
      </div>

      {/* ── Mode tabs — slim, with inline search toggle ── */}
      <div className="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-0.5 px-2">
          {/* Mode buttons */}
          {([
            { id: 'icons', emoji: '🎯', label: t('communicate.tab.icons') },
            { id: 'text',  emoji: '⌨️', label: t('communicate.tab.type') },
            { id: 'speech', emoji: '🎤', label: t('communicate.tab.speech') },
          ] as const).map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                mode === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span>{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}

          <div className="flex-1" />

          {/* Search toggle (icons mode only) */}
          {mode === 'icons' && (
            <button
              onClick={() => { setSearchOpen((p) => !p); if (searchOpen) setSearchQuery(''); }}
              className={`p-2 rounded-lg text-sm transition-colors ${searchOpen ? 'text-primary bg-primary/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Toggle search"
            >
              🔍
            </button>
          )}

          {/* Privacy toggle */}
          {session && (
            <button
              onClick={() => setIsPrivate((p) => !p)}
              title={isPrivate ? 'Private' : 'Shared'}
              className={`p-2 rounded-lg text-sm transition-colors ${isPrivate ? 'text-gray-400' : 'text-green-600'}`}
            >
              {isPrivate ? '🔒' : '🔓'}
            </button>
          )}
        </div>

        {/* Inline search bar — expands below tabs */}
        {mode === 'icons' && searchOpen && (
          <div className="px-3 pb-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">🔍</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('communicate.searchPlaceholder')}
                autoFocus
                className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-100 dark:placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Icon board — dominant, takes all remaining space ── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {mode === 'icons' && (
          <div>
            {/* Recently used — hidden during search */}
            {!trimmedQuery && recentIcons.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                  {t('communicate.recent')}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {recentIcons.slice(0, 8).map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => dispatch(addIconToSentence(icon))}
                      className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 transition-all w-16"
                      title={labels[icon.id] || icon.name}
                    >
                      {icon.imageUrl ? (
                        <Image src={icon.imageUrl} alt={labels[icon.id] || icon.name} width={40} height={40} className="object-contain" />
                      ) : (
                        <span className="text-2xl leading-none">{icon.symbol}</span>
                      )}
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate w-full text-center">
                        {labels[icon.id] || icon.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category tabs — hidden during search */}
            {!trimmedQuery && <CategorySelector />}

            {/* Icon grid */}
            {trimmedQuery && iconsToShow.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400 text-sm">
                {t('communicate.searchEmpty')} &ldquo;{trimmedQuery}&rdquo;
              </div>
            ) : (
              <IconGrid icons={iconsToShow} />
            )}
          </div>
        )}

        {mode === 'text' && <TextToIcons />}
        {mode === 'speech' && <SpeechToIcons />}
      </div>
    </div>
  );
}
