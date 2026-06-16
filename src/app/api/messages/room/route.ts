import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { communicationSessions, messages, pairings, users } from '@/lib/db/schema';
import { eq, or, and, gt, desc } from 'drizzle-orm';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;

// GET /api/messages/room
// Returns the merged conversation thread between the current user and a specific
// paired user (roomUserId). Includes all messages where either party is sender/recipient.
//
// Query params:
//   roomUserId  – UUID of the other participant (required)
//   since       – ISO timestamp for incremental polling (optional)
//   limit       – max messages to return (default 100, max 200)
export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { searchParams } = new URL(request.url);
  const roomUserId = searchParams.get('roomUserId');
  const since = searchParams.get('since');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 200);

  if (!roomUserId) {
    // No room specified — return list of paired users the caller can open a room with
    const rows = await db
      .select({
        pairingId: pairings.id,
        guardianId: pairings.guardianId,
        childId: pairings.childId,
        relationship: pairings.relationship,
        otherName: users.name,
        otherRole: users.role,
      })
      .from(pairings)
      .leftJoin(
        users,
        or(
          and(eq(pairings.guardianId, userId), eq(users.id, pairings.childId)),
          and(eq(pairings.childId, userId), eq(users.id, pairings.guardianId))
        )
      )
      .where(and(eq(pairings.status, 'accepted'), or(eq(pairings.guardianId, userId), eq(pairings.childId, userId))));

    const rooms = await Promise.all(rows.map(async (r) => {
      const otherUserId = r.guardianId === userId ? r.childId : r.guardianId;

      const [latestMessage] = await db
        .select({ createdAt: messages.createdAt })
        .from(messages)
        .where(
          or(
            and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
            and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(1);

      const [latestSession] = await db
        .select({ timestamp: communicationSessions.timestamp })
        .from(communicationSessions)
        .where(eq(communicationSessions.userId, otherUserId))
        .orderBy(desc(communicationSessions.timestamp))
        .limit(1);

      const latestActivityDate = [latestMessage?.createdAt, latestSession?.timestamp]
        .filter((value): value is Date => Boolean(value))
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

      return {
        pairingId: r.pairingId,
        userId: otherUserId,
        name: r.otherName ?? 'Unknown',
        role: r.otherRole ?? 'user',
        relationship: r.relationship,
        pairingRole: r.guardianId === userId ? 'supervisor' : 'supervised',
        isOnline: latestActivityDate ? (Date.now() - latestActivityDate.getTime()) <= ONLINE_WINDOW_MS : false,
        lastActiveAt: latestActivityDate?.toISOString() ?? null,
      };
    }));

    const dedupedRooms = Array.from(
      rooms.reduce((map, room) => {
        const existing = map.get(room.userId);
        if (!existing) {
          map.set(room.userId, room);
          return map;
        }

        const existingTs = existing.lastActiveAt ? Date.parse(existing.lastActiveAt) : 0;
        const roomTs = room.lastActiveAt ? Date.parse(room.lastActiveAt) : 0;

        map.set(
          room.userId,
          {
            ...existing,
            name: existing.name || room.name,
            role: existing.role || room.role,
            relationship: existing.relationship || room.relationship,
            pairingRole: existing.pairingRole,
            isOnline: existing.isOnline || room.isOnline,
            lastActiveAt: roomTs >= existingTs ? room.lastActiveAt : existing.lastActiveAt,
          }
        );

        return map;
      }, new Map<string, (typeof rooms)[number]>()).values()
    );

    dedupedRooms.sort((a, b) => {
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      const aTs = a.lastActiveAt ? Date.parse(a.lastActiveAt) : 0;
      const bTs = b.lastActiveAt ? Date.parse(b.lastActiveAt) : 0;
      if (aTs !== bTs) return bTs - aTs;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ rooms: dedupedRooms });
  }

  // Verify pairing exists
  const [pairing] = await db
    .select({ id: pairings.id })
    .from(pairings)
    .where(
      and(
        eq(pairings.status, 'accepted'),
        or(
          and(eq(pairings.guardianId, userId), eq(pairings.childId, roomUserId)),
          and(eq(pairings.guardianId, roomUserId), eq(pairings.childId, userId))
        )
      )
    )
    .limit(1);

  if (!pairing) {
    return NextResponse.json({ error: 'Not paired with this user' }, { status: 403 });
  }

  const sinceDate = since ? new Date(since) : null;

  const rows = await db
    .select({
      id: messages.id,
      senderId: messages.senderId,
      recipientId: messages.recipientId,
      content: messages.content,
      status: messages.status,
      createdAt: messages.createdAt,
      senderName: users.name,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.senderId))
    .where(
      and(
        or(
          and(eq(messages.senderId, userId), eq(messages.recipientId, roomUserId)),
          and(eq(messages.senderId, roomUserId), eq(messages.recipientId, userId))
        ),
        ...(sinceDate ? [gt(messages.createdAt, sinceDate)] : [])
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  return NextResponse.json({ messages: rows.reverse() });
}
