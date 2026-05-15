'use client';

import { useState } from 'react';
import { matchTextToIcons } from '@/lib/ai/iconMatcher';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';
import type { IconMatch } from '@/lib/ai/iconMatcher';

export default function TextToIcons() {
  const { t, tIcon, language } = useLanguage();
  const dispatch = useAppDispatch();
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState<IconMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoConverted, setAutoConverted] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    const previousText = inputText;
    
    // Check if user just typed a space (completed a word)
    if (newText.endsWith(' ') && previousText.length > 0 && !previousText.endsWith(' ')) {
      // Extract the last completed word (before the new space)
      const words = previousText.trim().split(/\s+/);
      const completedWord = words[words.length - 1].toLowerCase();
      
      console.log('🔍 Auto-converting word:', completedWord);
      
      // Try to match and add to sentence
      const results = matchTextToIcons(completedWord, 1, language, customIcons);
      
      if (results.length > 0 && results[0].confidence >= 0.3) {
        console.log('✅ Adding icon to sentence:', results[0].icon);
        dispatch(addIconToSentence(results[0].icon));
        setAutoConverted(true);
      } else {
        console.log('❌ No match for:', completedWord);
      }
    }
    
    setInputText(newText);

    // Get the current word being typed and show suggestions
    const currentWord = newText.trim().split(/\s+/).pop()?.toLowerCase() || '';
    
    if (currentWord && !newText.endsWith(' ')) {
      const results = matchTextToIcons(currentWord, 6, language, customIcons);
      setMatches(results);
    } else {
      setMatches([]);
    }
  };

  const handleConvertToIcons = () => {
    if (!inputText.trim()) return;

    console.log('🔄 Converting text to icons:', inputText);
    setIsSearching(true);
    
    // Split text into words and match each word to icons
    const words = inputText.toLowerCase().trim().split(/\s+/);
    let convertedCount = 0;
    const failedWords: string[] = [];
    
    // Try to match and add each word to the sentence
    words.forEach((word) => {
      const results = matchTextToIcons(word, 1, language, customIcons);
      console.log(`🔍 Matching "${word}":`, results);
      
      if (results.length > 0 && results[0].confidence >= 0.3) {
        console.log(`✅ Adding icon to sentence:`, results[0].icon);
        dispatch(addIconToSentence(results[0].icon));
        convertedCount++;
      } else {
        console.log(`❌ No match for "${word}"`);
        failedWords.push(word);
      }
    });

    console.log(`📊 Conversion complete: ${convertedCount}/${words.length} words added to sentence`);
    
    setIsSearching(false);
    setAutoConverted(convertedCount > 0);
    
    // Always clear input and suggestions after conversion
    setInputText('');
    setMatches([]);
    console.log('✔️ Input and suggestions cleared');
  };

  const handleAddIcon = (match: IconMatch) => {
    dispatch(addIconToSentence(match.icon));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // On Enter, convert the last word if any
      if (inputText.trim()) {
        const words = inputText.trim().split(/\s+/);
        const lastWord = words[words.length - 1].toLowerCase();
        console.log('🔍 Converting last word on Enter:', lastWord);
        
        const results = matchTextToIcons(lastWord, 1, language, customIcons);
        
        if (results.length > 0 && results[0].confidence >= 0.3) {
          console.log('✅ Adding final icon to sentence:', results[0].icon);
          dispatch(addIconToSentence(results[0].icon));
          setAutoConverted(true);
        }
        
        // Clear input after pressing Enter
        setInputText('');
        setMatches([]);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        {/* Input Section */}
        <div className="mb-6">
          <label htmlFor="text-input" className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            {t('type.title')}
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t('type.hint')}
          </p>
          <div className="flex gap-2">
            <input
              id="text-input"
              type="text"
              value={inputText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder={t('type.placeholder')}
              className="
                flex-1 px-4 py-3 rounded-lg
                border-2 border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                text-lg
              "
            />
            <button
              onClick={handleConvertToIcons}
              disabled={!inputText.trim() || isSearching}
              className="
                px-6 py-3 rounded-lg
                bg-primary text-white
                hover:bg-primary-hover
                disabled:bg-gray-300 dark:disabled:bg-gray-700
                disabled:cursor-not-allowed
                transition-colors
                font-medium
                whitespace-nowrap
              "
            >
              {isSearching ? t('type.converting') : t('type.convert')}
            </button>
          </div>
          {autoConverted && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              {t('type.success')}
            </p>
          )}
        </div>

        {/* Additional Suggestions */}
        {matches.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              {t('type.suggestions')}
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
                  {/* Confidence Badge */}
                  {match.matchType === 'exact' && (
                    <span className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full px-1.5 py-0.5">
                      ✓
                    </span>
                  )}
                  
                  {match.icon.imageUrl ? (
                    <div className="relative w-8 h-8 mb-1">
                      <img src={match.icon.imageUrl} alt={match.icon.name} className="object-contain w-full h-full" />
                    </div>
                  ) : (
                    <span className="text-3xl mb-1">{match.icon.symbol}</span>
                  )}
                  <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
                    {match.icon.id.startsWith('custom_') ? match.icon.name : tIcon(match.icon.id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {matches.length === 0 && autoConverted && (
          <div className="text-center py-8 text-green-600 dark:text-green-400">
            <p className="text-lg mb-2">✓ All words converted to icons!</p>
            <p className="text-sm">Type another sentence to continue</p>
          </div>
        )}

        {/* Help Text */}
        {!autoConverted && matches.length === 0 && !inputText && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-4">✨ Type to automatically convert text to icons</p>
            <div className="text-sm space-y-2">
              <p className="font-medium">Try these examples:</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <button
                  onClick={() => setInputText('I want to eat pizza')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  &quot;I want to eat pizza&quot;
                </button>
                <button
                  onClick={() => setInputText('I feel happy')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  &quot;I feel happy&quot;
                </button>
                <button
                  onClick={() => setInputText('help me please')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  &quot;help me please&quot;
                </button>
                <button
                  onClick={() => setInputText('I want water')}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  &quot;I want water&quot;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
