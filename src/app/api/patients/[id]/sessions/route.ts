import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db/client';
import { communicationSessions, pairings, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

type Params = { params: Promise<{ id: string }> };

// GET /api/patients/[id]/sessions
// Returns shared sessions for a paired patient. Enforces pairing + shareHistory permission.
// Add ?export=csv to download anonymised CSV.
export async function GET(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: patientId } = await params;
  const supervisorId = session.user.id;

  // Verify an active accepted pairing exists and shareHistory is on
  const [pairing] = await db
    .select({
      id: pairings.id,
      shareHistory: pairings.shareHistory,
      shareStats: pairings.shareStats,
      allowExport: pairings.allowExport,
    })
    .from(pairings)
    .where(
      and(
        eq(pairings.guardianId, supervisorId),
        eq(pairings.childId, patientId),
        eq(pairings.status, 'accepted')
      )
    )
    .limit(1);

  if (!pairing) {
    return NextResponse.json({ error: 'No active pairing with this patient' }, { status: 403 });
  }

  if (!pairing.shareHistory) {
    return NextResponse.json(
      { error: 'Patient has not shared their session history with you' },
      { status: 403 }
    );
  }

  // Only return explicitly shared sessions
  const sessions = await db
    .select({
      id: communicationSessions.id,
      sentence: communicationSessions.sentence,
      icons: communicationSessions.icons,
      timestamp: communicationSessions.timestamp,
      taskType: communicationSessions.taskType,
    })
    .from(communicationSessions)
    .where(
      and(
        eq(communicationSessions.userId, patientId),
        eq(communicationSessions.visibility, 'shared')
      )
    )
    .orderBy(desc(communicationSessions.timestamp));

  const isExport = request.nextUrl.searchParams.get('export') === 'csv';

  if (isExport) {
    if (!pairing.allowExport) {
      return NextResponse.json(
        { error: 'Patient has not allowed data export' },
        { status: 403 }
      );
    }

    // Anonymised CSV — participant ID only, no name/email
    const lines = [
      'participant_id,session_id,timestamp,task_type,sentence,icon_count,icons',
      ...sessions.map((s) => {
        const icons = Array.isArray(s.icons) ? s.icons : [];
        const iconNames = icons.map((i: { name?: string }) => i.name ?? '').join('|');
        return [
          patientId,
          s.id,
          new Date(s.timestamp).toISOString(),
          s.taskType ?? 'free',
          `"${(s.sentence ?? '').replace(/"/g, '""')}"`,
          icons.length,
          `"${iconNames.replace(/"/g, '""')}"`,
        ].join(',');
      }),
    ];

    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="pictalk-participant-${patientId.slice(0, 8)}.csv"`,
      },
    });
  }

  // Also fetch patient's display info (name only — no email for privacy)
  const [patient] = await db
    .select({ name: users.name, role: users.role })
    .from(users)
    .where(eq(users.id, patientId))
    .limit(1);

  return NextResponse.json({
    patient: patient ?? null,
    permissions: {
      shareHistory: pairing.shareHistory,
      shareStats: pairing.shareStats,
      allowExport: pairing.allowExport,
    },
    sessions,
    total: sessions.length,
  });
}
