import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/client';
import { pairings, pairingRequests, users } from '@/lib/db/schema';
import { eq, or, and } from 'drizzle-orm';

// GET /api/pairings — list all pairings for the current user (as guardian or child)
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const rows = await db
    .select({
      id: pairings.id,
      guardianId: pairings.guardianId,
      childId: pairings.childId,
      status: pairings.status,
      relationship: pairings.relationship,
      shareHistory: pairings.shareHistory,
      shareStats: pairings.shareStats,
      allowExport: pairings.allowExport,
      consentAt: pairings.consentAt,
      createdAt: pairings.createdAt,
      updatedAt: pairings.updatedAt,
      guardianName: users.name,
      guardianEmail: users.email,
    })
    .from(pairings)
    .leftJoin(users, eq(users.id, pairings.guardianId))
    .where(
      or(eq(pairings.guardianId, userId), eq(pairings.childId, userId))
    );

  // For each row, also fetch the other party's name
  const enriched = await Promise.all(
    rows.map(async (row) => {
      const otherId = row.guardianId === userId ? row.childId : row.guardianId;
      const [other] = await db
        .select({ id: users.id, name: users.name, role: users.role })
        .from(users)
        .where(eq(users.id, otherId))
        .limit(1);
      return {
        ...row,
        role: row.guardianId === userId ? 'supervisor' : 'supervised',
        otherUser: other ?? null,
      };
    })
  );

  return NextResponse.json({ pairings: enriched });
}

const inviteSchema = z.object({
  relationship: z.enum(['parent', 'therapist', 'teacher', 'researcher', 'caregiver']),
});

// POST /api/pairings — generate a pairing invite token
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const result = inviteSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.issues },
      { status: 400 }
    );
  }

  const token = nanoid(24);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(pairingRequests).values({
    requesterId: session.user.id,
    token,
    status: 'pending',
    expiresAt,
  });

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const inviteUrl = `${baseUrl}/join/${token}`;

  return NextResponse.json({ token, inviteUrl, expiresAt, relationship: result.data.relationship }, { status: 201 });
}
