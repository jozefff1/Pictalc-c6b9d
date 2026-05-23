import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleApiError } from '@/lib/api/errorHandler';
import { put } from '@vercel/blob';
import { db } from '@/lib/db/client';
import { customIcons } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const icons = await db
      .select()
      .from(customIcons)
      .where(eq(customIcons.userId, userId))
      .orderBy(desc(customIcons.createdAt));

    return NextResponse.json({ icons });
  } catch (error) {
    return handleApiError(error, 'GET /api/icons');
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    const category = formData.get('category') as string | null;

    if (!file || !name || !category) {
      return NextResponse.json({ error: 'Missing required fields (file, name, category)' }, { status: 400 });
    }

    // Validate file type (whitelist)
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' }, { status: 400 });
    }

    // Validate file size (5 MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5 MB' }, { status: 400 });
    }

    // Build a readable blob filename from the user-given name + short ID to avoid collisions
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40);
    const fileExtension = file.name.split('.').pop() || 'png';
    const blobFilename = `icons/${userId}/${safeName}-${nanoid(6)}.${fileExtension}`;
    
    const blob = await put(blobFilename, file, {
      access: 'public',
    });

    // 2. Save metadata to Database
    const [newIcon] = await db
      .insert(customIcons)
      .values({
        userId: userId,
        name: name.toLowerCase(),
        category: category.toLowerCase(),
        imageUrl: blob.url,
      })
      .returning();

    return NextResponse.json({ icon: newIcon }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/icons');
  }
}
