import Head from 'next/head';
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
    <>
      <Head>
        <title>podopieczni</title>
        <meta name="description" content="podopieczni" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        {...divProps}
        className={`min-h-screen max-w-7xl mx-auto flex flex-col ${justify}`}
      >
        <Header className="border" />
        <main className="border flex flex-col items-center justify-center h-screen p-4 px-5">
          {children}
        </main>
        <div className="m-auto" />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default PageLayout;
