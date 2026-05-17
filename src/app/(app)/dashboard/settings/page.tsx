'use client';

import { useEffect, useState, useCallback } from 'react';
import { speakText, isSpeechSynthesisSupported } from '@/lib/services/speechService';

interface Prefs {
  voiceSpeed: number;
  voicePitch: number;
  hapticEnabled: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  textSize: number;
}

const DEFAULTS: Prefs = {
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  hapticEnabled: true,
  highContrast: false,
  reduceMotion: false,
  textSize: 1.0,
};

function applyAccessibility(prefs: Prefs) {
  const html = document.documentElement;
  html.classList.toggle('high-contrast', prefs.highContrast);
  html.classList.toggle('normal-contrast', !prefs.highContrast);
  html.classList.toggle('reduce-motion', prefs.reduceMotion);
  html.style.fontSize = prefs.textSize === 1.0 ? '' : `${prefs.textSize * 100}%`;
  localStorage.setItem('pictalk-high-contrast', String(prefs.highContrast));
  localStorage.setItem('pictalk-reduce-motion', String(prefs.reduceMotion));
  localStorage.setItem('pictalk-text-size', String(prefs.textSize));
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          const loaded: Prefs = {
            voiceSpeed: data.preferences.voiceSpeed ?? 1.0,
            voicePitch: data.preferences.voicePitch ?? 1.0,
            hapticEnabled: data.preferences.hapticEnabled ?? true,
            highContrast: data.preferences.highContrast ?? false,
            reduceMotion: data.preferences.reduceMotion ?? false,
            textSize: data.preferences.textSize ?? 1.0,
          };
          setPrefs(loaded);
          applyAccessibility(loaded);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (patch: Partial<Prefs>) => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail — prefs are non-critical
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'highContrast' || key === 'reduceMotion' || key === 'textSize') {
        applyAccessibility(updated);
      }
      save({ [key]: value });
      return updated;
    });
  }, [save]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Adjust your voice, speech, and accessibility preferences</p>
        </div>

        <div className="space-y-6">
          {/* Voice Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🔊</span> Voice Settings
            </h2>

            {/* Speed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Speaking Speed
                </label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                  {prefs.voiceSpeed.toFixed(1)}×
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={prefs.voiceSpeed}
                onChange={(e) => update('voiceSpeed', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slow (0.5×)</span>
                <span>Normal (1.0×)</span>
                <span>Fast (2.0×)</span>
              </div>
            </div>

            {/* Pitch */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Voice Pitch
                </label>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                  {prefs.voicePitch.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={prefs.voicePitch}
                onChange={(e) => update('voicePitch', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low (0.5)</span>
                <span>Normal (1.0)</span>
                <span>High (2.0)</span>
              </div>
            </div>

            {/* Test button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => speakText('Hello! This is how I sound.', { speed: prefs.voiceSpeed, pitch: prefs.voicePitch })}
                disabled={!isSpeechSynthesisSupported()}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                🎤 Test Voice
              </button>
              {saving && <span className="text-sm text-gray-400">Saving...</span>}
              {saved && !saving && <span className="text-sm text-green-600 dark:text-green-400">✓ Saved</span>}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>♿</span> Accessibility
            </h2>

            {/* Haptic Feedback */}
            <ToggleRow
              label="Haptic Feedback"
              description="Vibrate the device briefly when tapping an icon (supported devices only)"
              checked={prefs.hapticEnabled}
              onChange={(v) => update('hapticEnabled', v)}
            />

            {/* High Contrast */}
            <ToggleRow
              label="High Contrast"
              description="Increase colour contrast for text and borders — helps with visual impairments"
              checked={prefs.highContrast}
              onChange={(v) => update('highContrast', v)}
            />

            {/* Reduce Motion */}
            <ToggleRow
              label="Reduce Motion"
              description="Disable animations and transitions throughout the app"
              checked={prefs.reduceMotion}
              onChange={(v) => update('reduceMotion', v)}
            />

            {/* Text Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Text Size</p>
                  <p className="text-xs text-gray-400 mt-0.5">Scale all text in the app</p>
                </div>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                  {prefs.textSize.toFixed(1)}×
                </span>
              </div>
              <input
                type="range"
                min={0.8}
                max={2.0}
                step={0.1}
                value={prefs.textSize}
                onChange={(e) => update('textSize', parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Small (0.8×)</span>
                <span>Normal (1.0×)</span>
                <span>Large (2.0×)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

