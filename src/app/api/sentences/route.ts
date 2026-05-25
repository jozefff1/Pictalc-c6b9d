import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { db } from '@/lib/db/client';
import { userSentences } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(_request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const sentences = await db
      .select()
      .from(userSentences)
      .where(eq(userSentences.userId, userId))
      .orderBy(desc(userSentences.createdAt));

    return NextResponse.json({ sentences });
  } catch (error) {
    return handleApiError(error, 'GET /api/sentences');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json() as { text?: string; iconIds?: string[]; category?: string; language?: string };
    const { text, iconIds, category = 'custom', language = 'en' } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }
    if (!Array.isArray(iconIds) || iconIds.length === 0) {
      return NextResponse.json({ error: 'iconIds must be a non-empty array' }, { status: 400 });
    }
    if (text.trim().length > 500) {
      return NextResponse.json({ error: 'text must be 500 characters or fewer' }, { status: 400 });
    }

    const [sentence] = await db
      .insert(userSentences)
      .values({ userId, text: text.trim(), iconIds, category, language })
      .returning();

    return NextResponse.json({ sentence }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/sentences');
  }
}
