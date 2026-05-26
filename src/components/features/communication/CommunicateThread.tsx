'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

export interface ThreadIcon {
  id: string;
  name: string;
  imageUrl?: string;
  symbol?: string;
}

export interface ThreadMessage {
  id: string;
  senderId: string;
  senderName: string | null;
  content: {
    type: 'text' | 'icons';
    text?: string;
    icons?: ThreadIcon[];
    sentence?: string;
  };
  createdAt: string;
}

interface RoomUser {
  userId: string;
  name: string;
  role: string;
}

interface Props {
  currentUserId: string;
  iconLabels: Record<string, string>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onRoomLoaded?: (rooms: RoomUser[]) => void;
  onNewMessage?: () => void;
}

const POLL_MS = 3000;

export default function CommunicateThread({ currentUserId, iconLabels, collapsed = false, onToggleCollapse, onRoomLoaded, onNewMessage }: Props) {
  const [rooms, setRooms] = useState<RoomUser[]>([]);
  const [activeRoom, setActiveRoom] = useState<RoomUser | null>(null);
  const [msgs, setMsgs] = useState<ThreadMessage[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const latestTsRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getLabel = useCallback((icon: ThreadIcon) => iconLabels[icon.id] || icon.name, [iconLabels]);

  // Load paired rooms
  useEffect(() => {
    fetch('/api/messages/room')
      .then((r) => r.json())
      .then((data) => {
        const list: RoomUser[] = data.rooms ?? [];
        setRooms(list);
        if (list.length > 0) setActiveRoom(list[0]);
        onRoomLoaded?.(list);
      })
      .catch(() => {})
      .finally(() => setLoadingRooms(false));
  }, [onRoomLoaded]);

  // Fetch full history when room changes
  const fetchHistory = useCallback(async (roomUserId: string) => {
    const res = await fetch(`/api/messages/room?roomUserId=${roomUserId}&limit=100`);
    if (!res.ok) return;
    const data = await res.json();
    const loaded: ThreadMessage[] = data.messages ?? [];
    setMsgs(loaded);
    latestTsRef.current = loaded.length > 0 ? loaded[loaded.length - 1].createdAt : null;
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    setMsgs([]);
    latestTsRef.current = null;
    fetchHistory(activeRoom.userId);
  }, [activeRoom, fetchHistory]);

  // Poll for new messages
  useEffect(() => {
    if (!activeRoom) return;
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      const since = latestTsRef.current;
      const url = since
        ? `/api/messages/room?roomUserId=${activeRoom.userId}&since=${encodeURIComponent(since)}&limit=20`
        : `/api/messages/room?roomUserId=${activeRoom.userId}&limit=20`;

      const res = await fetch(url).catch(() => null);
      if (!res?.ok) return;
      const data = await res.json();
      const incoming: ThreadMessage[] = data.messages ?? [];
      if (!incoming.length) return;

      setMsgs((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const fresh = incoming.filter((m) => !existingIds.has(m.id));
        if (!fresh.length) return prev;
        latestTsRef.current = fresh[fresh.length - 1].createdAt;
        // Track unread when panel is collapsed
        const fromOthers = fresh.filter((m) => m.senderId !== currentUserId);
        if (fromOthers.length > 0 && collapsed) {
          setUnreadCount((n) => n + fromOthers.length);
          onNewMessage?.();
        }
        return [...prev, ...fresh];
      });
    }, POLL_MS);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeRoom]);

  // Clear unread badge when panel is opened
  useEffect(() => {
    if (!collapsed) setUnreadCount(0);
  }, [collapsed]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  // ── Exposed via ref so parent can push new messages locally ──
  // (optimistic update — parent calls addMessage after a successful POST)
  const addMessage = useCallback((msg: ThreadMessage) => {
    setMsgs((prev) => [...prev, msg]);
    latestTsRef.current = msg.createdAt;
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  }, []);

  // Expose addMessage + activeRoom via a stable callback so the parent page can call it
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__snakkeThread = { addMessage, getActiveRoom: () => activeRoom };
  }, [addMessage, activeRoom]);

  // ── Empty state ──
  if (!loadingRooms && rooms.length === 0) {
    return null; // Hidden when no pairs — page handles empty state
  }

  // ── Collapsed header bar ──
  if (collapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors text-left"
      >
        <span className="text-base">💬</span>
        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {activeRoom ? `You ↔ ${activeRoom.name}` : 'Chat'}
          {msgs.length > 0 && (
            <span className="ml-1.5 text-xs text-gray-400 font-normal">
              · {msgs.length} message{msgs.length !== 1 ? 's' : ''}
            </span>
          )}
        </span>
        {unreadCount > 0 && (
          <span className="shrink-0 bg-primary text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-4.5 text-center">
            {unreadCount}
          </span>
        )}
        <span className="shrink-0 text-gray-400 text-xs">▼ Open</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Room tabs — if paired with multiple users */}
      {rooms.length > 1 && (
        <div className="flex gap-1 px-3 pt-2 pb-0 overflow-x-auto shrink-0">
          {rooms.map((r) => (
            <button
              key={r.userId}
              onClick={() => setActiveRoom(r)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeRoom?.userId === r.userId
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center font-bold text-[10px]">
                {r.name[0]?.toUpperCase() ?? '?'}
              </span>
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Participants bar + close button */}
      {activeRoom && (
        <div className="flex items-center gap-2 px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <span className="font-medium text-gray-700 dark:text-gray-300">You</span>
          <span>↔</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{activeRoom.name}</span>
          <span className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Collapse chat"
              >
                ▲ Close
              </button>
            )}
          </span>
        </div>
      )}

      {/* Message thread */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0"
      >
        {msgs.length === 0 && !loadingRooms && activeRoom && (
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-8">
            No messages yet — build a sentence and tap <strong>Send</strong> to start
          </div>
        )}

        {msgs.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-1 max-w-[80%] ${isMine ? 'items-end' : 'items-start'}`}>
                {/* Sender name for received messages */}
                {!isMine && (
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 px-1">
                    {msg.senderName ?? activeRoom?.name ?? 'Unknown'}
                  </span>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isMine
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {/* Text message */}
                  {msg.content.type === 'text' && (
                    <p className="text-sm leading-relaxed">{msg.content.text}</p>
                  )}

                  {/* Icon / pictogram message */}
                  {msg.content.type === 'icons' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {(msg.content.icons ?? []).map((icon, i) => (
                          <div key={`${icon.id}-${i}`} className="flex flex-col items-center gap-0.5">
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center p-1 ${
                                isMine ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-700'
                              }`}
                            >
                              {icon.imageUrl ? (
                                <Image
                                  src={icon.imageUrl}
                                  alt={getLabel(icon)}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-3xl leading-none">{icon.symbol}</span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] text-center max-w-14 truncate leading-tight ${
                                isMine ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                              }`}
                            >
                              {getLabel(icon)}
                            </span>
                          </div>
                        ))}
                      </div>
                      {msg.content.sentence && (
                        <p
                          className={`text-xs italic leading-relaxed ${
                            isMine ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                          }`}
                        >
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
    </div>
  );
}
