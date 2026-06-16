'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIconLabels } from '@/hooks/useIconLabels';
import {
  removeIconFromSentence,
  clearSentence,
  setSpeaking,
  saveFavoritePhrase,
  removeFavoritePhrase,
  loadFavoritePhrase,
  reorderSentenceIcons,
} from '@/store/slices/communicationSlice';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { speakText, isSpeechSynthesisSupported } from '@/lib/services/speechService';
import { indexedDB } from '@/lib/offline/indexedDB';
import { useSession } from 'next-auth/react';
import { usePreferences } from '@/hooks/usePreferences';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import type { Icon, CommunicationSession } from '@/types/models';

interface SortableIconCardProps {
  icon: Icon;
  index: number;
  displayName: string;
  onRemove: () => void;
}

function SortableIconCard({ icon, index, displayName, onRemove }: SortableIconCardProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: index, index });

  return (
    <div
      ref={ref}
      className={`
        relative flex flex-col items-center gap-1 p-2 rounded-lg
        bg-gray-100 dark:bg-gray-700
        transition-opacity touch-none select-none
        ${isDragging ? 'opacity-30 z-10' : ''}
      `}
    >
      {/* remove button — outside handleRef so drag never intercepts it */}
      <button
        onClick={onRemove}
        className="absolute top-0.5 right-0.5 z-10 text-gray-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-xs leading-none px-0.5"
        aria-label={`Remove ${displayName}`}
      >
        ✕
      </button>
      {/* drag handle covers image + label only */}
      <div
        ref={handleRef as React.RefCallback<HTMLDivElement>}
        className="flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
      >
        {icon.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon.imageUrl}
            alt={displayName}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : (
          <span className="text-3xl">{icon.symbol}</span>
        )}
        <span className="text-xs text-gray-600 dark:text-gray-300">{displayName}</span>
      </div>
    </div>
  );
}

export default function SentenceBuilder({
  isPrivate = false,
  compact = false,
  onSend,
  sendDisabled = false,
}: {
  isPrivate?: boolean;
  compact?: boolean;
  onSend?: () => void;
  sendDisabled?: boolean;
}) {
  const { t, tIcon, language } = useLanguage();
  const { labels } = useIconLabels(language);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const sentence = useAppSelector((state) => state.communication.sentence);
  const speaking = useAppSelector((state) => state.communication.speaking);
  const favoritePhrases = useAppSelector((state) => state.communication.favoritePhrases);
  const [error, setError] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [savedFlash, triggerSavedFlash] = useFlashMessage();
  const { preferences } = usePreferences();
  const voiceSpeed = preferences.voiceSpeed;
  const voicePitch = preferences.voicePitch;

  const getDisplayName = (icon: Icon) => {
    if (labels[icon.id]) return labels[icon.id];
    const translated = tIcon(icon.id);
    return translated !== icon.id ? translated : icon.name;
  };

  const sentenceText = sentence.map((icon: Icon) => getDisplayName(icon)).join(' ');

  const handleSpeak = async () => {
    if (!isSpeechSynthesisSupported()) {
      setError('Speech not supported in this browser. Try Chrome or Safari.');
      return;
    }

    if (sentence.length === 0) {
      setError('Add some icons first!');
      return;
    }

    setError('');
    dispatch(setSpeaking(true));

    try {
      const langMap: Record<string, string> = { en: 'en-US', no: 'no-NO' };
      await speakText(sentenceText, {
        speed: voiceSpeed,
        pitch: voicePitch,
        volume: 1.0,
        lang: langMap[language] ?? 'en-US',
      });

      // Save session locally first (works offline)
      const localSession: CommunicationSession = {
        id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        userId: session?.user?.id ?? 'local',
        icons: sentence,
        sentence: sentenceText,
        timestamp: new Date(),
        synced: false,
      };
      indexedDB.saveLocalSession(localSession).catch(() => {});

      // Attempt cloud backup (non-critical, best-effort)
      if (session?.user?.id) {
        fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icons: sentence,
            sentence: sentenceText,
            visibility: isPrivate ? 'private' : 'shared',
            taskType: 'free',
          }),
        })
          .then((res) => {
            if (res.ok) {
              indexedDB.markSessionSynced(localSession.id).catch(() => {});
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech failed');
    } finally {
      dispatch(setSpeaking(false));
    }
  };

  const handleClear = () => {
    dispatch(clearSentence());
    setError('');
  };

  const handleSaveFavorite = () => {
    if (sentence.length === 0) return;
    dispatch(saveFavoritePhrase({ icons: sentence, sentence: sentenceText }));
    triggerSavedFlash();
  };

  const handleLoadFavorite = (id: string) => {
    dispatch(loadFavoritePhrase(id));
    setShowFavorites(false);
  };

  const handleRemoveFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeFavoritePhrase(id));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 ${compact ? 'px-3 py-2' : 'p-4'}`}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('sentence.title')}
          </h3>
          {favoritePhrases.length > 0 && (
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              aria-expanded={showFavorites}
            >
              ⭐ Favourites ({favoritePhrases.length})
            </button>
          )}
        </div>
      )}

      {/* Favourites Panel */}
      {showFavorites && favoritePhrases.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-2">
            Tap a favourite to load it:
          </p>
          <div className="flex flex-col gap-2">
            {favoritePhrases.map((phrase) => (
              <div key={phrase.id} className="flex items-center gap-2">
                <button
                  onClick={() => handleLoadFavorite(phrase.id)}
                  className="flex-1 text-left px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors text-sm font-medium text-gray-800 dark:text-gray-200"
                >
                  <span className="mr-2">
                    {phrase.icons.slice(0, 3).map((icon) => icon.symbol || '🖼️').join(' ')}
                  </span>
                  {phrase.sentence}
                </button>
                <button
                  onClick={(e) => handleRemoveFavorite(e, phrase.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg"
                  aria-label="Remove favourite"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Icon Sentence Display */}
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;
          const { source } = event.operation;
          if (isSortable(source)) {
            const { initialIndex, index } = source;
            if (initialIndex !== index) {
              dispatch(reorderSentenceIcons({ fromIndex: initialIndex, toIndex: index }));
            }
          }
        }}
      >
        <div className={`flex items-center gap-2 ${compact ? 'min-h-12 overflow-x-auto pb-1 scrollbar-hide flex-nowrap' : 'mb-4 min-h-20 flex-wrap'}`}>
          {sentence.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm italic">
              {t('sentence.empty')}
            </p>
          ) : (
            sentence.map((icon: Icon, index: number) => (
              <SortableIconCard
                key={`${icon.id}-${index}`}
                icon={icon}
                index={index}
                displayName={getDisplayName(icon)}
                onRemove={() => dispatch(removeIconFromSentence(index))}
              />
            ))
          )}
        </div>
      </DragDropProvider>

      {/* Text Representation — hidden in compact mode */}
      {!compact && sentenceText && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {sentenceText}
          </p>
        </div>
      )}

      {/* Error / Saved flash — hidden in compact mode */}
      {!compact && error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Saved Flash */}
      {!compact && savedFlash && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">⭐ Saved as favourite!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`flex gap-2 ${compact ? 'mt-2' : ''}`}>
        <button
          onClick={handleSpeak}
          disabled={sentence.length === 0 || speaking}
          className={`
            flex-1 flex items-center justify-center gap-2
            rounded-lg bg-primary text-white
            hover:bg-primary-hover
            disabled:bg-gray-300 dark:disabled:bg-gray-700
            disabled:cursor-not-allowed transition-colors font-medium
            ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'}
          `}
        >
          <span className={compact ? 'text-base' : 'text-xl'}>{speaking ? '⏸️' : '🔊'}</span>
          {speaking ? t('sentence.speaking') : t('sentence.speak')}
        </button>

        {onSend && (
          <button
            onClick={onSend}
            disabled={sendDisabled || sentence.length === 0}
            className={`
              flex items-center justify-center gap-1.5
              rounded-lg bg-green-500 text-white
              hover:bg-green-600
              disabled:bg-gray-300 dark:disabled:bg-gray-700
              disabled:cursor-not-allowed transition-colors font-medium
              ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'}
            `}
          >
            <span>📤</span>
            {!compact && 'Send'}
          </button>
        )}

        {!compact && (
          <button
            onClick={handleSaveFavorite}
            disabled={sentence.length === 0}
            title="Save as favourite"
            className="
              px-4 py-3 rounded-lg
              bg-yellow-400 hover:bg-yellow-500
              text-white
              disabled:bg-gray-300 dark:disabled:bg-gray-700
              disabled:cursor-not-allowed transition-colors font-medium text-xl
            "
            aria-label="Save sentence as favourite"
          >
            ⭐
          </button>
        )}

        <button
          onClick={handleClear}
          disabled={sentence.length === 0}
          className={`
            rounded-lg bg-red-500 text-white
            hover:bg-red-600
            disabled:bg-gray-300 dark:disabled:bg-gray-700
            disabled:cursor-not-allowed transition-colors font-medium
            ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'}
          `}
        >
          {compact ? '✕' : t('sentence.clear')}
        </button>
      </div>
    </div>
  );
}
