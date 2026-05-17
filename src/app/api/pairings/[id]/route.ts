import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/client';
import { pairings } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';

type Params = { params: Promise<{ id: string }> };

// DELETE /api/pairings/[id] — remove a pairing (either party can remove)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const [row] = await db
    .select({ id: pairings.id })
    .from(pairings)
    .where(
      and(
        eq(pairings.id, id),
        or(eq(pairings.guardianId, userId), eq(pairings.childId, userId))
      )
    )
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: 'Pairing not found' }, { status: 404 });
  }

  await db.delete(pairings).where(eq(pairings.id, id));
  return NextResponse.json({ success: true });
}

const consentSchema = z.object({
  shareHistory: z.boolean(),
  shareStats: z.boolean(),
  allowExport: z.boolean(),
});

// PATCH /api/pairings/[id]/consent — update consent choices (only the child/patient can change)
export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  // Only the patient (childId) can modify consent
  const [row] = await db
    .select({ id: pairings.id })
    .from(pairings)
    .where(and(eq(pairings.id, id), eq(pairings.childId, userId)))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: 'Not authorised to update this pairing' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const result = consentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await db
    .update(pairings)
    .set({ ...result.data, consentAt: new Date(), updatedAt: new Date() })
    .where(eq(pairings.id, id));

  return NextResponse.json({ success: true });
}
