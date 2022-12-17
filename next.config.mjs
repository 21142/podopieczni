/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  images: {
    domains: ['i.pravatar.cc', 'i.postimg.cc', 'dl5zpyw5k3jeb.cloudfront.net'],
  },
  i18n: {
    locales: ['pl'],
    defaultLocale: 'pl',
  },
});
