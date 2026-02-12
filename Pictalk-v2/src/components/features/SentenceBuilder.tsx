'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { removeIconFromSentence, clearSentence, setSpeaking } from '@/store/slices/communicationSlice';
import { speakText, isSpeechSynthesisSupported } from '@/lib/services/speechService';
import type { Icon } from '@/types/models';

export default function SentenceBuilder() {
  const { t, tIcon } = useLanguage();
  const dispatch = useAppDispatch();
  const sentence = useAppSelector((state) => state.communication.sentence);
  const speaking = useAppSelector((state) => state.communication.speaking);
  const [error, setError] = useState<string>('');

  // Debug logging
  useEffect(() => {
    console.log('📝 SentenceBuilder - Sentence updated:', sentence.length, 'icons', sentence);
  }, [sentence]);

  const sentenceText = sentence.map((icon: Icon) => tIcon(icon.id)).join(' ');

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
      // Speak the sentence
      await speakText(sentenceText, {
        speed: 0.9,
        pitch: 1.0,
        volume: 1.0,
      });

      // Save session to database
      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            icons: sentence,
            sentence: sentenceText,
          }),
        });
      } catch (saveError) {
        console.error('Failed to save session:', saveError);
        // Don't show error to user - session logging is non-critical
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

  return (
    <div className="bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700 p-4">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('sentence.title')}
        </h3>
      </div>
      
      {/* Icon Sentence Display */}
      <div className="flex items-center gap-2 mb-4 min-h-[80px] flex-wrap">
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
              <span className="text-3xl">{icon.symbol}</span>
              <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                {tIcon(icon.id)}
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
          {speaking ? 'Speaking...' : 'Speak'}
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
          Clear
        </button>
      </div>
    </div>
  );
}
