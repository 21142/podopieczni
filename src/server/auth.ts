/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GetServerSidePropsContext } from 'next';
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type SessionOptions,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';
import { type ILogin, loginSchema } from '~/utils/validation/auth';
import { verify, hash } from 'argon2';
import { decode, encode } from 'next-auth/jwt';
import { type User } from '@prisma/client';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
  }
}

//TODO: Check if needed (these are default values for NextAuth)
const session: Partial<SessionOptions> = {
  strategy: 'database',
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60, // 24 hours
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    //TODO: Clean up and create tests
    signIn() {
      // if (
      //   req.query.nextauth?.includes('callback') &&
      //   req.query.nextauth?.includes('credentials') &&
      //   req.method === 'POST'
      // ) {
      //   if (user && 'id' in user) {
      //     const sessionToken = randomUUID();
      //     const sessionExpiry = new Date(Date.now() + session.maxAge! * 1000);
      //     const forwarded = req.headers['x-forwarded-for'] as string;
      //     const ip = forwarded
      //       ? forwarded.split(/, /)[0]
      //       : req.connection.remoteAddress;

      //     await adapter.createSession({
      //       sessionToken,
      //       userId: user.id,
      //       expires: sessionExpiry,
      //       userAgent: req.headers['user-agent'] ?? null,
      //       ip,
      //     } as any);

      //     const cookies = new Cookies(req, res);
      //     cookies.set('next-auth.session-token', sessionToken, {
      //       expires: sessionExpiry,
      //     });
      //   }
      // }

      return true;
    },
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/welcome`;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  jwt: {
    encode: async ({ token, secret, maxAge }) => {
      //TODO: install cookies package
      // if (
      //   req.query.nextauth?.includes('callback') &&
      //   req.query.nextauth.includes('credentials') &&
      //   req.method === 'POST'
      // ) {
      //   const cookies = new Cookies(req, res);
      //   const cookie = cookies.get('next-auth.session-token');
      //   if (cookie) return cookie;
      //   else return '';
      // }
      // Revert to default behaviour when not in the credentials provider callback flow
      return encode({ token, secret, maxAge });
    },
    decode: async ({ token, secret }) => {
      //TODO: put everything in a wrapper function (advanced initialization)
      // if (
      //   req.query.nextauth?.includes('callback') &&
      //   req.query.nextauth.includes('credentials') &&
      //   req.method === 'POST'
      // ) {
      //   return null;
      // }

      // Revert to default behaviour when not in the credentials provider callback flow
      return decode({ token, secret });
    },
  },
  pages: {
    newUser: '/welcome',
    //TODO: Create custom pages and register them here when done
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
  },
  session,
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    //TODO: Clean up and implement custom auth pages
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      authorize: async (credentials, req): Promise<any> => {
        if (!credentials || req.method === 'POST') {
          return null;
        }

        const { email, password }: ILogin = await loginSchema.parseAsync(
          credentials
        );

        let userFromDb: User | null = null;

        if (email && password) {
          userFromDb = await prisma.user.create({
            data: {
              name: email.split('@')[0],
              email,
              password: await hash(password),
            },
          });
        } else {
          userFromDb = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!userFromDb || !userFromDb.password) {
            return null;
          }

          console.log(password, 'PASSWORD INPUT');
          console.log(userFromDb.password, 'PASSWORD DB');

          const isPasswordValid = await verify(userFromDb.password, password);

          console.log(isPasswordValid, 'PASSWORD CHECK');

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: userFromDb.id,
            email: userFromDb.email,
            name: userFromDb.name,
            role: userFromDb.role,
            image: userFromDb.image,
          };
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_ID,
      clientSecret: env.FACEBOOK_SECRET,
    }),
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
    }),
  ],
  theme: {
    colorScheme: 'auto',
    brandColor: '#a704b5',
    logo: '/favicon.ico',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
