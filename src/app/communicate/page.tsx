'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIconLabels } from '@/hooks/useIconLabels';
import { getIconsByCategory, searchIcons, CATEGORIES } from '@/lib/data/icons';
import { setCustomIcons, addIconToSentence, clearSentence } from '@/store/slices/communicationSlice';
import CategorySelector from '@/components/features/CategorySelector';
import IconGrid from '@/components/features/IconGrid';
import SentenceBuilder from '@/components/features/SentenceBuilder';
import TextToIcons from '@/components/features/TextToIcons';
import SpeechToIcons from '@/components/features/SpeechToIcons';
import CommunicateThread, { type ThreadMessage } from '@/components/features/communication/CommunicateThread';
import type { Icon, IconCategory } from '@/types/models';

type CommunicationMode = 'icons' | 'text' | 'speech';

const iconCategoryIds = new Set<IconCategory>(CATEGORIES.map((category) => category.id));

function isIconCategory(value: string): value is IconCategory {
  return iconCategoryIds.has(value as IconCategory);
}

export default function CommunicatePage() {
  const { t, language } = useLanguage();
  const { labels } = useIconLabels(language);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<CommunicationMode>('icons');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [hasPairedUsers, setHasPairedUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const [threadCollapsed, setThreadCollapsed] = useState(true);
  const isAltView = searchParams.get('view') === 'alt';

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

  const resolvedCategory: IconCategory = isIconCategory(selectedCategory) ? selectedCategory : 'needs';
  const defaultIcons = getIconsByCategory(resolvedCategory);
  const filteredCustomIcons = customIcons.filter(icon => icon.category === resolvedCategory);
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

  const setAltView = useCallback((enabled: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (enabled) {
      params.set('view', 'alt');
    } else {
      params.delete('view');
    }
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }, [pathname, router, searchParams]);

  return (
    <div className={`relative h-screen flex flex-col overflow-hidden ${
      isAltView
        ? 'bg-linear-to-br from-orange-50 via-rose-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950'
        : 'bg-gray-50 dark:bg-gray-900'
    }`}>

      {isAltView && (
        <>
          <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-rose-300/25 blur-3xl dark:bg-rose-700/20" />
          <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-700/20" />
          <div className="pointer-events-none absolute -bottom-27.5 left-1/3 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-700/15" />
        </>
      )}

      <div className={`relative z-10 flex h-full flex-col ${isAltView ? 'mx-auto w-full max-w-350 gap-2 px-2 py-2 sm:px-4 sm:py-3' : ''}`}>

      {/* ── Thread panel — collapsible, always mounts when signed in ── */}
      {session?.user?.id && (
        <div className={hasPairedUsers ? (threadCollapsed ? 'shrink-0' : `flex-1 min-h-0 flex flex-col border-b-2 ${isAltView ? 'rounded-2xl border-amber-200/90 bg-white/75 shadow-lg shadow-rose-100/50 dark:border-amber-700/60 dark:bg-gray-900/80 dark:shadow-none' : 'border-gray-200 dark:border-gray-700'}`) : 'hidden'}>
          <CommunicateThread
            currentUserId={session.user.id}
            iconLabels={labels}
            collapsed={threadCollapsed}
            onToggleCollapse={() => setThreadCollapsed((p) => !p)}
            onRoomLoaded={(rooms) => setHasPairedUsers(rooms.length > 0)}
          />
        </div>
      )}

      {/* ── SentenceBuilder — compact, with Send ── */}
      <div className={`shrink-0 ${isAltView ? 'rounded-2xl border border-rose-200/80 bg-white/80 px-1 py-1 shadow-lg shadow-rose-100/40 dark:border-rose-800/60 dark:bg-gray-900/80 dark:shadow-none' : ''}`}>
        <SentenceBuilder
          isPrivate={isPrivate}
          compact={true}
          onSend={hasPairedUsers && session?.user?.id ? handleSendToThread : undefined}
          sendDisabled={sentence.length === 0 || sending}
        />
      </div>

      {/* ── Mode tabs — slim, with inline search toggle ── */}
      <div className={`shrink-0 border-b ${
        isAltView
          ? 'rounded-2xl border-amber-200/90 bg-white/85 dark:border-amber-700/60 dark:bg-gray-800/90 backdrop-blur-sm'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <div className={`flex items-center gap-0.5 px-2 ${isAltView ? 'py-1.5' : ''}`}>
          {isAltView && (
            <div className="mr-2 hidden items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-rose-700 dark:border-rose-700/70 dark:bg-rose-900/25 dark:text-rose-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Play Mode
            </div>
          )}
          {/* Mode buttons */}
          {([
            { id: 'icons', emoji: '🎯', label: t('communicate.tab.icons') },
            { id: 'text',  emoji: '⌨️', label: t('communicate.tab.type') },
            { id: 'speech', emoji: '🎤', label: t('communicate.tab.speech') },
          ] as const).map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 rounded-t-md transition-colors ${
                mode === id
                  ? (isAltView ? 'border-rose-500 text-rose-600 bg-rose-50/70 dark:bg-rose-900/20 dark:text-rose-300' : 'border-primary text-primary')
                  : (isAltView ? 'border-transparent text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-300' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200')
              }`}
              style={isAltView ? { fontFamily: "'Trebuchet MS', 'Avenir Next', 'Segoe UI', sans-serif" } : undefined}
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
              className={`p-2 rounded-lg text-sm transition-colors ${
                searchOpen
                  ? (isAltView ? 'text-rose-600 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/30' : 'text-primary bg-primary/10')
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
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

          <button
            onClick={() => setAltView(!isAltView)}
            className={`ml-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
              isAltView
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Local visual test mode"
          >
            {isAltView ? 'Alt View On' : 'Alt View Off'}
          </button>
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
      <div className={`flex-1 overflow-y-auto min-h-0 ${isAltView ? 'rounded-2xl border border-cyan-200/80 bg-white/70 shadow-xl shadow-cyan-100/40 dark:border-cyan-800/60 dark:bg-gray-900/75 dark:shadow-none' : ''}`}>
        {mode === 'icons' && (
          <div>
            {/* Recently used — hidden during search */}
            {!trimmedQuery && recentIcons.length > 0 && (
              <div className={`border-b px-4 py-2 ${
                isAltView
                  ? 'bg-white/80 dark:bg-gray-800/80 border-amber-200/80 dark:border-amber-700/50'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <p className={`text-xs font-medium mb-2 uppercase tracking-wide ${
                  isAltView ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {t('communicate.recent')}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {recentIcons.slice(0, 8).map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => dispatch(addIconToSentence(icon))}
                      className={`shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl active:scale-95 transition-all w-16 ${
                        isAltView
                          ? 'bg-linear-to-b from-amber-100 to-rose-100 dark:from-gray-700 dark:to-gray-700 hover:from-rose-200 hover:to-amber-200 dark:hover:from-gray-600 dark:hover:to-gray-600 border border-amber-200/80 dark:border-gray-600'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20'
                      }`}
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
              <div className={`flex items-center justify-center h-48 text-sm ${
                isAltView ? 'text-rose-600 dark:text-rose-300' : 'text-gray-500 dark:text-gray-400'
              }`}>
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
    </div>
  );
}
