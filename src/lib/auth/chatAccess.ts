import { db } from '@/lib/db/client';
import { pairings } from '@/lib/db/schema';
import { and, eq, inArray, or } from 'drizzle-orm';

const DEMO_MAX_FAMILY_MEMBERS = 5;

type PairingRole = 'supervisor' | 'supervised';

export interface AllowedChatPeer {
  userId: string;
  relationship?: string;
  pairingRole: PairingRole;
  isDirect: boolean;
}

function isDemoFamilyCrossChatEnabled() {
  return process.env.DEMO_FAMILY_CROSS_CHAT === 'true';
}

async function getDirectChatPeers(userId: string): Promise<Map<string, AllowedChatPeer>> {
  const rows = await db
    .select({
      guardianId: pairings.guardianId,
      childId: pairings.childId,
      relationship: pairings.relationship,
    })
    .from(pairings)
    .where(
      and(
        eq(pairings.status, 'accepted'),
        or(eq(pairings.guardianId, userId), eq(pairings.childId, userId))
      )
    );

  const peers = new Map<string, AllowedChatPeer>();

  for (const row of rows) {
    const otherUserId = row.guardianId === userId ? row.childId : row.guardianId;
    peers.set(otherUserId, {
      userId: otherUserId,
      relationship: row.relationship,
      pairingRole: row.guardianId === userId ? 'supervisor' : 'supervised',
      isDirect: true,
    });
  }

  return peers;
}

async function getConnectedComponentWithinLimit(startUserId: string, maxMembers: number) {
  const visited = new Set<string>([startUserId]);
  let frontier = [startUserId];

  while (frontier.length > 0) {
    const rows = await db
      .select({
        guardianId: pairings.guardianId,
        childId: pairings.childId,
      })
      .from(pairings)
      .where(
        and(
          eq(pairings.status, 'accepted'),
          or(inArray(pairings.guardianId, frontier), inArray(pairings.childId, frontier))
        )
      );

    const next: string[] = [];

    for (const row of rows) {
      if (!visited.has(row.guardianId)) {
        visited.add(row.guardianId);
        next.push(row.guardianId);
      }
      if (!visited.has(row.childId)) {
        visited.add(row.childId);
        next.push(row.childId);
      }

      if (visited.size > maxMembers) {
        return null;
      }
    }

    frontier = next;
  }

  return visited;
}

export async function getAllowedChatPeers(userId: string): Promise<AllowedChatPeer[]> {
  const directPeers = await getDirectChatPeers(userId);

  // Legacy behavior remains unchanged unless demo cross-chat is enabled.
  if (!isDemoFamilyCrossChatEnabled()) {
    return Array.from(directPeers.values());
  }

  const component = await getConnectedComponentWithinLimit(userId, DEMO_MAX_FAMILY_MEMBERS);
  if (!component) {
    // Safety fallback for larger graphs: keep direct-only pairing behavior.
    return Array.from(directPeers.values());
  }

  for (const memberId of component) {
    if (memberId === userId || directPeers.has(memberId)) continue;

    directPeers.set(memberId, {
      userId: memberId,
      relationship: 'connected',
      pairingRole: 'supervised',
      isDirect: false,
    });
  }

  return Array.from(directPeers.values());
}

export async function canChatWithUser(userId: string, otherUserId: string): Promise<boolean> {
  const peers = await getAllowedChatPeers(userId);
  return peers.some((peer) => peer.userId === otherUserId);
}
