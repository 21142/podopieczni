import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    // ...add providers here
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
        },
      },
      async authorize(credentials, _req) {
        const user = { id: 1, name: credentials?.name ?? 'J Smith' };
        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
