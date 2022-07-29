import '../styles/globals.css';
import { NextPageWithLayout } from './page';
import type AppProps from 'next/app';
import '../styles/globals.css';

interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout;
  pageProps: any;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
