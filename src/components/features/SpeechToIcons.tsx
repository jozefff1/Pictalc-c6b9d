'use client';

import { useState, useEffect, useRef } from 'react';
import { SpeechRecognizer, isSpeechRecognitionSupported } from '@/lib/services/speechService';
import { matchTextToIcons } from '@/lib/ai/iconMatcher';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';
import IconMatchGrid from '@/components/features/communication/IconMatchGrid';
import type { IconMatch } from '@/lib/ai/iconMatcher';

export default function SpeechToIcons() {
  const { language } = useLanguage();
  const dispatch = useAppDispatch();
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const supported = isSpeechRecognitionSupported();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [matches, setMatches] = useState<IconMatch[]>([]);
  const [error, setError] = useState<string>('');
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  useEffect(() => {
    if (!supported) return;
    try {
      const langCode = language === 'no' ? 'nb-NO' : 'en-US';
      const rec = new SpeechRecognizer({ lang: langCode, continuous: false, interimResults: true });
      recognizerRef.current = rec;
      return () => { rec.abort(); };
    } catch {
      // Construction failed — recognizerRef.current stays null;
      // handleStartListening will surface the error when the user taps
    }
  }, [language, supported]);

  const handleStartListening = () => {
    if (!recognizerRef.current) {
      setError('Speech recognition not available');
      return;
    }

    setError('');
    setTranscript('');
    setInterimTranscript('');
    setMatches([]);

    recognizerRef.current.start(
      (text, isFinal) => {
        if (isFinal) {
          setTranscript(text);
          setInterimTranscript('');
          
          // Auto-convert to icons
          const words = text.toLowerCase().trim().split(/\s+/);
          words.forEach((word) => {
            const results = matchTextToIcons(word, 1, language, customIcons);
            if (results.length > 0 && results[0].confidence >= 0.3) {
              dispatch(addIconToSentence(results[0].icon));
            }
          });
          
          // Show additional suggestions for unmatched words
          const allMatches = matchTextToIcons(text, 12, language, customIcons);
          const suggestions = allMatches.filter(match => match.confidence < 1.0);
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
    recognizerRef.current?.stop();
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
            disabled={!supported}
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
        {(!supported || error) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || 'Speech recognition not available'}
            </p>
          </div>
        )}

        {/* Matched Icons */}
        {matches.length > 0 && (
          <IconMatchGrid
            matches={matches}
            onAdd={handleAddIcon}
            label="More suggestions (tap to add)"
          />
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
