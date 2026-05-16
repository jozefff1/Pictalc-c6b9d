import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/client';
import { users, passwordHistory } from '@/lib/db/schema';
import { eq, and, gt, isNotNull, desc } from 'drizzle-orm';

const PASSWORD_HISTORY_LIMIT = 5;

const schema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues.map((i) => ({ path: i.path, message: i.message })),
        },
        { status: 400 }
      );
    }

    const { token, password } = result.data;
    const now = new Date();

    const user = await db
      .select({ id: users.id, password: users.password })
      .from(users)
      .where(
        and(
          eq(users.resetToken, token),
          isNotNull(users.resetTokenExpiry),
          gt(users.resetTokenExpiry, now)
        )
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired.' },
        { status: 400 }
      );
    }

    // Check new password against current password and full history
    const hashesToCheck = [
      { hash: user.password }, // current
      ...(await db
        .select({ hash: passwordHistory.passwordHash })
        .from(passwordHistory)
        .where(eq(passwordHistory.userId, user.id))
        .orderBy(desc(passwordHistory.createdAt))
        .limit(PASSWORD_HISTORY_LIMIT)),
    ];

    for (const { hash } of hashesToCheck) {
      if (await bcrypt.compare(password, hash)) {
        return NextResponse.json(
          { error: 'You cannot reuse a previous password. Please choose a new one.' },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Save old password hash to history before overwriting
    await db.insert(passwordHistory).values({
      userId: user.id,
      passwordHash: user.password,
    });

    // Trim history to keep only the last PASSWORD_HISTORY_LIMIT entries
    const allHistory = await db
      .select({ id: passwordHistory.id })
      .from(passwordHistory)
      .where(eq(passwordHistory.userId, user.id))
      .orderBy(desc(passwordHistory.createdAt));

    if (allHistory.length > PASSWORD_HISTORY_LIMIT) {
      const toDelete = allHistory.slice(PASSWORD_HISTORY_LIMIT).map((r) => r.id);
      for (const id of toDelete) {
        await db.delete(passwordHistory).where(eq(passwordHistory.id, id));
      }
    }

    // Update password and clear reset token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: now,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('[reset-password] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
