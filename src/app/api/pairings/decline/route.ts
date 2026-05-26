import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { pairingRequests, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const declineSchema = z.object({ token: z.string().min(1) });

// POST /api/pairings/decline — decline a pending invite addressed to the current user
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  const body = await request.json().catch(() => ({}));
  const result = declineSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { token } = result.data;

  // Fetch current user's email
  const [me] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [invite] = await db
    .select({ id: pairingRequests.id, invitedEmail: pairingRequests.invitedEmail })
    .from(pairingRequests)
    .where(and(eq(pairingRequests.token, token), eq(pairingRequests.status, 'pending')))
    .limit(1);

  if (!invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
  }

  // Only the intended recipient can decline
  if (invite.invitedEmail?.toLowerCase().trim() !== me.email.toLowerCase().trim()) {
    return NextResponse.json({ error: 'Not authorised to decline this invite' }, { status: 403 });
  }

  await db
    .update(pairingRequests)
    .set({ status: 'declined' })
    .where(eq(pairingRequests.id, invite.id));

  return NextResponse.json({ success: true });
}
