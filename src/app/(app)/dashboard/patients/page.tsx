'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { RELATIONSHIP_LABELS } from '@/lib/utils/labels';
import QRCodeModal from '@/components/features/pairing/QRCodeModal';

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

export default function PatientsPage() {
  const { t } = useLanguage();
  const [pairingsList, setPairingsList] = useState<PairingRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // Invite modal state
  const [showInvite, setShowInvite] = useState(false);
  const [relationship, setRelationship] = useState<string>('therapist');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState<{ inviteUrl: string; expiresAt: string; emailSent?: boolean } | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Remove pairing
  const [removing, setRemoving] = useState<string | null>(null);

  // Pending invites addressed to this user
  const [pendingInvites, setPendingInvites] = useState<{
    id: string; token: string; requesterName: string | null; requesterEmail: string | null; expiresAt: string;
  }[]>([]);
  const [declining, setDeclining] = useState<string | null>(null);

  // QR pairing modal
  const [showQR, setShowQR] = useState(false);

  const loadPairings = async () => {
    setLoading(true);
    try {
      const [pairingsRes, pendingRes] = await Promise.all([
        fetch('/api/pairings'),
        fetch('/api/pairings/pending'),
      ]);
      const pairingsData = await pairingsRes.json();
      const pendingData = await pendingRes.json();
      setPairingsList(pairingsData.pairings ?? []);
      setPendingInvites(pendingData.pendingInvites ?? []);
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
    setInviteError(null);
    try {
      const body: Record<string, string> = { relationship };
      if (inviteEmail.trim()) body.email = inviteEmail.trim();
      const res = await fetch('/api/pairings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setInviteResult({ inviteUrl: data.inviteUrl, expiresAt: data.expiresAt, emailSent: data.emailSent });
      } else {
        setInviteError(data.error ?? 'Failed to create invite. Please try again.');
      }
    } catch {
      setInviteError('Network error while creating invite. Please try again.');
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

  const handleDecline = async (token: string) => {
    setDeclining(token);
    try {
      await fetch('/api/pairings/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setPendingInvites((prev) => prev.filter((i) => i.token !== token));
    } finally {
      setDeclining(null);
    }
  };

  const supervisorPairings = pairingsList?.filter((p) => p.role === 'supervisor') ?? [];
  const supervisedBy = pairingsList?.filter((p) => p.role === 'supervised') ?? [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{t('patients.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('patients.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            title="Show QR code for quick pairing"
          >
            <span className="text-base leading-none">⬛</span> QR Code
          </button>
          <button
            onClick={() => { setShowInvite(true); setInviteResult(null); setInviteEmail(''); setInviteError(null); }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            {t('patients.invite')}
          </button>
        </div>
      </div>

      {/* ── Pending invitations addressed to you ── */}
      {pendingInvites.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center gap-2">
            📩 Pending invitations for you
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
              {pendingInvites.length}
            </span>
          </h2>
          <div className="space-y-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg shrink-0">
                  🤝
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {invite.requesterName ?? 'Someone'} wants to connect with you
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/join/${invite.token}`}
                    className="rounded-lg px-3 py-1.5 text-sm font-semibold bg-primary text-white hover:opacity-90 transition-all"
                  >
                    Accept
                  </a>
                  <button
                    onClick={() => handleDecline(invite.token)}
                    disabled={declining === invite.token}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    {declining === invite.token ? '…' : 'Decline'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Supervised patients (I am the supervisor) ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          {t('patients.mine')}
        </h2>

        {loading && (
          <div className="text-sm text-gray-400 py-8 text-center">{t('patients.loading')}</div>
        )}

        {!loading && supervisorPairings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium text-gray-600 dark:text-gray-400">{t('patients.empty')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {t('patients.empty.desc')}
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
                      {t('patients.historyShared')}
                    </span>
                  )}
                  {p.allowExport && (
                    <span className="text-xs rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5">
                      {t('patients.exportAllowed')}
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
                    {t('patients.view')}
                  </Link>
                )}
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={removing === p.id}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {removing === p.id ? '…' : t('patients.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── People who can see my data ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
          {t('patients.accessTitle')}
        </h2>

        {!loading && supervisedBy.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
            {t('patients.noAccess')}
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
                  {t('patients.editPrivacy')}
                </Link>
                <button
                  onClick={() => handleRemove(p.id)}
                  disabled={removing === p.id}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                >
                  {removing === p.id ? '…' : t('patients.revoke')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QR pairing modal ── */}
      {showQR && <QRCodeModal onClose={() => setShowQR(false)} />}

      {/* ── Invite modal ── */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-1">{t('patients.modal.title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {t('patients.modal.subtitle')}
            </p>

            {!inviteResult ? (
              <>
                <label className="block text-sm font-medium mb-1">{t('patients.modal.role')}</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="therapist">Therapist</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="teacher">Teacher</option>
                  <option value="researcher">Researcher</option>
                  <option value="caregiver">Caregiver</option>
                </select>

                <label className="block text-sm font-medium mb-1">
                  {t('patients.modal.emailLabel')} <span className="text-gray-400 font-normal">{t('patients.modal.emailOptional')}</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Leave email empty for open link/QR pairing. Add an email to lock acceptance to that account in legacy mode.
                </p>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder={t('patients.modal.emailPlaceholder')}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowInvite(false)}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t('patients.modal.cancel')}
                  </button>
                  <button
                    onClick={handleGenerateInvite}
                    disabled={inviting}
                    className="flex-1 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
                  >
                    {inviting ? t('patients.modal.generating') : t('patients.modal.generate')}
                  </button>
                </div>
                {inviteError && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400">{inviteError}</p>
                )}
              </>
            ) : (
              <>
                {inviteResult.emailSent && inviteEmail && (
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 mb-4 text-sm text-green-700 dark:text-green-300">
                    ✓ {t('patients.modal.emailSent')} <strong>{inviteEmail}</strong>
                  </div>
                )}
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 mb-3 flex items-center gap-2">
                  <span className="flex-1 text-xs text-gray-600 dark:text-gray-300 break-all font-mono">
                    {inviteResult.inviteUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg bg-primary text-white px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-all"
                  >
                    {copied ? t('patients.modal.copied') : t('patients.modal.copy')}
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  {t('patients.modal.expires')} {new Date(inviteResult.expiresAt).toLocaleDateString()}. {t('patients.modal.expiry')}
                </p>
                <button
                  onClick={() => { setShowInvite(false); setInviteResult(null); }}
                  className="w-full rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-all"
                >
                  {t('patients.modal.done')}
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
