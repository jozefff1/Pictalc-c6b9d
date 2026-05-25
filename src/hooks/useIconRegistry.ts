'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCustomIcons } from '@/store/slices/communicationSlice';
import {
  ICON_DATABASE,
  getIconsByCategory as getBuiltinByCategory,
} from '@/lib/data/icons';
import { useIconLabels } from '@/hooks/useIconLabels';
import type { Icon, IconCategory } from '@/types/models';

/**
 * Unified icon registry that merges ICON_DATABASE, user-uploaded custom icons
 * (from Redux / API), and per-icon custom label overrides (from localStorage).
 *
 * Auto-fetches custom icons from /api/icons if Redux is empty and the user is
 * logged in — so any page can use the registry without visiting the communicate
 * page first.
 */
export function useIconRegistry() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const customIcons = useAppSelector((state) => state.communication.customIcons);
  const { labels } = useIconLabels();

  // Populate Redux if needed (e.g. user navigates directly to /dashboard/phrases)
  useEffect(() => {
    if (!session?.user?.id || customIcons.length > 0) return;
    fetch('/api/icons')
      .then((res) => (res.ok ? res.json() : { icons: [] }))
      .then((data) => {
        if (Array.isArray(data.icons) && data.icons.length > 0) {
          dispatch(setCustomIcons(data.icons));
        }
      })
      .catch(console.error);
  }, [session?.user?.id, customIcons.length, dispatch]);

  /**
   * The display name for an icon: custom label override → original name.
   * (Translations are handled by tIcon() in components; this is for search/matching.)
   */
  const getEffectiveName = (icon: Icon): string =>
    labels[icon.id] ?? icon.name;

  /**
   * All icons for a category (built-in first, then custom).
   */
  const getByCategory = (category: IconCategory): Icon[] => [
    ...getBuiltinByCategory(category),
    ...customIcons.filter((ic) => ic.category === category),
  ];

  /**
   * Look up any icon (built-in or custom) by id.
   */
  const getById = (id: string): Icon | undefined =>
    ICON_DATABASE.find((ic) => ic.id === id) ??
    customIcons.find((ic) => ic.id === id);

  /**
   * Name+label aware search across ALL icons (built-in + custom).
   * Deduped by id.
   */
  const search = (query: string): Icon[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const seen = new Set<string>();
    const results: Icon[] = [];
    for (const ic of [...ICON_DATABASE, ...customIcons]) {
      if (seen.has(ic.id)) continue;
      const name = ic.name.toLowerCase();
      const label = (labels[ic.id] ?? '').toLowerCase();
      if (name.includes(q) || label.includes(q)) {
        seen.add(ic.id);
        results.push(ic);
      }
    }
    return results;
  };

  return {
    customIcons,
    labels,
    getEffectiveName,
    getByCategory,
    getById,
    search,
  };
}
