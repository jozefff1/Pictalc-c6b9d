import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { db } from '@/lib/db/client';
import { userSentences } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;
    const { id } = await params;

    const body = await request.json() as { text?: string; iconIds?: string[]; category?: string };
    const { text, iconIds, category } = body;

    if (text !== undefined && (typeof text !== 'string' || text.trim().length === 0 || text.trim().length > 500)) {
      return NextResponse.json({ error: 'text must be 1–500 characters' }, { status: 400 });
    }
    if (iconIds !== undefined && (!Array.isArray(iconIds) || iconIds.length === 0)) {
      return NextResponse.json({ error: 'iconIds must be a non-empty array' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (text !== undefined) updates.text = text.trim();
    if (iconIds !== undefined) updates.iconIds = iconIds;
    if (category !== undefined) updates.category = category;

    const [updated] = await db
      .update(userSentences)
      .set(updates)
      .where(and(eq(userSentences.id, id), eq(userSentences.userId, userId)))
      .returning();

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ sentence: updated });
  } catch (error) {
    return handleApiError(error, 'PUT /api/sentences/[id]');
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;
    const { id } = await params;

    const [deleted] = await db
      .delete(userSentences)
      .where(and(eq(userSentences.id, id), eq(userSentences.userId, userId)))
      .returning();

    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'DELETE /api/sentences/[id]');
  }
}
