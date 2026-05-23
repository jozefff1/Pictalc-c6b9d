'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ROLE_LABELS, ROLE_COLORS, getInitials } from '@/lib/utils/labels';
import { useFlashMessage } from '@/hooks/useFlashMessage';
import { useFetch } from '@/hooks/useFetch';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const { data: profileData, loading } = useFetch<{ user: UserProfile }>('/api/profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedFlash, triggerSavedFlash] = useFlashMessage();

  useEffect(() => {
    if (profileData?.user) {
      setProfile(profileData.user);
      setNameInput(profileData.user.name);
    }
  }, [profileData]);

  const handleSaveName = async () => {
    if (!nameInput.trim() || nameInput === profile?.name) {
      setEditingName(false);
      return;
    }

    setSaving(true);
    setSaveError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.error || 'Failed to save');
        return;
      }

      setProfile((prev) => prev ? { ...prev, name: data.name } : prev);
      setEditingName(false);
      triggerSavedFlash();
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setNameInput(profile?.name ?? '');
      setEditingName(false);
      setSaveError('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('profile.loading')}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">{t('profile.error')}</p>
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
          >
            ← {t('nav.dashboard')}
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('profile.title')}</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
          {/* Avatar + Name */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-white">
                {getInitials(profile.name)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    maxLength={255}
                    className="
                      flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-700
                      text-gray-900 dark:text-gray-100 font-semibold text-lg
                      focus:outline-none focus:ring-2 focus:ring-primary
                    "
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors"
                  >
                    {saving ? t('profile.saving') : t('profile.save')}
                  </button>
                  <button
                    onClick={() => { setNameInput(profile.name); setEditingName(false); setSaveError(''); }}
                    className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    {profile.name}
                  </h2>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-xs text-gray-400 hover:text-primary transition-colors"
                    aria-label="Edit name"
                  >
                    {t('profile.edit')}
                  </button>
                </div>
              )}

              {saveError && (
                <p className="text-sm text-red-500 mt-1">{saveError}</p>
              )}
              {savedFlash && !saveError && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{t('profile.saved')}</p>
              )}

              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[profile.role] ?? ROLE_COLORS.child}`}>
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('profile.email')}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('profile.role')}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{ROLE_LABELS[profile.role] ?? profile.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('profile.memberSince')}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{memberSince}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('profile.voiceSettings')}
            </Link>
            <Link
              href="/communicate"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              {t('profile.communicate')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
