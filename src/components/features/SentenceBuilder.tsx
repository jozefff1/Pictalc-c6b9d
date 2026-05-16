'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  removeIconFromSentence,
  clearSentence,
  setSpeaking,
  saveFavoritePhrase,
  removeFavoritePhrase,
  loadFavoritePhrase,
} from '@/store/slices/communicationSlice';
import { speakText, isSpeechSynthesisSupported } from '@/lib/services/speechService';
import { indexedDB } from '@/lib/offline/indexedDB';
import { useSession } from 'next-auth/react';
import type { Icon, CommunicationSession } from '@/types/models';

export default function SentenceBuilder() {
  const { t, tIcon, language } = useLanguage();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const sentence = useAppSelector((state) => state.communication.sentence);
  const speaking = useAppSelector((state) => state.communication.speaking);
  const favoritePhrases = useAppSelector((state) => state.communication.favoritePhrases);
  const [error, setError] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          setVoiceSpeed(data.preferences.voiceSpeed ?? 1.0);
          setVoicePitch(data.preferences.voicePitch ?? 1.0);
        }
      })
      .catch(() => {});
  }, []);

  const sentenceText = sentence.map((icon: Icon) =>
    icon.id.startsWith('custom_') ? icon.name : tIcon(icon.id)
  ).join(' ');

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
      const langMap: Record<string, string> = { en: 'en-US', no: 'nb-NO' };
      await speakText(sentenceText, {
        speed: voiceSpeed,
        pitch: voicePitch,
        volume: 1.0,
        lang: langMap[language] ?? 'en-US',
      });

      // Save session locally first (works offline)
      const localSession: CommunicationSession = {
        id: crypto.randomUUID(),
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
          body: JSON.stringify({ icons: sentence, sentence: sentenceText }),
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
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
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
    <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 p-4">
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
      <div className="flex items-center gap-2 mb-4 min-h-20 flex-wrap">
        {sentence.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm italic">
            {t('sentence.empty')}
          </p>
        ) : (
          sentence.map((icon: Icon, index: number) => (
            <button
              key={`${icon.id}-${index}`}
              onClick={() => dispatch(removeIconFromSentence(index))}
              className="
                flex flex-col items-center gap-1 p-2 rounded-lg
                bg-gray-100 dark:bg-gray-700
                hover:bg-red-100 dark:hover:bg-red-900
                transition-colors
                group
              "
              aria-label={`Remove ${tIcon(icon.id)}`}
            >
              {icon.imageUrl ? (
                <img
                  src={icon.imageUrl}
                  alt={icon.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-3xl">{icon.symbol}</span>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                {icon.id.startsWith('custom_') ? icon.name : tIcon(icon.id)}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Text Representation */}
      {sentenceText && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {sentenceText}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Saved Flash */}
      {savedFlash && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">⭐ Saved as favourite!</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSpeak}
          disabled={sentence.length === 0 || speaking}
          className="
            flex-1 flex items-center justify-center gap-2
            px-4 py-3 rounded-lg
            bg-primary text-white
            hover:bg-primary-hover
            disabled:bg-gray-300 dark:disabled:bg-gray-700
            disabled:cursor-not-allowed
            transition-colors
            font-medium
          "
        >
          <span className="text-xl">{speaking ? '⏸️' : '🔊'}</span>
          {speaking ? t('sentence.speaking') : t('sentence.speak')}
        </button>

        <button
          onClick={handleSaveFavorite}
          disabled={sentence.length === 0}
          title="Save as favourite"
          className="
            px-4 py-3 rounded-lg
            bg-yellow-400 hover:bg-yellow-500
            text-white
            disabled:bg-gray-300 dark:disabled:bg-gray-700
            disabled:cursor-not-allowed
            transition-colors
            font-medium text-xl
          "
          aria-label="Save sentence as favourite"
        >
          ⭐
        </button>

        <button
          onClick={handleClear}
          disabled={sentence.length === 0}
          className="
            px-4 py-3 rounded-lg
            bg-red-500 text-white
            hover:bg-red-600
            disabled:bg-gray-300 dark:disabled:bg-gray-700
            disabled:cursor-not-allowed
            transition-colors
            font-medium
          "
        >
          {t('sentence.clear')}
        </button>
      </div>
    </div>
  );
}
