import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    PETFINDER_KEY: z.string(),
    PETFINDER_SECRET: z.string(),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    EMAIL_SERVER: z.string(),
    EMAIL_FROM: z.string(),
    VERCEL_URL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  },
  // using Next.js < 13.4.4, need to specify the runtimeEnv manually
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    PETFINDER_KEY: process.env.PETFINDER_KEY,
    PETFINDER_SECRET: process.env.PETFINDER_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
});
