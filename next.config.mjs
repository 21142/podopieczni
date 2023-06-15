// @ts-check

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.pravatar.cc',
      'i.postimg.cc',
      'dl5zpyw5k3jeb.cloudfront.net',
      'lh3.googleusercontent.com',
    ],
  },
  i18n: {
    locales: ['pl'],
    defaultLocale: 'pl',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' authjs.dev data:; script-src 'self' 'unsafe-eval' https://cdn.vercel-insights.com https://vercel.live; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src *; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action *; manifest-src 'self'; media-src 'self'; object-src 'self'; worker-src 'self'; block-all-mixed-content; upgrade-insecure-requests;",
          },
          {
            key: 'Permission-Policy',
            value: "geolocation 'self'",
          },
        ],
      },
    ];
  },
};

export default config;
