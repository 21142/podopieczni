import { Analytics } from '@vercel/analytics/react';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import '~/styles/globals.css';
import { api } from '~/utils/api';
import printConsoleLogo from '~/utils/printConsoleLogo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
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
        <Component {...pageProps} />
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
