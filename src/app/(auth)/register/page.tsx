'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const callbackUrl = searchParams.get('callbackUrl') ?? '';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'child' as 'child' | 'guardian' | 'therapist' | 'teacher',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = () => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return checks;
  };

  const passwordChecks = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    if (formData.name.length < 2) {
      setFieldErrors({ name: t('register.validation.name') });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: t('register.validation.passwords') });
      return;
    }

    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number) {
      setError(t('register.error.requirements'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          const errors: Record<string, string> = {};
          data.details.forEach((issue: { path: (string | number)[]; message: string }) => {
            const field = issue.path[0];
            if (typeof field === 'string') {
              errors[field] = issue.message;
            }
          });
          setFieldErrors(errors);
          setError(t('register.error.fixBelow'));
        } else {
          setError(data.error || t('register.error.failed'));
        }
        return;
      }

      // Redirect to email verification pending page
      const encodedEmail = encodeURIComponent(formData.email);
      const cbParam = callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : '';
      router.push(`/verify-email?email=${encodedEmail}${cbParam}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error – could not reach the server';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('register.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg"
              role="alert"
            >
              <p className="font-semibold text-sm mb-0.5">{t('register.error.failed')}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t('register.name')}
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 ${
                fieldErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={t('register.namePlaceholder')}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t('register.email')}
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="your@email.com"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              {t('register.role')}
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as typeof formData.role,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700"
            >
              <option value="child">{t('register.role.child')}</option>
              <option value="guardian">{t('register.role.guardian')}</option>
              <option value="teacher">{t('register.role.teacher')}</option>
              <option value="therapist">{t('register.role.therapist')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              {t('register.password')}
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 ${
                fieldErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
            )}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('register.pw.contains')}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordChecks.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                    {passwordChecks.length ? '✓' : '○'} {t('register.pw.length')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordChecks.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                    {passwordChecks.uppercase ? '✓' : '○'} {t('register.pw.uppercase')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordChecks.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                    {passwordChecks.lowercase ? '✓' : '○'} {t('register.pw.lowercase')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordChecks.number ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}>
                    {passwordChecks.number ? '✓' : '○'} {t('register.pw.number')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              {t('register.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 ${
                fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('register.submitting') : t('register.submit')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {t('register.hasAccount')}{' '}
          </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            {t('register.logIn')}
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            {t('register.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
