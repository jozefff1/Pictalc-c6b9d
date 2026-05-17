'use client';

import { useState } from 'react';
import Link from 'next/link';

interface OtherUser {
  id: string;
  name: string;
  role: string;
}

interface PairingRow {
  id: string;
  guardianId: string;
  childId: string;
  status: string;
  relationship: string;
  shareHistory: boolean;
  shareStats: boolean;
  allowExport: boolean;
  consentAt: string | null;
  createdAt: string;
  role: 'supervisor' | 'supervised';
  otherUser: OtherUser | null;
}

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: 'Parent',
  therapist: 'Therapist',
  teacher: 'Teacher',
  researcher: 'Researcher',
  caregiver: 'Caregiver',
};

export default function PatientsPage() {
  const [pairingsList, setPairingsList] = useState<PairingRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Invite modal state
  const [showInvite, setShowInvite] = useState(false);
  const [relationship, setRelationship] = useState<string>('therapist');
  const [inviteResult, setInviteResult] = useState<{ inviteUrl: string; expiresAt: string } | null>(null);
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Remove pairing
  const [removing, setRemoving] = useState<string | null>(null);

  const loadPairings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pairings');
      const data = await res.json();
      setPairingsList(data.pairings ?? []);
    } catch {
      setPairingsList([]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  // Load on first render
  if (!fetched && !loading) {
    loadPairings();
  }

  const handleGenerateInvite = async () => {
    setInviting(true);
    try {
      const res = await fetch('/api/pairings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship }),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteResult({ inviteUrl: data.inviteUrl, expiresAt: data.expiresAt });
      }
    } finally {
      setInviting(false);
    }
  };

  const handleCopy = () => {
    if (inviteResult) {
      navigator.clipboard.writeText(inviteResult.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemove = async (pairingId: string) => {
    setRemoving(pairingId);
    try {
      await fetch(`/api/pairings/${pairingId}`, { method: 'DELETE' });
      setPairingsList((prev) => prev?.filter((p) => p.id !== pairingId) ?? []);
    } finally {
      setRemoving(null);
    }
  };

  const supervisorPairings = pairingsList?.filter((p) => p.role === 'supervisor') ?? [];
  const supervisedBy = pairingsList?.filter((p) => p.role === 'supervised') ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Patients &amp; Participants</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage who you monitor and who can see your data
          </p>
        </div>
        <button
          onClick={() => { setShowInvite(true); setInviteResult(null); }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
        >
          + Invite Participant
        </button>
      </div>

      {/* ── Supervised patients (I am the supervisor) ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          My Patients / Participants
        </h2>

        {loading && (
          <div className="text-sm text-gray-400 py-8 text-center">Loading…</div>
        )}

        {!loading && supervisorPairings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium text-gray-600 dark:text-gray-400">No participants yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Click &ldquo;Invite Participant&rdquo; to generate a link for a child or patient.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {supervisorPairings.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {p.otherUser?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.otherUser?.name ?? 'Unknown'}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 capitalize">
                    {p.otherUser?.role ?? 'user'}
                  </span>
                  <span className="text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5">
                    {RELATIONSHIP_LABELS[p.relationship] ?? p.relationship}
                  </span>
                  {p.shareHistory && (
                    <span className="text-xs rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5">
                      History shared
                    </span>
                  )}
                  {p.allowExport && (
                    <span className="text-xs rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5">
                      Export allowed
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {p.shareHistory && (
                  <Link
                    href={`/dashboard/patients/${p.childId}`}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    View
                  </Link>
                )}
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={removing === p.id}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {removing === p.id ? '…' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── People who can see my data ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          People With Access to My Data
        </h2>

        {!loading && supervisedBy.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
            No one currently has access to your communication data.
          </p>
        )}

        <div className="space-y-3">
          {supervisedBy.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-500 shrink-0">
                {p.otherUser?.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.otherUser?.name ?? 'Unknown'}</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 capitalize">
                    {p.otherUser?.role ?? 'user'}
                  </span>
                  <span className="text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5">
                    {RELATIONSHIP_LABELS[p.relationship] ?? p.relationship}
                  </span>
                </div>
                {/* Privacy summary */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <PrivacyBadge label="Session history" on={p.shareHistory} />
                  <PrivacyBadge label="Usage stats" on={p.shareStats} />
                  <PrivacyBadge label="Export" on={p.allowExport} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/patients/${p.childId}/privacy?pairing=${p.id}`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit Privacy
                </Link>
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={removing === p.id}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {removing === p.id ? '…' : 'Revoke'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Invite modal ── */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-1">Invite a Participant</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Share this link with the patient or their parent. They will choose exactly what data to share when they accept.
            </p>

            {!inviteResult ? (
              <>
                <label className="block text-sm font-medium mb-1">Your role / relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="therapist">Therapist</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="teacher">Teacher</option>
                  <option value="researcher">Researcher</option>
                  <option value="caregiver">Caregiver</option>
                </select>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInvite(false)}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateInvite}
                    disabled={inviting}
                    className="flex-1 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    {inviting ? 'Generating…' : 'Generate Link'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 mb-3 flex items-center gap-2">
                  <span className="flex-1 text-xs text-gray-600 dark:text-gray-300 break-all font-mono">
                    {inviteResult.inviteUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg bg-primary text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  Expires {new Date(inviteResult.expiresAt).toLocaleDateString()}. Valid for 7 days.
                </p>
                <button
                  onClick={() => { setShowInvite(false); setInviteResult(null); }}
                  className="w-full rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PrivacyBadge({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={`text-xs rounded-full px-2 py-0.5 ${
        on
          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 line-through'
      }`}
    >
      {label}
    </span>
  );
}
