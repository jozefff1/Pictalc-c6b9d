'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t('resetPw.error.missingToken'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('resetPw.error.mismatch'));
      return;
    }

    if (!checks.length || !checks.uppercase || !checks.lowercase || !checks.number) {
      setError(t('resetPw.error.requirements'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? t('resetPw.error.generic'));
        return;
      }

      router.push('/login?reset=true');
    } catch {
      setError(t('resetPw.error.network'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
          <div className="text-5xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('resetPw.invalidLink.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('resetPw.invalidLink.desc')}
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            {t('resetPw.requestNew')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('resetPw.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('resetPw.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('resetPw.newPassword')}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
            {password.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs">
                {[
                  { key: 'length', label: t('register.pw.length') },
                  { key: 'uppercase', label: t('register.pw.uppercase') },
                  { key: 'lowercase', label: t('register.pw.lowercase') },
                  { key: 'number', label: t('register.pw.number') },
                ].map(({ key, label }) => (
                  <li
                    key={key}
                    className={checks[key as keyof typeof checks] ? 'text-green-600' : 'text-gray-400'}
                  >
                    {checks[key as keyof typeof checks] ? '✓' : '○'} {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              {t('resetPw.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? t('resetPw.submitting') : t('resetPw.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
