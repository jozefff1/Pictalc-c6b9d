'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_LABELS: Record<string, string> = {
  child: 'Child',
  guardian: 'Guardian',
  therapist: 'Therapist',
  teacher: 'Teacher',
};

const ROLE_COLORS: Record<string, string> = {
  child: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  guardian: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  therapist: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  teacher: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setNameInput(data.user.name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
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
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Could not load profile.</p>
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
            ← Dashboard
          </Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
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
                    {saving ? '...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setNameInput(profile.name); setEditingName(false); setSaveError(''); }}
                    className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
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
                    ✏️ Edit
                  </button>
                </div>
              )}

              {saveError && (
                <p className="text-sm text-red-500 mt-1">{saveError}</p>
              )}
              {savedFlash && !saveError && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">✓ Name updated</p>
              )}

              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[profile.role] ?? ROLE_COLORS.child}`}>
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{ROLE_LABELS[profile.role] ?? profile.role}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Member since</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{memberSince}</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              ⚙️ Voice Settings
            </Link>
            <Link
              href="/communicate"
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              💬 Communicate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
