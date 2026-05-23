import { NextResponse } from 'next/server';

/**
 * Logs an unexpected error and returns a generic 500 response.
 * Use this in API route catch blocks.
 *
 * @param error - The caught error value
 * @param context - A short label used in the log, e.g. 'GET /api/icons'
 */
export function handleApiError(error: unknown, context: string): NextResponse {
  console.error(`[${context}] error:`, error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
