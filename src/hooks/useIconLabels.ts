'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { STORAGE_KEYS } from '@/lib/utils/constants';

const LABEL_EVENT = 'snakke-icon-labels-change';

// Module-level cache so getSnapshot returns a stable reference between events
let labelsCache: Record<string, string> | null = null;

function readLabels(): Record<string, string> {
  if (labelsCache !== null) return labelsCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ICON_LABELS);
    labelsCache = raw ? (JSON.parse(raw) as Record<string, string>) : {};
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

const emptyLabels: Record<string, string> = {};
const serverSnapshot = () => emptyLabels;

/**
 * Provides per-icon custom label overrides stored in localStorage.
 * Labels take priority over language translations in the icon picker and sentence builder.
 */
export function useIconLabels() {
  const labels = useSyncExternalStore(subscribeLabels, readLabels, serverSnapshot);

  const setLabel = useCallback((iconId: string, label: string) => {
    const current = { ...readLabels() };
    const trimmed = label.trim();
    if (trimmed) {
      current[iconId] = trimmed;
    } else {
      delete current[iconId];
    }
    labelsCache = null;
    localStorage.setItem(STORAGE_KEYS.ICON_LABELS, JSON.stringify(current));
    window.dispatchEvent(new Event(LABEL_EVENT));
  }, []);

  const clearLabel = useCallback((iconId: string) => {
    const current = { ...readLabels() };
    delete current[iconId];
    labelsCache = null;
    localStorage.setItem(STORAGE_KEYS.ICON_LABELS, JSON.stringify(current));
    window.dispatchEvent(new Event(LABEL_EVENT));
  }, []);

  return { labels, setLabel, clearLabel };
}
