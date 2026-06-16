import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { db } from '@/lib/db/client';
import { pairings, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

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
          eq(pairings.guardianId, userId),
          eq(pairings.status, 'accepted')
        )
      )
      .orderBy(users.name);

    const deduped = Array.from(
      paired.reduce((map, row) => {
        if (!map.has(row.id)) map.set(row.id, row);
        return map;
      }, new Map<string, (typeof paired)[number]>()).values()
    );

    return NextResponse.json({ users: deduped });
  } catch (error) {
    return handleApiError(error, 'GET /api/sessions/paired-users');
  }
}
