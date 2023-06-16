import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // browser should use relative url
    return '';
  }
  const protocol = process.env.VERCEL_URL ? 'https://' : 'http://';
  const hostname =
    process.env.VERCEL_URL ?? `localhost:${process.env.PORT ?? 3000}`;

  return `${protocol}${hostname}`;
}
