import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { eq, and, gt, isNotNull } from 'drizzle-orm';

const verifySchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = verifySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { token } = result.data;
    const now = new Date();

    // Find user with matching, non-expired token
    const user = await db
      .select({ id: users.id, emailVerified: users.emailVerified })
      .from(users)
      .where(
        and(
          eq(users.verificationToken, token),
          isNotNull(users.verificationTokenExpiry),
          gt(users.verificationTokenExpiry, now)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired.' },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      // Already verified — still return success
      return NextResponse.json({ message: 'Email already verified.' });
    }

    // Mark as verified and clear the token
    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('[verify-email] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
