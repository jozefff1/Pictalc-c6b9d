import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://pictalk.app';

  const body = `User-agent: *
Allow: /
Disallow: /api/

# AI search engine crawlers
User-agent: GPTBot
Allow: /
Allow: /about
Allow: /llms.txt

User-agent: PerplexityBot
Allow: /
Allow: /about
Allow: /llms.txt

User-agent: ClaudeBot
Allow: /
Allow: /about
Allow: /llms.txt

User-agent: GoogleOther
Allow: /
Allow: /about

# Machine-readable app description for LLMs
# See: ${baseUrl}/llms.txt

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
