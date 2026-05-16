'use client';

import { useEffect, useState, useCallback } from 'react';
import { speakText, isSpeechSynthesisSupported } from '@/lib/services/speechService';

interface VoicePrefs {
  voiceSpeed: number;
  voicePitch: number;
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<VoicePrefs>({ voiceSpeed: 1.0, voicePitch: 1.0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.preferences) {
          setPrefs({
            voiceSpeed: data.preferences.voiceSpeed ?? 1.0,
            voicePitch: data.preferences.voicePitch ?? 1.0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (updated: VoicePrefs) => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail — prefs are non-critical
    } finally {
      setSaving(false);
    }
  }, []);

  const handleSpeedChange = (value: number) => {
    const updated = { ...prefs, voiceSpeed: value };
    setPrefs(updated);
    save(updated);
  };

  const handlePitchChange = (value: number) => {
    const updated = { ...prefs, voicePitch: value };
    setPrefs(updated);
    save(updated);
  };

  const handleTestVoice = () => {
    if (!isSpeechSynthesisSupported()) return;
    speakText('Hello! This is how I sound.', {
      speed: prefs.voiceSpeed,
      pitch: prefs.voicePitch,
    });
  };

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
          <p className="text-gray-500 dark:text-gray-400 mt-1">Adjust your voice and speech preferences</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <span>🔊</span> Voice Settings
            </h2>

            {/* Speed */}
            <div className="mb-6">
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
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Slow (0.5×)</span>
                <span>Normal (1.0×)</span>
                <span>Fast (2.0×)</span>
              </div>
            </div>

            {/* Pitch */}
            <div className="mb-6">
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
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
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
                onClick={handleTestVoice}
                disabled={!isSpeechSynthesisSupported()}
                className="
                  px-5 py-2.5 rounded-lg
                  bg-primary text-white font-medium
                  hover:bg-primary-hover
                  disabled:bg-gray-300 dark:disabled:bg-gray-700
                  disabled:cursor-not-allowed
                  transition-colors
                "
              >
                🎤 Test Voice
              </button>

              {saving && (
                <span className="text-sm text-gray-400">Saving...</span>
              )}
              {saved && !saving && (
                <span className="text-sm text-green-600 dark:text-green-400">✓ Saved</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
