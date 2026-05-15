import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { put } from '@vercel/blob';
import { db } from '@/lib/db/client';
import { customIcons } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const icons = await db
      .select()
      .from(customIcons)
      .where(eq(customIcons.userId, session.user.id))
      .orderBy(desc(customIcons.createdAt));

    return NextResponse.json({ icons });
  } catch (error) {
    console.error('[GET /api/icons] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const name = formData.get('name') as string | null;
    const category = formData.get('category') as string | null;

    if (!file || !name || !category) {
      return NextResponse.json({ error: 'Missing required fields (file, name, category)' }, { status: 400 });
    }

    // 1. Upload to Vercel Blob
    // We add a short nanoid to the filename to avoid collisions
    const fileExtension = file.name.split('.').pop() || 'png';
    const blobFilename = `icons/${session.user.id}/${nanoid(8)}.${fileExtension}`;
    
    const blob = await put(blobFilename, file, {
      access: 'public',
    });

    // 2. Save metadata to Database
    const [newIcon] = await db
      .insert(customIcons)
      .values({
        userId: session.user.id,
        name: name.toLowerCase(),
        category: category.toLowerCase(),
        imageUrl: blob.url,
      })
      .returning();

    return NextResponse.json({ icon: newIcon }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/icons] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
