import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
            .then(rows => rows[0]);

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Block login for unverified accounts (new-flow users only)
          if (!user.emailVerified && user.verificationToken !== null) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as 'child' | 'guardian' | 'therapist' | 'teacher',
          };
        } catch (error) {
          console.error('[auth] Database error during authorize:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as 'child' | 'guardian' | 'therapist' | 'teacher';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // redirect errors back to login — no separate /error page
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // NextAuth v5 reads AUTH_SECRET automatically — no need to pass it here
  trustHost: true, // Required for Vercel deployments
});
