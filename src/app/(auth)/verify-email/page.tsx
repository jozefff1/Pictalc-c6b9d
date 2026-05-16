'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

type State = 'pending' | 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

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
              Check your inbox
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              We sent a verification link to
            </p>
            {email && (
              <p className="font-semibold text-primary mb-4">{email}</p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Click the link in the email to activate your account. The link expires in 24 hours.
            </p>
            <p className="text-gray-400 text-xs">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <Link href="/register" className="text-primary underline">
                register again
              </Link>
              .
            </p>
          </>
        )}

        {state === 'verifying' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Verifying your email…
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please wait a moment.
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Email verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account is now active. You can sign in to Pictalk.
            </p>
            <Link
              href="/login?verified=true"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Verification failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <Link
              href="/register"
              className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Register again
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
