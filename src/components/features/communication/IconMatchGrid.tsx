'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import type { IconMatch } from '@/lib/ai/iconMatcher';

interface IconMatchGridProps {
  matches: IconMatch[];
  onAdd: (match: IconMatch) => void;
  label?: string;
}

export default function IconMatchGrid({ matches, onAdd, label }: IconMatchGridProps) {
  const { tIcon } = useLanguage();

  if (matches.length === 0) return null;

  return (
    <div>
      {label && (
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          {label}
        </h3>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {matches.map((match) => (
          <button
            key={match.icon.id}
            onClick={() => onAdd(match)}
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
            style={match.icon.color ? { borderColor: `${match.icon.color}40` } : undefined}
            aria-label={`Add ${tIcon(match.icon.id)} to sentence`}
          >
            {match.matchType === 'exact' && (
              <span className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full px-1.5 py-0.5">
                ✓
              </span>
            )}
            {match.icon.imageUrl ? (
              <div className="relative w-8 h-8 mb-1">
                <Image src={match.icon.imageUrl} alt={match.icon.name} fill className="object-contain" />
              </div>
            ) : (
              <span className="text-3xl mb-1">{match.icon.symbol}</span>
            )}
            <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300">
              {(() => {
                const translated = tIcon(match.icon.id);
                return translated !== match.icon.id ? translated : match.icon.name;
              })()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
