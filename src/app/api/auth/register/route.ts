import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { db } from '@/lib/db/client';
import { users, userPreferences } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/email/resend';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Please enter a valid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['child', 'guardian', 'therapist', 'teacher'], {
    message: 'Invalid role selected'
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, password, role } = result.data;
    const email = result.data.email.trim().toLowerCase();

    // Check if email already taken
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists',
          details: [{ path: ['email'], message: 'This email is already registered' }],
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token (32 random bytes → 64-char hex)
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert user with an explicit column list to stay compatible with DBs
    // that have not yet added newer columns like tenant_id.
    const inserted = await db.execute(sql`
      insert into "users" (
        "email",
        "name",
        "password",
        "role",
        "email_verified",
        "verification_token",
        "verification_token_expiry"
      ) values (
        ${email},
        ${name},
        ${hashedPassword},
        ${role},
        ${false},
        ${verificationToken},
        ${verificationTokenExpiry}
      )
      returning "id", "email", "name"
    `);

    const newUser = inserted.rows[0] as { id: string; email: string; name: string } | undefined;

    if (!newUser) {
      throw new Error('Failed to create user record');
    }

    // Create default preferences for the new user
    await db.insert(userPreferences).values({ userId: newUser.id });

    // Send verification email (non-blocking — if it fails the account is still created)
    try {
      await sendVerificationEmail(newUser.email, newUser.name, verificationToken);
    } catch (emailError) {
      console.error('[register] Failed to send verification email:', emailError);
      // Account is created; user can request a resend later
    }

    return NextResponse.json(
      { message: 'Account created. Check your email to verify your address.', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('[register] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong on our end. Please try again.' },
      { status: 500 }
    );
  }
}
