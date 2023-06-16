import { Analytics } from '@vercel/analytics/react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { Toaster } from '~/components/primitives/Toaster';
import Spinner from '~/components/spinners/Spinner';
import { ThemeProvider } from '~/components/utility/ThemeProvider';
import { api } from '~/lib/api';
import { usePageLoading } from '~/lib/use-page-loading';
import '~/styles/globals.css';
import printConsoleLogo from '~/utils/printConsoleLogo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { isPageLoading } = usePageLoading();

  useEffect(() => {
    printConsoleLogo();
  }, []);

  return (
    <>
      <style
        jsx
        global
      >{`
        :root {
          --font-sans: ${inter.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {isPageLoading ? (
            <div className="grid h-[80vh] content-center">
              <Spinner />
            </div>
          ) : (
            <Component {...pageProps} />
          )}
          <Toaster />
        </ThemeProvider>
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
