import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/client';
import { pairings, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return all children/patients that have an accepted pairing with this user
    const paired = await db
      .select({
        id: users.id,
        name: users.name,
        role: users.role,
        pairingRelationship: pairings.relationship,
      })
      .from(pairings)
      .innerJoin(users, eq(users.id, pairings.childId))
      .where(
        and(
          eq(pairings.guardianId, session.user.id),
          eq(pairings.status, 'accepted')
        )
      )
      .orderBy(users.name);

    return NextResponse.json({ users: paired });
  } catch (error) {
    console.error('[GET /api/sessions/paired-users] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
