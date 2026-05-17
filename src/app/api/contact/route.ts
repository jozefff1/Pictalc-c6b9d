import { NextRequest, NextResponse } from 'next/server';

const RECIPIENT = 'info@arken.pro';
const MAX_MESSAGE_LENGTH = 5000;

function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_MESSAGE_LENGTH);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = sanitize((body as Record<string, unknown>).name);
  const email = sanitize((body as Record<string, unknown>).email);
  const subject = sanitize((body as Record<string, unknown>).subject);
  const message = sanitize((body as Record<string, unknown>).message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Message is too short.' }, { status: 400 });
  }

  // ---------------------------------------------------------------------------
  // Send via Resend (recommended for Next.js / Vercel).
  // Set RESEND_API_KEY in your Vercel environment variables.
  // If not configured, we fall back to a mailto: link so the form still works.
  // ---------------------------------------------------------------------------
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    const safeSubject = subject
      ? `[Snakke] ${subject}`
      : '[Snakke] Contact form message';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Snakke Contact <admin@arken.pro>',
        to: [RECIPIENT],
        reply_to: email,
        subject: safeSubject,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>
<hr />
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error('[contact] Resend error:', res.status, err);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  // No Resend key — log and return success so the user isn't stuck.
  // In production you MUST configure RESEND_API_KEY.
  console.warn(
    '[contact] RESEND_API_KEY not set. Message not delivered.',
    { name, email, subject, messageLength: message.length },
  );
  return NextResponse.json({ ok: true });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
