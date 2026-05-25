import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';

// Forward inbound emails received at *@snakke.arken.pro to info@arken.pro
// via the Resend outbound API.
//
// Resend dashboard setup:
//   Webhooks → Add Webhook
//     URL:    https://snakke.vercel.app/api/webhooks/resend
//     Events: email.received
//   Copy the signing secret → add to Vercel env as RESEND_WEBHOOK_SECRET
//
// Vercel env vars required:
//   RESEND_WEBHOOK_SECRET   – signing secret from the webhook details page
//   RESEND_API_KEY          – already set for outbound email

const FORWARD_TO = 'info@arken.pro';
const FORWARD_FROM = 'Snakke Inbound <noreply@snakke.arken.pro>';

interface ResendEmailReceivedData {
  email_id: string;
  created_at: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  html?: string;
  text?: string;
}

interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: ResendEmailReceivedData;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;

  if (!webhookSecret) {
    console.error('[resend-webhook] RESEND_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Read raw body — must NOT parse as JSON before verification
  const payload = await req.text();

  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  let event: ResendWebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(payload, headers) as ResendWebhookEvent;
  } catch (err) {
    console.error('[resend-webhook] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type !== 'email.received') {
    // Acknowledge other event types without processing
    return NextResponse.json({ ok: true });
  }

  const { from, to, subject, html, text } = event.data;

  if (!resendKey) {
    console.error('[resend-webhook] RESEND_API_KEY is not set — cannot forward email');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const forwardSubject = `[Inbound] ${subject || '(no subject)'}`;
  const forwardHtml = html
    ? `<p><strong>From:</strong> ${escapeHtml(from)}<br><strong>To:</strong> ${escapeHtml(to.join(', '))}</p><hr />${html}`
    : undefined;
  const forwardText = `From: ${from}\nTo: ${to.join(', ')}\n\n${text ?? '(no text body)'}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: FORWARD_FROM,
      to: [FORWARD_TO],
      reply_to: from,
      subject: forwardSubject,
      ...(forwardHtml ? { html: forwardHtml } : {}),
      text: forwardText,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    console.error('[resend-webhook] Forward failed:', res.status, err);
    return NextResponse.json({ error: 'Failed to forward email' }, { status: 502 });
  }

  console.log(`[resend-webhook] Forwarded email from ${from} to ${FORWARD_TO}`);
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
