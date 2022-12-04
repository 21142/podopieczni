import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server.mjs';

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/welcome`;
    },
  },
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/error', // Error code passed in query string as ?error=
  // },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'macG',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        return {
          id: 1,
          name: 'mac G',
          email: 'macg@example.com',
          password: '12345',
          image: 'https://i.pravatar.cc/150?u=jsmith@example.com',
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
