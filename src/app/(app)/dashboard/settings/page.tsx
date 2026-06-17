'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  speakText,
  isSpeechSynthesisSupported,
  getAvailableVoices,
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  clearPreferredVoiceURI,
} from '@/lib/services/speechService';
import { STORAGE_KEYS } from '@/lib/utils/constants';
import { usePreferences, type Preferences } from '@/hooks/usePreferences';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useLanguage } from '@/contexts/LanguageContext';

type Prefs = Preferences;

function applyAccessibility(prefs: Prefs) {
  const html = document.documentElement;
  html.classList.toggle('high-contrast', prefs.highContrast);
  html.classList.toggle('normal-contrast', !prefs.highContrast);
  html.classList.toggle('reduce-motion', prefs.reduceMotion);
  html.style.fontSize = prefs.textSize === 1.0 ? '' : `${prefs.textSize * 100}%`;
  localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, String(prefs.highContrast));
  localStorage.setItem(STORAGE_KEYS.REDUCE_MOTION, String(prefs.reduceMotion));
  localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, String(prefs.textSize));
}

const LOCALE_BY_LANGUAGE: Record<string, string> = {
  en: 'en-US',
  no: 'no-NO',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

function languageBase(locale: string): string {
  return locale.toLowerCase().split(/[-_]/)[0];
}

function localeBases(locale: string): string[] {
  const base = languageBase(locale);
  if (base === 'no' || base === 'nb' || base === 'nn') return ['no', 'nb', 'nn'];
  return [base];
}

function isVoiceMatchForLocale(voice: SpeechSynthesisVoice, locale: string): boolean {
  const accepted = localeBases(locale);
  return accepted.includes(languageBase(voice.lang));
}

function isNorwegianLocale(locale: string): boolean {
  const base = languageBase(locale);
  return base === 'no' || base === 'nb' || base === 'nn';
}

export default function SettingsPage() {
  const { t, language } = useLanguage();
  const { preferences, setPreferences, loading } = usePreferences();
  const [prefs, setPrefs] = useState<Prefs>(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, triggerSaved] = useFlashMessage();
  const [voicesLoading, setVoicesLoading] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [isAndroid, setIsAndroid] = useState(false);

  const ttsLocale = useMemo(
    () => LOCALE_BY_LANGUAGE[language] ?? 'en-US',
    [language],
  );

  const matchingVoices = useMemo(
    () => voices.filter((voice) => isVoiceMatchForLocale(voice, ttsLocale)),
    [voices, ttsLocale],
  );

  const voiceOptions = useMemo(() => {
    const source = matchingVoices.length > 0 ? matchingVoices : voices;
    const seen = new Set<string>();
    return source.filter((voice) => {
      if (seen.has(voice.voiceURI)) return false;
      seen.add(voice.voiceURI);
      return true;
    });
  }, [matchingVoices, voices]);

  const selectedVoice = useMemo(
    () => voiceOptions.find((voice) => voice.voiceURI === voiceURI),
    [voiceOptions, voiceURI],
  );

  // Sync local prefs state once hook resolves and apply accessibility settings
  useEffect(() => {
    if (!loading) {
      setPrefs(preferences);
      applyAccessibility(preferences);
    }
  }, [loading, preferences]);

  useEffect(() => {
    let active = true;
    setVoicesLoading(true);
    getAvailableVoices()
      .then((available) => {
        if (active) setVoices(available);
      })
      .finally(() => {
        if (active) setVoicesLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const preferred = getPreferredVoiceURI(ttsLocale);
    setVoiceURI(preferred ?? '');
  }, [ttsLocale]);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    setIsAndroid(/android/i.test(navigator.userAgent));
  }, []);

  const save = useCallback(async (patch: Partial<Prefs>) => {
    setSaving(true);
    try {
      await fetch('/api/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      triggerSaved();
    } catch {
      // silently fail — prefs are non-critical
    } finally {
      setSaving(false);
    }
  }, [triggerSaved]);

  const update = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'highContrast' || key === 'reduceMotion' || key === 'textSize') {
        applyAccessibility(updated);
      }
      setPreferences(updated);
      save({ [key]: value });
      return updated;
    });
  }, [save, setPreferences]);

  const handleVoiceChange = (nextVoiceURI: string) => {
    if (nextVoiceURI) {
      setPreferredVoiceURI(ttsLocale, nextVoiceURI);
    } else {
      clearPreferredVoiceURI(ttsLocale);
    }
    setVoiceURI(nextVoiceURI);
    triggerSaved();
  };

  const testPhrase = language === 'no'
    ? 'Hei! Dette er hvordan stemmen min høres ut.'
    : 'Hello! This is how I sound.';

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('settings.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Voice Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>🔊</span> {t('settings.voice.title')}
            </h2>

            {/* Speed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.voice.speed')}
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
                <span>{t('settings.voice.slow')}</span>
                <span>{t('settings.voice.normal')}</span>
                <span>{t('settings.voice.fast')}</span>
              </div>
            </div>

            {/* Voice */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.voice.select')}
                </label>
                <span className="text-xs text-gray-400">{t('settings.voice.selectDesc')}</span>
              </div>
              <select
                value={voiceURI}
                onChange={(e) => handleVoiceChange(e.target.value)}
                disabled={!isSpeechSynthesisSupported() || voicesLoading}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 disabled:opacity-60"
              >
                <option value="">{t('settings.voice.browserDefault')}</option>
                {voiceOptions.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              {matchingVoices.length === 0 && voices.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {t('settings.voice.noVoiceMatch')}
                </p>
              )}
              {isAndroid && isNorwegianLocale(ttsLocale) && matchingVoices.length === 0 && (
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                  Android tip: install Norwegian voice data in system settings under Accessibility, Text-to-speech output, Install voice data.
                </p>
              )}
            </div>

            {/* Pitch */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('settings.voice.pitch')}
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
                <span>{t('settings.voice.low')}</span>
                <span>{t('settings.voice.normal')}</span>
                <span>{t('settings.voice.high')}</span>
              </div>
            </div>

            {/* Test button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => speakText(testPhrase, {
                  speed: prefs.voiceSpeed,
                  pitch: prefs.voicePitch,
                  lang: ttsLocale,
                  voice: selectedVoice,
                  voiceURI: voiceURI || undefined,
                })}
                disabled={!isSpeechSynthesisSupported()}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                {t('settings.voice.test')}
              </button>
              {saving && <span className="text-sm text-gray-400">{t('settings.voice.saving')}</span>}
              {saved && !saving && <span className="text-sm text-green-600 dark:text-green-400">{t('settings.voice.saved')}</span>}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>♿</span> {t('settings.accessibility.title')}
            </h2>

            {/* Haptic Feedback */}
            <ToggleRow
              label={t('settings.haptic.label')}
              description={t('settings.haptic.desc')}
              checked={prefs.hapticEnabled}
              onChange={(v) => update('hapticEnabled', v)}
            />

            {/* High Contrast */}
            <ToggleRow
              label={t('settings.highContrast.label')}
              description={t('settings.highContrast.desc')}
              checked={prefs.highContrast}
              onChange={(v) => update('highContrast', v)}
            />

            {/* Reduce Motion */}
            <ToggleRow
              label={t('settings.reduceMotion.label')}
              description={t('settings.reduceMotion.desc')}
              checked={prefs.reduceMotion}
              onChange={(v) => update('reduceMotion', v)}
            />

            {/* Text Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.textSize.label')}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t('settings.textSize.desc')}</p>
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
                <span>{t('settings.small')}</span>
                <span>{t('settings.voice.normal')}</span>
                <span>{t('settings.large')}</span>
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
