import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { messages, pairings, users } from '@/lib/db/schema';
import { eq, or, and, gt, desc } from 'drizzle-orm';

// Verify a pairing exists between two users (either direction)
async function isPaired(userA: string, userB: string): Promise<boolean> {
  const [row] = await db
    .select({ id: pairings.id })
    .from(pairings)
    .where(
      and(
        eq(pairings.status, 'active'),
        or(
          and(eq(pairings.guardianId, userA), eq(pairings.childId, userB)),
          and(eq(pairings.guardianId, userB), eq(pairings.childId, userA))
        )
      )
    )
    .limit(1);
  return !!row;
}

// GET /api/messages?withUserId=<uuid>&since=<ISO>&limit=<n>
export async function GET(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const { searchParams } = new URL(request.url);
  const withUserId = searchParams.get('withUserId');
  const since = searchParams.get('since');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

  if (!withUserId) {
    return NextResponse.json({ error: 'withUserId required' }, { status: 400 });
  }

  // Validate pairing
  if (!(await isPaired(userId, withUserId))) {
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
          and(eq(messages.senderId, userId), eq(messages.recipientId, withUserId)),
          and(eq(messages.senderId, withUserId), eq(messages.recipientId, userId))
        ),
        ...(sinceDate ? [gt(messages.createdAt, sinceDate)] : [])
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  // Return in chronological order (oldest first)
  return NextResponse.json({ messages: rows.reverse() });
}

const sendSchema = z.object({
  recipientId: z.string().uuid(),
  content: z.object({
    type: z.enum(['text', 'icons']),
    text: z.string().max(2000).optional(),
    icons: z.array(z.object({
      id: z.string(),
      name: z.string(),
      imageUrl: z.string().optional(),
      symbol: z.string().optional(),
    })).max(50).optional(),
    sentence: z.string().max(500).optional(),
  }),
});

// POST /api/messages — send a message to a paired user
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const body = await request.json().catch(() => ({}));
  const result = sendSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 });
  }

  const { recipientId, content } = result.data;

  // Cannot message yourself
  if (userId === recipientId) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
  }

  // Must be paired
  if (!(await isPaired(userId, recipientId))) {
    return NextResponse.json({ error: 'Not paired with this user' }, { status: 403 });
  }

  const [inserted] = await db
    .insert(messages)
    .values({
      senderId: userId,
      recipientId,
      content,
      status: 'sent',
    })
    .returning();

  return NextResponse.json({ message: inserted }, { status: 201 });
}
