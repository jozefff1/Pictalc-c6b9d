'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setPreferences as setReduxPreferences } from '@/store/slices/uiSlice';

export interface Preferences {
  voiceSpeed: number;
  voicePitch: number;
  hapticEnabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  textSize: number;
}

const DEFAULTS: Preferences = {
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  hapticEnabled: true,
  highContrast: false,
  reduceMotion: false,
  textSize: 1.0,
};

export function usePreferences() {
  const dispatch = useAppDispatch();
  const [preferences, setPreferencesState] = useState<Preferences>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          const loaded: Preferences = {
            voiceSpeed: data.preferences.voiceSpeed ?? 1.0,
            voicePitch: data.preferences.voicePitch ?? 1.0,
            hapticEnabled: data.preferences.hapticEnabled ?? true,
            highContrast: data.preferences.highContrast ?? false,
            reduceMotion: data.preferences.reduceMotion ?? false,
            textSize: data.preferences.textSize ?? 1.0,
          };
          setPreferencesState(loaded);
          dispatch(setReduxPreferences(loaded));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [dispatch]);

  const setPreferences = (updated: Preferences) => {
    setPreferencesState(updated);
    dispatch(setReduxPreferences(updated));
  };

  return { preferences, setPreferences, loading };
}
