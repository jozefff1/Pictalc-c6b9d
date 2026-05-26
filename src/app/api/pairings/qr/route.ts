import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { requireAuth } from '@/lib/auth/requireAuth';
import { db } from '@/lib/db/client';
import { pairingRequests } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

// GET /api/pairings/qr
// Generates a short-lived (5-minute) pairing token for QR display.
// The token is inserted into pairing_requests with no invitedEmail so
// anyone who scans can accept — the same rate-limit as email invites applies.
export async function GET() {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId } = authResult;

  // Rate limit: max 10 invite tokens per user per hour (shared with email invites)
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

  const token = nanoid(24);
  // QR codes expire in 5 minutes — short window reduces link-sharing risk
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db.insert(pairingRequests).values({
    requesterId: userId,
    token,
    status: 'pending',
    expiresAt,
    invitedEmail: null, // QR invites are not email-bound
  });

  const baseUrl =
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    'https://snakke.vercel.app';

  const inviteUrl = `${baseUrl}/join/${token}`;

  return NextResponse.json({ token, inviteUrl, expiresAt });
}
