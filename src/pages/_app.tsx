import '@uploadthing/react/styles.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { type Session } from 'next-auth';
import { appWithTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { Toaster } from '~/components/primitives/Toaster';
import Spinner from '~/components/spinner/Spinner';
import AppProviders from '~/components/utility/AppProviders';
import { usePageLoading } from '~/hooks/usePageLoading';
import { api } from '~/lib/api';
import { setCookie } from '~/lib/cookie';
import printConsoleLogo from '~/lib/printConsoleLogo';
import { detectSystemTheme } from '~/lib/themeDetection';
import '~/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  preload: true,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { isPageLoading } = usePageLoading();

  useEffect(() => {
    const initialSystemTheme = detectSystemTheme();
    setCookie('theme', initialSystemTheme);
    printConsoleLogo();
  }, []);

  return (
    <>
      <style
        jsx
        global
      >
        {`
          :root {
            --font-sans: ${inter.style.fontFamily};
          }
        `}
      </style>

      <AppProviders session={session}>
        {isPageLoading ? (
          <div className="grid h-[80vh] content-center overflow-x-hidden">
            <Spinner />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
        <Toaster />
      </AppProviders>

      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default api.withTRPC(appWithTranslation(MyApp, i18nConfig));
