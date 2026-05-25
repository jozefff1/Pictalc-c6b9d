'use client';

import { useState, useEffect, useCallback } from 'react';
import { indexedDB } from '@/lib/offline/indexedDB';
import type { UserSentence } from '@/types/models';

function generateId(): string {
  return (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useUserSentences(userId: string | undefined) {
  const [sentences, setSentences] = useState<UserSentence[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from IndexedDB first, then sync from server
  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      // 1. Load offline copy immediately
      const local = await indexedDB.getUserSentences(userId);
      setSentences(local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      // 2. Fetch from server and update
      const res = await fetch('/api/sentences');
      if (res.ok) {
        const data = await res.json() as { sentences: UserSentence[] };
        const serverSentences = data.sentences.map((s) => ({ ...s, synced: true }));
        // Merge: replace local store with server truth
        await indexedDB.clearUserSentences(userId);
        await Promise.all(serverSentences.map((s) => indexedDB.saveUserSentence(s)));
        setSentences(serverSentences);
      }
    } catch {
      // offline — keep local data
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { void load(); }, [load]);

  const addSentence = useCallback(async (text: string, iconIds: string[], category: string, language: string): Promise<UserSentence | null> => {
    if (!userId) return null;

    const optimistic: UserSentence = {
      id: generateId(),
      userId,
      text,
      iconIds,
      category,
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
      synced: false,
    };

    // Optimistic update
    await indexedDB.saveUserSentence(optimistic);
    setSentences((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch('/api/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, iconIds, category, language }),
      });
      if (res.ok) {
        const data = await res.json() as { sentence: UserSentence };
        const synced = { ...data.sentence, synced: true };
        await indexedDB.deleteUserSentence(optimistic.id);
        await indexedDB.saveUserSentence(synced);
        setSentences((prev) => prev.map((s) => s.id === optimistic.id ? synced : s));
        return synced;
      }
    } catch {
      // stays in local / unsynced state
    }
    return optimistic;
  }, [userId]);

  const updateSentence = useCallback(async (id: string, patch: { text?: string; iconIds?: string[]; category?: string }): Promise<void> => {
    setSentences((prev) => prev.map((s) => s.id === id ? { ...s, ...patch, updatedAt: new Date(), synced: false } : s));
    try {
      const res = await fetch(`/api/sentences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json() as { sentence: UserSentence };
        await indexedDB.saveUserSentence({ ...data.sentence, synced: true });
        setSentences((prev) => prev.map((s) => s.id === id ? { ...data.sentence, synced: true } : s));
      }
    } catch {
      // keep optimistic
    }
  }, []);

  const deleteSentence = useCallback(async (id: string): Promise<void> => {
    setSentences((prev) => prev.filter((s) => s.id !== id));
    await indexedDB.deleteUserSentence(id);
    try {
      await fetch(`/api/sentences/${id}`, { method: 'DELETE' });
    } catch {
      // offline — already removed locally
    }
  }, []);

  return { sentences, loading, addSentence, updateSentence, deleteSentence, reload: load };
}
