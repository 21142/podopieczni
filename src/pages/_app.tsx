import '../styles/globals.css';
import { NextPageWithLayout } from './page';
import type AppProps from 'next/app';
import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
  pageProps: any;
}

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
