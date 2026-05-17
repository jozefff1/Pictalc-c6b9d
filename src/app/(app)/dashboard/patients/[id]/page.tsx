'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SessionRow {
  id: string;
  sentence: string;
  icons: { id: string; name: string; symbol?: string }[];
  timestamp: string;
  taskType: string;
}

interface PatientData {
  patient: { name: string; role: string } | null;
  permissions: { shareHistory: boolean; shareStats: boolean; allowExport: boolean };
  sessions: SessionRow[];
  total: number;
}

// Top-N icon frequency from session list
function topIcons(sessions: SessionRow[], n = 10) {
  const freq: Record<string, { name: string; count: number }> = {};
  for (const s of sessions) {
    for (const icon of s.icons) {
      if (!freq[icon.id]) freq[icon.id] = { name: icon.name, count: 0 };
      freq[icon.id].count++;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, n)
    .map(([id, { name, count }]) => ({ id, name, count }));
}

export default function PatientDetailPage() {
  const { id: patientId } = useParams<{ id: string }>();
  const [data, setData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'history' | 'stats'>('history');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch(`/api/patients/${patientId}/sessions`)
      .then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(d.error ?? 'Failed'));
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(typeof e === 'string' ? e : 'Failed to load sessions'));
  }, [patientId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/sessions?export=csv`);
      if (!res.ok) {
        const d = await res.json();
        alert(d.error ?? 'Export failed');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pictalk-participant-${patientId.slice(0, 8)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-xl font-bold mb-2">Access restricted</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <Link href="/dashboard/patients" className="text-primary hover:underline text-sm">
          ← Back to Patients
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16 text-center text-gray-400">
        Loading…
      </div>
    );
  }

  const top = topIcons(data.sessions);
  const maxCount = top[0]?.count ?? 1;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <Link href="/dashboard/patients" className="mt-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
          ←
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              {data.patient?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{data.patient?.name ?? 'Patient'}</h1>
              <span className="text-xs capitalize text-gray-500 dark:text-gray-400">{data.patient?.role ?? 'user'}</span>
            </div>
          </div>
        </div>
        {data.permissions.allowExport && (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {exporting ? 'Exporting…' : '↓ Export CSV'}
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{data.total}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shared sessions</div>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{top.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique icons</div>
        </div>
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {data.sessions.length > 0
              ? Math.round(data.sessions.reduce((a, s) => a + s.icons.length, 0) / data.sessions.length)
              : 0}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Avg icons/session</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {(['history', 'stats'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t === 'history' ? 'Session History' : 'Icon Usage'}
          </button>
        ))}
      </div>

      {/* Session history */}
      {tab === 'history' && (
        <div className="space-y-3">
          {data.sessions.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <div className="text-4xl mb-3">📋</div>
              <p>No shared sessions yet.</p>
              <p className="text-sm mt-1">The patient needs to mark sessions as shared for them to appear here.</p>
            </div>
          )}
          {data.sessions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">{s.sentence}</p>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {s.taskType !== 'free' && (
                    <span className="text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-2 py-0.5 capitalize">
                      {s.taskType}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {s.icons.slice(0, 12).map((icon, i) => (
                  <span
                    key={i}
                    className="text-xs rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-gray-600 dark:text-gray-400"
                  >
                    {icon.symbol ? `${icon.symbol} ` : ''}{icon.name}
                  </span>
                ))}
                {s.icons.length > 12 && (
                  <span className="text-xs text-gray-400">+{s.icons.length - 12} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Icon usage stats */}
      {tab === 'stats' && (
        <div>
          {top.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <div className="text-4xl mb-3">📊</div>
              <p>No data yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {top.map(({ id, name, count }) => (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-gray-700 dark:text-gray-300 truncate shrink-0">{name}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-8 text-right shrink-0">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
