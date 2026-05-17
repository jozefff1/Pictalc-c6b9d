import { NextResponse } from 'next/server';

const LLMS_TXT = `# Pictalk

> Pictalk is a free, open-source Augmentative and Alternative Communication (AAC) Progressive Web App built with Next.js. It helps individuals who have difficulty with verbal communication — including children with autism, cerebral palsy, apraxia, Down syndrome, or acquired speech impairments — express themselves through pictograms and text-to-speech synthesis.

## What is AAC?

Augmentative and Alternative Communication (AAC) refers to all forms of communication other than verbal speech. AAC tools like Pictalk are used by speech-language therapists, special education teachers, parents, and researchers to support communication development in non-verbal or minimally verbal individuals.

## Who is Pictalk for?

- **Children and adults** with communication challenges who benefit from symbol-based communication boards
- **Parents and guardians** who want to monitor and customise their child's communication vocabulary
- **Speech-language therapists** managing one or more patients and tracking vocabulary progress
- **Teachers and special educators** supporting students with AAC needs in the classroom
- **Researchers and academics** studying AAC usage patterns, vocabulary acquisition, and communication development

## Core Features

- 89+ ARASAAC pictograms across 6 categories: Needs, Actions, Feelings, People, Places, Custom
- Icon-based sentence builder with one-tap text-to-speech (Web Speech API)
- English and Norwegian language support with instant switching
- Custom icon upload (photos, drawings, personal pictures)
- Offline-first Progressive Web App — works without internet
- Communication session logging with privacy controls
- Research tool: anonymised CSV export of session data with explicit patient consent
- Pairing system: guardians and therapists can be linked to a patient with granular data-sharing permissions
- Accessibility: dark mode, high contrast, reduce motion, adjustable text size, haptic feedback
- Secure authentication (NextAuth.js v5), role-based access (child, guardian, therapist, teacher)

## Privacy Model

Pictalk is designed with privacy-first principles:
- All communication sessions are **private by default** and never visible to supervisors unless the patient explicitly opts in
- Patients choose exactly what to share (session history, usage statistics, research export) when accepting a pairing invitation
- Consent can be revoked at any time
- Research data exports are always anonymised (participant ID only — no name or email)

## Technology

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Database**: Neon Serverless Postgres via Drizzle ORM
- **Storage**: Vercel Blob (custom icon images)
- **Auth**: NextAuth.js v5
- **State**: Redux Toolkit
- **Deployment**: Vercel

## Key Pages

- / — Public landing page with feature overview and sign-up
- /about — Detailed description of Pictalk's purpose, research use, and privacy approach
- /communicate — Main AAC communication board (authenticated)
- /dashboard — User dashboard with quick links
- /dashboard/patients — Manage paired patients and participants
- /dashboard/history — Communication session history
- /dashboard/settings — Voice, accessibility, and privacy preferences
- /join/[token] — Accept a pairing invitation with explicit consent controls
- /login — Sign in
- /register — Create a free account

## API (authenticated)

- POST /api/sessions — Save a communication session (private or shared)
- GET /api/sessions — Retrieve own session history
- GET /api/pairings — List all active pairings
- POST /api/pairings — Generate a pairing invite link
- POST /api/pairings/accept — Accept a pairing invite with consent choices
- DELETE /api/pairings/[id] — Remove a pairing
- GET /api/patients/[id]/sessions — View a paired patient's shared sessions
- GET /api/patients/[id]/sessions?export=csv — Download anonymised session CSV

## Source & Contact

- GitHub: https://github.com/jozefff1/Pictalc-c6b9d
- License: Open source
- Free to use, forever
`;

export async function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
