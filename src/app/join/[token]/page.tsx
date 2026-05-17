'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: 'Parent / Guardian',
  therapist: 'Therapist',
  teacher: 'Teacher',
  researcher: 'Researcher',
  caregiver: 'Caregiver',
};

export default function JoinPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [relationship, setRelationship] = useState('therapist');
  const [shareHistory, setShareHistory] = useState(false);
  const [shareStats, setShareStats] = useState(false);
  const [allowExport, setAllowExport] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Validate token looks reasonable (basic guard)
  useEffect(() => {
    if (!token || token.length < 10) {
      setError('Invalid invite link.');
    }
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
      setTimeout(() => router.push('/dashboard/patients'), 2500);
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to your patients page…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🤝</div>
          <h1 className="text-2xl font-bold">You&apos;ve been invited</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Someone wants to connect with you on Pictalk. Review and choose what you&apos;re comfortable sharing before accepting.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-5">
            {error}
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
