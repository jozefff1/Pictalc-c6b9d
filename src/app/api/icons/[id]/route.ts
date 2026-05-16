import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/client';
import { customIcons } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// DELETE /api/icons/:id — delete a custom icon (owner only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [deleted] = await db
      .delete(customIcons)
      .where(and(eq(customIcons.id, id), eq(customIcons.userId, session.user.id)))
      .returning({ id: customIcons.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/icons/:id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

const renameSchema = z.object({
  name: z.string().min(1).max(100).trim(),
});

// PATCH /api/icons/:id — rename a custom icon (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const result = renameSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const [updated] = await db
      .update(customIcons)
      .set({ name: result.data.name.toLowerCase() })
      .where(and(eq(customIcons.id, id), eq(customIcons.userId, session.user.id)))
      .returning({ id: customIcons.id, name: customIcons.name });

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ icon: updated });
  } catch (error) {
    console.error('[PATCH /api/icons/:id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
