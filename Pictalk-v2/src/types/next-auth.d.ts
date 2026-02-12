import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'child' | 'guardian' | 'therapist' | 'teacher';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'child' | 'guardian' | 'therapist' | 'teacher';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'child' | 'guardian' | 'therapist' | 'teacher';
  }
}
