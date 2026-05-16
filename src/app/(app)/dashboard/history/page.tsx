'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addIconToSentence, clearSentence } from '@/store/slices/communicationSlice';
import { useRouter } from 'next/navigation';
import type { Icon } from '@/types/models';

interface CommunicationSession {
  id: string;
  userId: string;
  icons: Icon[];
  sentence: string;
  timestamp: string;
}

interface PairedUser {
  id: string;
  name: string;
  role: string;
  pairingRelationship: string;
}

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [sessions, setSessions] = useState<CommunicationSession[]>([]);
  const [pairedUsers, setPairedUsers] = useState<PairedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [replayedId, setReplayedId] = useState<string | null>(null);

  const loadSessions = useCallback(async (userId?: string) => {
    setLoading(true);
    try {
      const url = userId ? `/api/sessions?userId=${userId}` : '/api/sessions';
      const res = await fetch(url);
      const data = await res.json();
      setSessions(data.sessions ?? []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: check role and load paired users if supervisor
  useEffect(() => {
    async function init() {
      // Fetch paired users — if the list is non-empty, this is a supervisor account
      const pairedRes = await fetch('/api/sessions/paired-users');
      const pairedData = await pairedRes.json();
      const users: PairedUser[] = pairedData.users ?? [];
      setPairedUsers(users);

      if (users.length > 0) {
        setIsSupervisor(true);
        setSelectedUserId(users[0].id);
        setSelectedUserName(users[0].name);
        await loadSessions(users[0].id);
      } else {
        // Child / standalone user — show own history
        await loadSessions();
      }
    }
    init();
  }, [loadSessions]);

  const handleUserChange = async (userId: string) => {
    const user = pairedUsers.find((u) => u.id === userId);
    setSelectedUserId(userId);
    setSelectedUserName(user?.name ?? '');
    await loadSessions(userId);
  };

  const handleReplay = (session: CommunicationSession) => {
    dispatch(clearSentence());
    session.icons.forEach((icon) => dispatch(addIconToSentence(icon)));
    setReplayedId(session.id);
    // Give visual feedback then navigate to communicate
    setTimeout(() => router.push('/communicate'), 800);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  // Group sessions by date
  const grouped = sessions.reduce<Record<string, CommunicationSession[]>>((acc, s) => {
    const key = formatDate(s.timestamp);
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Back to dashboard"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Communication History
          </h1>
        </div>

        {/* Patient / child selector (supervisor only) */}
        {isSupervisor && pairedUsers.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Viewing history for
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {pairedUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.pairingRelationship})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && sessions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No sessions yet</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
              {isSupervisor
                ? `${selectedUserName} hasn't spoken any sentences yet.`
                : 'Start communicating and your sentences will be saved here.'}
            </p>
          </div>
        )}

        {/* Sessions grouped by date */}
        {!loading && Object.entries(grouped).map(([date, daySessions]) => (
          <div key={date} className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">
              {date}
            </h2>
            <div className="flex flex-col gap-3">
              {daySessions.map((s) => (
                <div
                  key={s.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
                    replayedId === s.id
                      ? 'border-primary shadow-md scale-[0.99]'
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="p-4">
                    {/* Time + sentence */}
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug flex-1 pr-4">
                        &ldquo;{s.sentence}&rdquo;
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {formatTime(s.timestamp)}
                      </span>
                    </div>

                    {/* Icon chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {s.icons.map((icon, idx) => (
                        <div
                          key={`${icon.id}-${idx}`}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                        >
                          {icon.imageUrl ? (
                            <img
                              src={icon.imageUrl}
                              alt={icon.name}
                              width={20}
                              height={20}
                              className="object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-base leading-none">{(icon as Icon & { symbol?: string }).symbol}</span>
                          )}
                          <span className="text-xs text-gray-700 dark:text-gray-300">{icon.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Replay button */}
                    <button
                      onClick={() => handleReplay(s)}
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      <span>▶</span> Replay in communicator
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
