import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

/**
 * Auth guard for API route handlers.
 * Returns { userId } if the request is authenticated, or a 401 NextResponse if not.
 *
 * Usage:
 *   const authResult = await requireAuth();
 *   if (authResult instanceof NextResponse) return authResult;
 *   const { userId } = authResult;
 */
export async function requireAuth(): Promise<{ userId: string } | NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { userId: session.user.id };
}
