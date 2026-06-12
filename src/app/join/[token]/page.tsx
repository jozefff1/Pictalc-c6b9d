'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { RELATIONSHIP_LABELS } from '@/lib/utils/labels';

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [relationship, setRelationship] = useState('therapist');
  const [shareHistory, setShareHistory] = useState(false);
  const [shareStats, setShareStats] = useState(false);
  const [allowExport, setAllowExport] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Invite info prefetched from public endpoint
  const [inviteInfo, setInviteInfo] = useState<{
    requesterName: string;
    invitedEmailMasked: string | null;
    invitedEmailFull: string | null;
  } | null>(null);

  // Fetch invite info as soon as we have a valid token
  useEffect(() => {
    if (!token || token.length < 10) {
      setError('Invalid invite link.');
      return;
    }
    fetch(`/api/pairings/invite/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setInviteInfo({
            requesterName: data.requesterName,
            invitedEmailMasked: data.invitedEmailMasked,
            invitedEmailFull: data.invitedEmailFull,
          });
        } else if (data.error) {
          setError(data.error);
        }
      })
      .catch(() => {/* non-critical — proceed without prefetch info */});
  }, [token]);

  const handleAccept = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/pairings/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, relationship, shareHistory, shareStats, allowExport }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }
      setDone(true);
      const destination = data.isSupervisorRole && data.requesterId
        ? `/dashboard/patients/${data.requesterId}`
        : '/dashboard/patients';
      setTimeout(() => router.push(destination), 2500);
    } catch {
      setError('Network error — please try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold mb-2">Pairing accepted!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting you to the communication page…</p>
        </div>
      </div>
    );
  }

  // Not yet authenticated — prompt sign-in / register with callback
  if (status === 'unauthenticated') {
    const callbackUrl = encodeURIComponent(`/join/${token}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🤝</div>
          <h1 className="text-xl font-bold mb-2">You&apos;ve been invited to Snakke</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Sign in or create a free account to accept this invitation.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href={`/login?callbackUrl=${callbackUrl}`}
              className="w-full rounded-xl bg-primary text-white px-5 py-3 font-semibold text-center hover:opacity-90 transition-all"
            >
              Sign in
            </Link>
            <Link
              href={`/register?callbackUrl=${callbackUrl}`}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3 font-medium text-center text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Still loading session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-sm text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Signed-in user banner */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 px-3 py-2 mb-5 text-sm">
          <span className="text-gray-500 dark:text-gray-400 truncate">
            Signed in as <strong className="text-gray-800 dark:text-gray-200">{session?.user?.email}</strong>
          </span>
          <a
            href={`/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`}
            onClick={async (e) => { e.preventDefault(); const { signOut } = await import('next-auth/react'); await signOut({ redirect: false }); window.location.href = `/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`; }}
            className="ml-3 shrink-0 text-xs text-primary hover:underline"
          >
            Switch account
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold">You&apos;ve been invited</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {inviteInfo
              ? <><strong>{inviteInfo.requesterName}</strong> wants to connect with you on Snakke.</>
              : <>Someone wants to connect with you on Snakke.</>}{' '}
            Review and choose what you&apos;re comfortable sharing before accepting.
          </p>
        </div>

        {/* Email mismatch warning */}
        {inviteInfo?.invitedEmailFull &&
          session?.user?.email &&
          inviteInfo.invitedEmailFull.toLowerCase().trim() !== session.user.email.toLowerCase().trim() && (
          <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200 mb-5 flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>
              This invite was sent to <strong>{inviteInfo.invitedEmailMasked}</strong>, but you&apos;re signed in as{' '}
              <strong>{session.user.email}</strong>. Please{' '}
              <a
                href={`/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`}
                onClick={async (e) => { e.preventDefault(); const { signOut } = await import('next-auth/react'); await signOut({ redirect: false }); window.location.href = `/login?callbackUrl=${encodeURIComponent(`/join/${token}`)}`; }}
                className="underline font-semibold hover:opacity-80"
              >
                switch to the correct account
              </a>{' '}
              to accept this invite.
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-5">
            {error === 'You cannot accept your own invite'
              ? 'This invite was generated by your own account. Share the link with the person you want to connect with — they need to open it while logged in as themselves.'
              : error}
          </div>
        )}

        {/* Relationship */}
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1.5">
            Their role / your relationship with them
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {Object.entries(RELATIONSHIP_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        {/* Privacy consent */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            🔒 Choose what to share
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            All options are off by default. You can change these at any time from your privacy settings. Private sessions are never shared regardless of these settings.
          </p>

          <ConsentToggle
            id="shareHistory"
            label="Share session history"
            description="They can see the sentences and icons you use during shared sessions"
            checked={shareHistory}
            onChange={setShareHistory}
          />
          <ConsentToggle
            id="shareStats"
            label="Share usage statistics"
            description="They can see which icons and words you use most often"
            checked={shareStats}
            onChange={setShareStats}
          />
          <ConsentToggle
            id="allowExport"
            label="Allow data export for research"
            description="They can download an anonymised CSV of your shared sessions. Your name is never included."
            checked={allowExport}
            onChange={setAllowExport}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={submitting}
            className="w-full rounded-xl bg-primary text-white px-5 py-3 font-semibold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {submitting ? 'Accepting…' : 'Accept Pairing'}
          </button>
          <Link
            href="/dashboard"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-5 py-3 font-medium text-center text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Decline
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConsentToggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-6 rounded-full bg-gray-200 dark:bg-gray-700 peer-checked:bg-primary transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-relaxed">{description}</div>
      </div>
    </label>
  );
}
