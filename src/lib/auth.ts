import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { render } from '@react-email/render';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GoogleProvider from 'next-auth/providers/google';
import nodemailer from 'nodemailer';
import WelcomeEmail from '~/components/emails/Welcome';
import { links } from '~/config/siteConfig';
import { env } from '~/env.mjs';
import { prisma } from '~/lib/db';

export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  pages: {
    newUser: links.welcome,
    signIn: links.signIn,
    verifyRequest: links.checkInbox,
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      sendVerificationRequest: ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        return new Promise((resolve, reject) => {
          // TODO: Extract into a seprate function/service
          const emailHtml = render(WelcomeEmail({ name: email, href: url }));

          nodemailer.createTransport(server as string).sendMail(
            {
              to: email,
              from,
              subject: 'Sign in to podopieczni.pl',
              text: `Sign in to podopieczni.pl\n${url}`,
              html: emailHtml,
            },
            (error) => {
              if (error) {
                console.log(error);
                return reject();
              }
              return resolve();
            }
          );
        });
      },
    }),
  ],
  theme: {
    colorScheme: 'auto',
    brandColor: '#a704b5',
    logo: '/favicon.ico',
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
