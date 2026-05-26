'use client';

import { useState, useRef, useEffect } from 'react';
import type { Icon } from '@/types/models';
import { useAppDispatch } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { addIconToSentence } from '@/store/slices/communicationSlice';
import { useIconLabels } from '@/hooks/useIconLabels';

interface IconGridProps {
  icons: Icon[];
}

export default function IconGrid({ icons }: IconGridProps) {
  const { tIcon, language } = useLanguage();
  const dispatch = useAppDispatch();
  const { labels, setLabel, clearLabel } = useIconLabels(language);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const getDisplayName = (icon: Icon) => {
    if (labels[icon.id]) return labels[icon.id];
    const translated = tIcon(icon.id);
    return translated !== icon.id ? translated : icon.name;
  };

  const handleIconClick = (icon: Icon) => {
    dispatch(addIconToSentence(icon));
    setTappedId(icon.id);
    setTimeout(() => setTappedId(null), 350);
  };

  const handleEditStart = (e: React.MouseEvent, icon: Icon) => {
    e.stopPropagation();
    setEditingId(icon.id);
    setEditValue(labels[icon.id] ?? getDisplayName(icon));
  };

  const handleEditSubmit = (iconId: string) => {
    setLabel(iconId, editValue);
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, iconId: string) => {
    if (e.key === 'Enter') { e.preventDefault(); handleEditSubmit(iconId); }
    if (e.key === 'Escape') { setEditingId(null); }
  };

  const handleResetLabel = (e: React.MouseEvent, iconId: string) => {
    e.stopPropagation();
    clearLabel(iconId);
    setEditingId(null);
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
      {icons.map((icon) => {
        const displayName = getDisplayName(icon);
        const isEditing = editingId === icon.id;
        const hasCustomLabel = !!labels[icon.id];

        return (
          <div key={icon.id} className="relative group">
            {/* Main selection button */}
            <div
              role="button"
              tabIndex={isEditing ? -1 : 0}
              onClick={() => !isEditing && handleIconClick(icon)}
              onKeyDown={(e) => e.key === 'Enter' && !isEditing && handleIconClick(icon)}
              className={`
                flex flex-col items-center justify-center
                p-4 rounded-xl cursor-pointer
                bg-white dark:bg-gray-800
                border-2 border-gray-200 dark:border-gray-700
                hover:border-primary hover:shadow-lg
                active:scale-95
                transition-all duration-200
                min-h-25
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${tappedId === icon.id ? 'icon-tapped' : ''}
              `}
              style={{ borderColor: `${icon.color}20` }}
              aria-label={`Select ${displayName}`}
            >
              {icon.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={icon.imageUrl}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="mb-2 object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="text-4xl mb-2">{icon.symbol}</span>
              )}

              {/* Label or inline editor */}
              {isEditing ? (
                <div
                  className="w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={editInputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, icon.id)}
                    onBlur={() => handleEditSubmit(icon.id)}
                    className="w-full text-xs text-center border border-primary rounded px-1 py-0.5 bg-white dark:bg-gray-700 outline-none"
                    maxLength={40}
                    placeholder="Enter label…"
                  />
                  {hasCustomLabel && (
                    <button
                      onMouseDown={(e) => handleResetLabel(e, icon.id)}
                      className="mt-0.5 w-full text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                      title="Reset to default name"
                    >
                      reset
                    </button>
                  )}
                </div>
              ) : (
                <span className={`text-sm font-medium text-center truncate w-full px-1 ${hasCustomLabel ? 'text-primary dark:text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                  {displayName}
                </span>
              )}
            </div>

            {/* Pencil rename button — appears on hover */}
            {!isEditing && (
              <button
                onClick={(e) => handleEditStart(e, icon)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-700 shadow text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px]"
                title="Rename this icon"
                aria-label={`Rename ${displayName}`}
                tabIndex={-1}
              >
                ✏️
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
