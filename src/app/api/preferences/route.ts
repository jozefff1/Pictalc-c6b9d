import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { db } from '@/lib/db/client';
import { userPreferences } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!prefs) {
      // Return defaults if no row exists yet
      return NextResponse.json({
        preferences: { voiceSpeed: 1.0, voicePitch: 1.0 },
      });
    }

    return NextResponse.json({
      preferences: {
        voiceSpeed: parseFloat(String(prefs.voiceSpeed ?? '1.00')),
        voicePitch: parseFloat(String(prefs.voicePitch ?? '1.00')),
        theme: prefs.theme,
        language: prefs.language,
        hapticEnabled: prefs.hapticEnabled,
        highContrast: prefs.highContrast,
        textSize: parseFloat(String(prefs.textSize ?? '1.00')),
        reduceMotion: prefs.reduceMotion,
      },
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/preferences');
  }
}

const patchSchema = z.object({
  voiceSpeed: z.number().min(0.5).max(2.0).optional(),
  voicePitch: z.number().min(0.5).max(2.0).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  hapticEnabled: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  textSize: z.number().min(0.8).max(2.0).optional(),
  reduceMotion: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const result = patchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid preferences data', details: result.error.issues },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (result.data.voiceSpeed !== undefined) updates.voiceSpeed = String(result.data.voiceSpeed);
    if (result.data.voicePitch !== undefined) updates.voicePitch = String(result.data.voicePitch);
    if (result.data.theme !== undefined) updates.theme = result.data.theme;
    if (result.data.hapticEnabled !== undefined) updates.hapticEnabled = result.data.hapticEnabled;
    if (result.data.highContrast !== undefined) updates.highContrast = result.data.highContrast;
    if (result.data.textSize !== undefined) updates.textSize = String(result.data.textSize);
    if (result.data.reduceMotion !== undefined) updates.reduceMotion = result.data.reduceMotion;

    await db
      .update(userPreferences)
      .set(updates)
      .where(eq(userPreferences.userId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/preferences');
  }
}
