import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { messages, pairings, users } from '@/lib/db/schema';
import { eq, or, and, gt, desc } from 'drizzle-orm';

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
        role: pairings.status,
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

    const rooms = rows.map((r) => ({
      userId: r.guardianId === userId ? r.childId : r.guardianId,
      name: r.otherName ?? 'Unknown',
      role: r.otherRole ?? 'user',
    }));

    return NextResponse.json({ rooms });
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
