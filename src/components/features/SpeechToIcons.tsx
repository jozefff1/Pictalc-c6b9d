'use client';

import { useState, useEffect } from 'react';
import { SpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/services/speechService';
import { matchTextToIcons } from '@/lib/ai/iconMatcher';
import { useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';
import type { IconMatch } from '@/lib/ai/iconMatcher';

export default function SpeechToIcons() {
  const { tIcon } = useLanguage();
  const dispatch = useAppDispatch();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [matches, setMatches] = useState<IconMatch[]>([]);
  const [error, setError] = useState<string>('');
  const [recognizer, setRecognizer] = useState<SpeechRecognizer | null>(null);

  useEffect(() => {
    if (isSpeechRecognitionSupported()) {
      try {
        const rec = new SpeechRecognizer({
          lang: 'en-US',
          continuous: false,
          interimResults: true,
        });
        setRecognizer(rec);
      } catch {
        setError('Speech recognition not available');
      }
    } else {
      setError('Speech recognition not available');
    }

    // Cleanup function
    return () => {
      if (recognizer) {
        recognizer.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartListening = () => {
    if (!recognizer) {
      setError('Speech recognition not available');
      return;
    }

    setError('');
    setTranscript('');
    setInterimTranscript('');
    setMatches([]);

    recognizer.start(
      (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          
          // Auto-convert to icons
          const words = text.toLowerCase().trim().split(/\s+/);
          words.forEach((word) => {
            const results = matchTextToIcons(word, 1, 'en');
            if (results.length > 0 && results[0].confidence >= 0.7) {
              dispatch(addIconToSentence(results[0].icon));
            }
          });
          
          // Show additional suggestions for unmatched words
          const allMatches = matchTextToIcons(text, 12, 'en');
          const suggestions = allMatches.filter(match => match.confidence < 0.7 || match.matchType !== 'exact');
          setMatches(suggestions.slice(0, 6));
        } else {
          setInterimTranscript(text);
        }
      },
      (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setIsListening(true);
  };

  const handleStopListening = () => {
    recognizer?.stop();
    setIsListening(false);
  };

  const handleAddIcon = (match: IconMatch) => {
    dispatch(addIconToSentence(match.icon));
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        {/* Microphone Button */}
        <div className="flex flex-col items-center mb-6">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={!isSpeechRecognitionSupported()}
            className={`
              w-32 h-32 rounded-full
              flex items-center justify-center
              text-6xl
              transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-offset-2
              ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-xl scale-110 focus:ring-red-300'
                  : 'bg-primary text-white hover:bg-primary-hover hover:scale-105 shadow-lg focus:ring-primary'
              }
              disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
            `}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? '⏸️' : '🎤'}
          </button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isListening ? 'Tap to stop' : 'Tap to speak'}
          </p>
        </div>

        {/* Live Transcript */}
        {(transcript || interimTranscript) && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
              {transcript ? 'Converted:' : 'Listening...'}
            </p>
            <p className="text-lg text-gray-900 dark:text-gray-100">
              {transcript || <span className="text-gray-400 italic">{interimTranscript}</span>}
            </p>
            {transcript && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ Speech converted to icons! Check above.
              </p>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Matched Icons */}
        {matches.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              More suggestions (tap to add)
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {matches.map((match) => (
                <button
                  key={match.icon.id}
                  onClick={() => handleAddIcon(match)}
                  className="
                    flex flex-col items-center justify-center
                    p-3 rounded-xl
                    bg-white dark:bg-gray-800
                    border-2 border-gray-200 dark:border-gray-700
                    hover:border-primary hover:shadow-lg
                    active:scale-95
                    transition-all duration-200
                    relative
                  "
                  style={{ borderColor: `${match.icon.color}40` }}
                  aria-label={`Add ${tIcon(match.icon.id)} to sentence`}
                >
                  {match.matchType === 'exact' && (
                    <span className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full px-1.5 py-0.5">
                      ✓
                    </span>
                  )}
                  
                  <span className="text-3xl mb-1">{match.icon.symbol}</span>
                  <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                    {tIcon(match.icon.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!isListening && matches.length === 0 && !error && !transcript && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">🎙️ Speak to convert to icons</p>
            <p className="text-sm">Your speech will automatically become icons</p>
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">Try saying:</p>
              <p>&quot;I want water&quot;</p>
              <p>&quot;I feel happy&quot;</p>
              <p>&quot;help me please&quot;</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
