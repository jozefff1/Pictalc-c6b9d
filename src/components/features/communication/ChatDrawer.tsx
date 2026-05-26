'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIconLabels } from '@/hooks/useIconLabels';

interface Icon {
  id: string;
  name: string;
  imageUrl?: string;
  symbol?: string;
}

interface MessageContent {
  type: 'text' | 'icons';
  text?: string;
  icons?: Icon[];
  sentence?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string | null;
  content: MessageContent;
  createdAt: string;
}

interface PairedUser {
  id: string;
  name: string | null;
  role: string;
  pairingRole: 'supervisor' | 'supervised';
}

interface Props {
  currentUserId: string;
  onClose: () => void;
}

const POLL_INTERVAL = 3000; // 3 seconds

export default function ChatDrawer({ currentUserId, onClose }: Props) {
  const { t, language } = useLanguage();
  const { labels } = useIconLabels(language);

  // Current sentence from Redux store
  const sentence = useAppSelector((state) => state.communication.sentence) as Icon[];

  const [pairedUsers, setPairedUsers] = useState<PairedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PairedUser | null>(null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingPaired, setLoadingPaired] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestTimestampRef = useRef<string | null>(null);

  // Load paired users on mount
  useEffect(() => {
    fetch('/api/pairings')
      .then((r) => r.json())
      .then((data) => {
        const list: PairedUser[] = (data.pairings ?? []).map((p: {
          guardianId: string; childId: string;
          role: string; otherUser: { id: string; name: string; role: string } | null
        }) => ({
          id: p.otherUser?.id ?? (p.role === 'supervisor' ? p.childId : p.guardianId),
          name: p.otherUser?.name ?? 'Unknown',
          role: p.otherUser?.role ?? 'user',
          pairingRole: p.role as 'supervisor' | 'supervised',
        }));
        setPairedUsers(list);
        if (list.length === 1) setSelectedUser(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoadingPaired(false));
  }, []);

  // Fetch full history when selected user changes
  const fetchHistory = useCallback(async (userId: string) => {
    const res = await fetch(`/api/messages?withUserId=${userId}&limit=50`);
    if (!res.ok) return;
    const data = await res.json();
    const loaded: ChatMessage[] = data.messages ?? [];
    setMsgs(loaded);
    if (loaded.length > 0) {
      latestTimestampRef.current = loaded[loaded.length - 1].createdAt;
    }
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    setMsgs([]);
    latestTimestampRef.current = null;
    fetchHistory(selectedUser.id);
  }, [selectedUser, fetchHistory]);

  // Poll for new messages
  useEffect(() => {
    if (!selectedUser) return;
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      const since = latestTimestampRef.current;
      const url = since
        ? `/api/messages?withUserId=${selectedUser.id}&since=${encodeURIComponent(since)}&limit=20`
        : `/api/messages?withUserId=${selectedUser.id}&limit=20`;
      const res = await fetch(url).catch(() => null);
      if (!res?.ok) return;
      const data = await res.json();
      const incoming: ChatMessage[] = data.messages ?? [];
      if (incoming.length === 0) return;
      setMsgs((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newOnes = incoming.filter((m) => !existingIds.has(m.id));
        if (newOnes.length === 0) return prev;
        latestTimestampRef.current = newOnes[newOnes.length - 1].createdAt;
        return [...prev, ...newOnes];
      });
    }, POLL_INTERVAL);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  const getIconLabel = (icon: Icon) => labels[icon.id] || icon.name;

  const sendMessage = async (content: MessageContent) => {
    if (!selectedUser) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: selectedUser.id, content }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const newMsg: ChatMessage = {
        ...data.message,
        senderName: null, // own message — we know who it is
      };
      setMsgs((prev) => [...prev, newMsg]);
      latestTimestampRef.current = newMsg.createdAt;
    } finally {
      setSending(false);
    }
  };

  const handleSendIcons = async () => {
    if (sentence.length === 0 || !selectedUser) return;
    const sentenceText = sentence.map(getIconLabel).join(' ');
    await sendMessage({
      type: 'icons',
      icons: sentence.map((ic) => ({ id: ic.id, name: ic.name, imageUrl: ic.imageUrl, symbol: ic.symbol })),
      sentence: sentenceText,
    });
  };

  const handleSendText = async () => {
    const text = replyText.trim();
    if (!text || !selectedUser) return;
    await sendMessage({ type: 'text', text });
    setReplyText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // ── Render ──────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-full md:w-80 lg:w-96">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <span className="font-semibold text-sm">Chat</span>
          {selectedUser && (
            <span className="text-xs text-gray-500 dark:text-gray-400">· {selectedUser.name}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 text-sm"
        >
          ✕
        </button>
      </div>

      {/* User picker (if multiple paired users) */}
      {pairedUsers.length > 1 && (
        <div className="flex gap-2 px-3 py-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700 shrink-0">
          {pairedUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUser(u)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedUser?.id === u.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {u.name?.[0]?.toUpperCase() ?? '?'}
              </span>
              {u.name}
            </button>
          ))}
        </div>
      )}

      {/* No paired users */}
      {!loadingPaired && pairedUsers.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3">
          <div className="text-4xl">🔗</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No paired users yet. Go to{' '}
            <a href="/dashboard/patients" className="text-primary hover:underline">
              Patients
            </a>{' '}
            to send an invite.
          </p>
        </div>
      )}

      {/* Select a user prompt */}
      {!loadingPaired && pairedUsers.length > 1 && !selectedUser && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-sm text-gray-400">Select a person above to start chatting</p>
        </div>
      )}

      {/* Message thread */}
      {selectedUser && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0"
          >
            {msgs.length === 0 && (
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-6">
                No messages yet. Send your first sentence!
              </div>
            )}

            {msgs.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    {/* Sender label for received messages */}
                    {!isMine && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                        {msg.senderName ?? selectedUser.name}
                      </span>
                    )}

                    <div
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        isMine
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                      }`}
                    >
                      {msg.content.type === 'text' && (
                        <span>{msg.content.text}</span>
                      )}

                      {msg.content.type === 'icons' && (
                        <div className="flex flex-col gap-1.5">
                          {/* Icon row */}
                          <div className="flex flex-wrap gap-1.5">
                            {(msg.content.icons ?? []).map((icon, i) => (
                              <div key={`${icon.id}-${i}`} className="flex flex-col items-center gap-0.5">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isMine ? 'bg-white/20' : 'bg-white dark:bg-gray-700'}`}>
                                  {icon.imageUrl ? (
                                    <Image
                                      src={icon.imageUrl}
                                      alt={icon.name}
                                      width={36}
                                      height={36}
                                      className="object-contain"
                                    />
                                  ) : (
                                    <span className="text-xl">{icon.symbol}</span>
                                  )}
                                </div>
                                <span className={`text-[9px] text-center leading-tight max-w-[40px] truncate ${isMine ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                  {labels[icon.id] || icon.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          {/* Sentence text below icons */}
                          {msg.content.sentence && (
                            <p className={`text-xs italic ${isMine ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                              &ldquo;{msg.content.sentence}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2 shrink-0">
            {/* Send current sentence as icons */}
            {sentence.length > 0 && (
              <button
                onClick={handleSendIcons}
                disabled={sending}
                className="w-full rounded-xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary text-sm font-medium px-3 py-2 transition-colors disabled:opacity-50 flex items-center justify-between gap-2"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>📤</span>
                  <span className="truncate">
                    Send: &ldquo;{sentence.map(getIconLabel).join(' ')}&rdquo;
                  </span>
                </span>
                <span className="shrink-0 text-xs bg-primary text-white rounded-lg px-2 py-0.5">
                  {sending ? '…' : 'Send'}
                </span>
              </button>
            )}

            {/* Text reply */}
            <div className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a reply…"
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendText}
                disabled={!replyText.trim() || sending}
                className="rounded-xl bg-primary text-white px-3 py-2 text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40"
              >
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
