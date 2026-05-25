'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type State = 'pending' | 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const callbackUrl = searchParams.get('callbackUrl') ?? '';

  const [state, setState] = useState<State>(token ? 'verifying' : 'pending');
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setState('error');
          setMessage(data.error);
        } else {
          setState('success');
        }
      })
      .catch(() => {
        setState('error');
        setMessage('Network error. Please try again.');
      });
  }, [token]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <div className="text-5xl mb-6">
          {state === 'pending' && '📬'}
          {state === 'verifying' && '⏳'}
          {state === 'success' && '✅'}
          {state === 'error' && '❌'}
        </div>

        {state === 'pending' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('verifyEmail.pending.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t('verifyEmail.pending.sent')}
            </p>
            {email && (
              <p className="font-semibold text-primary mb-4">{email}</p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              {t('verifyEmail.pending.desc')}
            </p>
            <p className="text-gray-400 text-xs">
              {t('verifyEmail.pending.notReceived')}{' '}
              <Link href="/register" className="text-primary underline">
                {t('verifyEmail.pending.registerAgain')}
              </Link>
              .
            </p>
          </>
        )}

        {state === 'verifying' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('verifyEmail.verifying.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('verifyEmail.verifying.wait')}
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('verifyEmail.success.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('verifyEmail.success.desc')}
            </p>
            <Link
              href={`/login?verified=true${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('verifyEmail.success.cta')}
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t('verifyEmail.error.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <Link
              href="/register"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('verifyEmail.error.cta')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Loading…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
