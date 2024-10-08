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
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    VERCEL_URL: z.string().optional(),
    EMAIL_FROM: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    UPLOADTHING_SECRET: z.string(),
    UPLOADTHING_APP_ID: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
});
