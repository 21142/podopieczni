import Head from 'next/head';
import Footer from 'src/components/navigation/footer/Footer';
import { getBaseUrl } from 'src/utils/getBaseUrl';
import Header from '../../navigation/header/Header';

export interface IPageLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start' | 'items-end';
}

const PageLayout: React.FC<IPageLayout> = ({
  children,
  justify = 'items-center',
  ...divProps
}) => {
  return (
    <div className="overflow-x-hidden bg-neutral-50">
      <Head>
        <title>podopieczni</title>
        <meta
          property="og:title"
          content="podopieczni | Pomoc w procesie adopcji zwierząt"
        />
        <meta
          name="og:description"
          content="Szukaj podopiecznych gotowych do adopcji i pasujących do twoich preferencji."
        />
        <meta
          property="og:image"
          content={'https://podopieczni-dev.vercel.app/api/og-image'}
        />
        <meta
          property="og:url"
          content="https://podopieczni-21142.vercel.app/"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:locale"
          content="pl_PL"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <div
        {...divProps}
        className={`mx-auto flex min-h-screen w-full flex-col ${justify}`}
      >
        <div className="w-full bg-neutral-0">
          <Header />
        </div>
        <main className="flex w-full flex-grow flex-col">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
