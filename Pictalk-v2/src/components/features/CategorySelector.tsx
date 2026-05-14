'use client';

import { CATEGORIES } from '@/lib/data/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { setSelectedCategory } from '@/store/slices/communicationSlice';

export default function CategorySelector() {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.communication.selectedCategory);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex overflow-x-auto scrollbar-hide gap-2 p-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => dispatch(setSelectedCategory(category.id))}
              className={`
                flex flex-col items-center justify-center min-w-20 px-4 py-3 rounded-lg
                transition-all duration-200 shrink-0
                ${
                  isSelected
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
              style={
                isSelected
                  ? { backgroundColor: category.color }
                  : undefined
              }
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span className="text-xs font-medium">{t(`category.${category.id}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
