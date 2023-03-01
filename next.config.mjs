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
};
export default config;
