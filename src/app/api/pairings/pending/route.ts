import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { pairingRequests, users } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

// GET /api/pairings/pending — list invite tokens addressed to the current user's email
export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  // Fetch the current user's email
  const [me] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!me) return NextResponse.json({ pendingInvites: [] });

  const invites = await db
    .select({
      id: pairingRequests.id,
      token: pairingRequests.token,
      expiresAt: pairingRequests.expiresAt,
      createdAt: pairingRequests.createdAt,
      requesterName: users.name,
      requesterEmail: users.email,
    })
    .from(pairingRequests)
    .leftJoin(users, eq(users.id, pairingRequests.requesterId))
    .where(
      and(
        eq(pairingRequests.invitedEmail, me.email.toLowerCase().trim()),
        eq(pairingRequests.status, 'pending'),
        gt(pairingRequests.expiresAt, new Date())
      )
    );

  return NextResponse.json({ pendingInvites: invites });
}
