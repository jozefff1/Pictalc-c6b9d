import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { pairings, pairingRequests, users } from '@/lib/db/schema';
import { eq, or, and, gte, sql } from 'drizzle-orm';
import { sendInviteEmail } from '@/lib/email/resend';

function isDemoOpenPairingEnabled() {
  return process.env.DEMO_OPEN_PAIRING === 'true';
}

// GET /api/pairings — list all pairings for the current user (as guardian or child)
export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

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
  email: z.string().email().optional(),
});

// POST /api/pairings — generate a pairing invite token
export async function POST(request: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;
  const isDemoOpenPairing = isDemoOpenPairingEnabled();

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

  // Rate limit: max 10 invite tokens per user per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const [{ recentCount }] = await db
    .select({ recentCount: sql<number>`count(*)::int` })
    .from(pairingRequests)
    .where(and(eq(pairingRequests.requesterId, userId), gte(pairingRequests.createdAt, oneHourAgo)));

  if (recentCount >= 10) {
    return NextResponse.json(
      { error: 'Too many invites generated. Please wait before creating more.' },
      { status: 429 }
    );
  }

  await db.insert(pairingRequests).values({
    requesterId: userId,
    token,
    status: 'pending',
    expiresAt,
    invitedEmail: isDemoOpenPairing ? null : (result.data.email?.toLowerCase().trim() ?? null),
  });

  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://snakke.vercel.app';
  const inviteUrl = `${baseUrl}/join/${token}`;

  let emailSent = false;
  if (result.data.email && !isDemoOpenPairing) {
    try {
      const [inviter] = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      await sendInviteEmail(
        result.data.email,
        inviter?.name ?? 'Someone',
        inviteUrl,
        result.data.relationship,
        expiresAt
      );
      emailSent = true;
    } catch {
      // Non-fatal — link is still usable even if email fails
    }
  }

  return NextResponse.json({ token, inviteUrl, expiresAt, relationship: result.data.relationship, emailSent }, { status: 201 });
}
