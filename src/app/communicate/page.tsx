'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasPairedUsers, setHasPairedUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');

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

  const handleSendText = useCallback(async () => {
    const text = replyText.trim();
    if (!text || !session?.user?.id) return;
    const thread = (window as unknown as Record<string, { addMessage: (m: ThreadMessage) => void; getActiveRoom: () => { userId: string; name: string } | null }>).__snakkeThread;
    const activeRoom = thread?.getActiveRoom();
    if (!activeRoom) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: activeRoom.userId, content: { type: 'text', text } }),
      });
      if (res.ok) {
        const data = await res.json();
        thread.addMessage({ ...data.message, senderName: null });
        setReplyText('');
      }
    } finally { setSending(false); }
  }, [replyText, session?.user?.id]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* ── Thread panel (visible when signed in + has paired users) ── */}
      {session?.user?.id && (
        <div
          className="flex flex-col bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700"
          style={{ flex: hasPairedUsers ? '1 1 0%' : '0 0 auto', minHeight: hasPairedUsers ? '200px' : 0 }}
        >
          <CommunicateThread
            currentUserId={session.user.id}
            iconLabels={labels}
            onRoomLoaded={(rooms) => setHasPairedUsers(rooms.length > 0)}
          />
        </div>
      )}

      {/* ── Compose: sentence builder + send bar + mode tabs ── */}
      <div className="flex flex-col shrink-0 bg-white dark:bg-gray-800">
        {/* Sentence Builder */}
        <SentenceBuilder isPrivate={isPrivate} />

        {/* Send bar — only when signed in and paired */}
        {session?.user?.id && hasPairedUsers && (
          <div className="flex items-center gap-2 px-4 pb-3 pt-1 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleSendToThread}
              disabled={sentence.length === 0 || sending}
              className="flex items-center gap-2 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 shrink-0"
            >
              <span>📤</span>{sending ? 'Sending…' : 'Send'}
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 overflow-hidden">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
                placeholder="Type a reply…"
                className="flex-1 py-2.5 text-sm bg-transparent focus:outline-none"
              />
              <button
                onClick={handleSendText}
                disabled={!replyText.trim() || sending}
                className="shrink-0 text-primary hover:opacity-70 disabled:opacity-30 text-lg leading-none"
              >↑</button>
            </div>
          </div>
        )}

        {/* Mode Tabs + Privacy Toggle */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <div className="flex gap-1 flex-1">
            <button
              onClick={() => setMode('icons')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'icons'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">🎯</span>
              {t('communicate.tab.icons')}
            </button>
            <button
              onClick={() => setMode('text')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'text'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">⌨️</span>
              {t('communicate.tab.type')}
            </button>
            <button
              onClick={() => setMode('speech')}
              className={`
                flex-1 py-3 px-4 font-medium text-sm
                border-b-2 transition-colors
                ${
                  mode === 'speech'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">🎤</span>
              {t('communicate.tab.speech')}
            </button>
          </div>
          {session && (
            <>
              <Link
                href="/dashboard/phrases"
                className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
                title="My phrases collection"
              >
                <span>📋</span>
                <span>{t('communicate.phrases')}</span>
              </Link>
              <button
                onClick={() => setIsPrivate((p) => !p)}
                title={isPrivate ? 'Private session — not shared with supervisors' : 'Shared session — visible to supervisors'}
                className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isPrivate
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}
              >
                {isPrivate ? '🔒' : '🔓'}
                <span className="hidden sm:inline">{isPrivate ? 'Private' : 'Shared'}</span>
              </button>
            </>
          )}
        </div>
      </div>
      </div>

      {/* -- Icon board (scrollable) -- */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {mode === 'icons' && (
          <div>
            {/* Search bar */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="relative max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('communicate.searchPlaceholder')}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

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
                        <Image
                          src={icon.imageUrl}
                          alt={labels[icon.id] || icon.name}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
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

            {/* Icon grid — search results or category icons */}
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
