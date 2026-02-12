'use client';

import type { Icon } from '@/types/models';
import { useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';

interface IconGridProps {
  icons: Icon[];
}

export default function IconGrid({ icons }: IconGridProps) {
  const { tIcon } = useLanguage();
  const dispatch = useAppDispatch();

  const handleIconClick = (icon: Icon) => {
    dispatch(addIconToSentence(icon));
  };

  if (icons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No icons available in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-4">
      {icons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleIconClick(icon)}
          className="
            flex flex-col items-center justify-center
            p-4 rounded-xl
            bg-white dark:bg-gray-800
            border-2 border-gray-200 dark:border-gray-700
            hover:border-primary hover:shadow-lg
            active:scale-95
            transition-all duration-200
            min-h-[100px]
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          "
          style={{ borderColor: `${icon.color}20` }}
          aria-label={`Select ${tIcon(icon.id)}`}
        >
          <span className="text-4xl mb-2">{icon.symbol}</span>
          <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
            {tIcon(icon.id)}
          </span>
        </button>
      ))}
    </div>
  );
}
