'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '@/lib/utils/constants';

const LABEL_EVENT = 'snakke-icon-labels-change';

// Storage format: { iconId: { language: label } }
type LabelStore = Record<string, Record<string, string>>;

// Module-level cache so getSnapshot returns a stable reference between events
let labelsCache: LabelStore | null = null;

function readLabels(): LabelStore {
  if (labelsCache !== null) return labelsCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ICON_LABELS);
    if (!raw) { labelsCache = {}; return labelsCache; }
    const parsed = JSON.parse(raw);
    // Migration: detect old flat format { iconId: string } and discard silently
    const isOldFormat = Object.values(parsed).some((v) => typeof v === 'string');
    if (isOldFormat) {
      labelsCache = {};
      localStorage.removeItem(STORAGE_KEYS.ICON_LABELS);
      return labelsCache;
    }
    labelsCache = parsed as LabelStore;
  } catch {
    labelsCache = {};
  }
  return labelsCache;
}

function subscribeLabels(callback: () => void) {
  const handler = () => {
    labelsCache = null; // invalidate cache on change
    callback();
  };
  window.addEventListener(LABEL_EVENT, handler);
  return () => window.removeEventListener(LABEL_EVENT, handler);
}

const emptyStore: LabelStore = {};
const serverSnapshot = () => emptyStore;

/**
 * Provides per-icon, per-language custom label overrides stored in localStorage.
 * Pass the current language; returns labels filtered to that language only.
 * Labels take priority over language translations in the icon picker and sentence builder.
 */
export function useIconLabels(language: string = 'en') {
  const store = useSyncExternalStore(subscribeLabels, readLabels, serverSnapshot);

  // Flatten to { iconId: label } for the requested language only
  const labels = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(store)
          .filter(([, langs]) => langs[language])
          .map(([id, langs]) => [id, langs[language]])
      ) as Record<string, string>,
    [store, language]
  );

  const setLabel = useCallback(
    (iconId: string, label: string) => {
      const current = { ...readLabels() };
      const trimmed = label.trim();
      if (trimmed) {
        current[iconId] = { ...(current[iconId] ?? {}), [language]: trimmed };
      } else {
        if (current[iconId]) {
          const { [language]: _removed, ...rest } = current[iconId];
          if (Object.keys(rest).length > 0) {
            current[iconId] = rest;
          } else {
            delete current[iconId];
          }
        }
      }
      labelsCache = null;
      localStorage.setItem(STORAGE_KEYS.ICON_LABELS, JSON.stringify(current));
      window.dispatchEvent(new Event(LABEL_EVENT));
    },
    [language]
  );

  const clearLabel = useCallback(
    (iconId: string) => {
      const current = { ...readLabels() };
      if (current[iconId]) {
        const { [language]: _removed, ...rest } = current[iconId];
        if (Object.keys(rest).length > 0) {
          current[iconId] = rest;
        } else {
          delete current[iconId];
        }
      }
      labelsCache = null;
      localStorage.setItem(STORAGE_KEYS.ICON_LABELS, JSON.stringify(current));
      window.dispatchEvent(new Event(LABEL_EVENT));
    },
    [language]
  );

  return { labels, setLabel, clearLabel };
}
