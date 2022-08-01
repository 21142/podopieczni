import Head from 'next/head';
import Footer from 'src/components/navigation/footer/Footer';
import Header from '../../navigation/header/Header';

export interface IPageLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start' | 'items-end' | 'items-stretch';
}

const PageLayout: React.FC<IPageLayout> = ({
  children,
  justify = 'items-center',
  ...divProps
}) => {
  return (
    <div className="bg-neutral-50">
      <Head>
        <title>podopieczni</title>
        <meta name="description" content="podopieczni" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        {...divProps}
        className={`min-h-screen w-full mx-auto flex flex-col ${justify}`}
      >
        <div className="w-full bg-neutral-0">
          <Header />
        </div>
        <main className="mb-auto pb-20 flex flex-col flex-grow items-center justify-center max-w-8xl">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
