import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { pairingRequests, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

function isDemoOpenPairingEnabled() {
  return process.env.DEMO_OPEN_PAIRING === 'true';
}

type Params = { params: Promise<{ token: string }> };

// Mask an email address for display: jose@example.com → jo***@example.com
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain || local.length <= 2) return `***@${domain ?? ''}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

// GET /api/pairings/invite/[token] — public info about an invite (no auth required)
// Returns only enough info to display a preview on the /join/[token] page.
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;
  const isDemoOpenPairing = isDemoOpenPairingEnabled();

  if (!token || token.length < 10) {
    return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 400 });
  }

  const [invite] = await db
    .select({
      id: pairingRequests.id,
      status: pairingRequests.status,
      expiresAt: pairingRequests.expiresAt,
      invitedEmail: pairingRequests.invitedEmail,
      requesterName: users.name,
    })
    .from(pairingRequests)
    .leftJoin(users, eq(users.id, pairingRequests.requesterId))
    .where(and(eq(pairingRequests.token, token)))
    .limit(1);

  if (!invite) {
    return NextResponse.json({ valid: false, error: 'Invite not found' }, { status: 404 });
  }

  if (invite.status !== 'pending') {
    const reason = invite.status === 'used'
      ? 'This invite has already been accepted.'
      : invite.status === 'declined'
      ? 'This invite was declined.'
      : 'This invite has expired.';
    return NextResponse.json({ valid: false, error: reason });
  }

  if (new Date() > invite.expiresAt) {
    return NextResponse.json({ valid: false, error: 'This invite has expired.' });
  }

  return NextResponse.json({
    valid: true,
    requesterName: invite.requesterName ?? 'Someone',
    // Masked email so the recipient knows which account to use, without exposing full address
    invitedEmailMasked: (invite.invitedEmail && !isDemoOpenPairing) ? maskEmail(invite.invitedEmail) : null,
    invitedEmailFull: (invite.invitedEmail && !isDemoOpenPairing) ? invite.invitedEmail : null,
    expiresAt: invite.expiresAt,
  });
}
