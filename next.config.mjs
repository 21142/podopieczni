import i18nConfig from './next-i18next.config.mjs';
import './src/env.mjs';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.pravatar.cc',
      'i.postimg.cc',
      'dl5zpyw5k3jeb.cloudfront.net',
      'lh3.googleusercontent.com',
      'uploadthing.com',
    ],
  },
  i18n: i18nConfig.i18n,
  eslint: {
    // linting on typecheck-format-lint github action
    ignoreDuringBuilds: true,
  },
  typescript: {
    // type checking on typecheck-format-lint github action
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' authjs.dev data: https://lh3.googleusercontent.com https://dl5zpyw5k3jeb.cloudfront.net https://uploadthing.com https://utfs.io; script-src 'self' 'unsafe-eval' 'sha256-eMuh8xiwcX72rRYNAGENurQBAcH7kLlAUQcoOri3BIo=' https://cdn.vercel-insights.com https://vercel.live https://va.vercel-scripts.com/; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src *; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action *; manifest-src 'self'; media-src 'self'; object-src 'self'; worker-src 'self'; block-all-mixed-content; upgrade-insecure-requests;",
          },
          {
            key: 'Permission-Policy',
            value: "geolocation 'self'",
          },
        ],
      },
    ];
  },
  experimental: {
    esmExternals: false,
  },
};

export default config;
