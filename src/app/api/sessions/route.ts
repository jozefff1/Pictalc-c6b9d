import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { db } from '@/lib/db/client';
import { communicationSessions, pairings } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const sessionSchema = z.object({
  icons: z.array(z.object({
    id: z.string(),
    name: z.string(),
    symbol: z.string().optional(),
    imageUrl: z.string().optional(),
    category: z.string(),
    color: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })).min(1),
  sentence: z.string().min(1),
  visibility: z.enum(['private', 'shared']).default('private'),
  taskType: z.enum(['free', 'structured', 'assessment']).default('free'),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const result = sessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid session data', details: result.error.issues },
        { status: 400 }
      );
    }

    const [newSession] = await db
      .insert(communicationSessions)
      .values({
        userId: userId,
        icons: result.data.icons,
        sentence: result.data.sentence,
        visibility: result.data.visibility,
        taskType: result.data.taskType,
        synced: true,
      })
      .returning({ id: communicationSessions.id });

    return NextResponse.json({ sessionId: newSession.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/sessions');
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId: currentUserId } = authResult;

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');

    if (targetUserId && targetUserId !== currentUserId) {
      // Verify a valid accepted pairing exists: current user is the guardian/therapist/teacher
      const [pairing] = await db
        .select({ id: pairings.id })
        .from(pairings)
        .where(
          and(
            eq(pairings.guardianId, currentUserId),
            eq(pairings.childId, targetUserId),
            eq(pairings.status, 'accepted')
          )
        )
        .limit(1);

      if (!pairing) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const userId = targetUserId ?? currentUserId;

    const sessions = await db
      .select()
      .from(communicationSessions)
      .where(eq(communicationSessions.userId, userId))
      .orderBy(desc(communicationSessions.timestamp))
      .limit(50);

    return NextResponse.json({ sessions });
  } catch (error) {
    return handleApiError(error, 'GET /api/sessions');
  }
}

