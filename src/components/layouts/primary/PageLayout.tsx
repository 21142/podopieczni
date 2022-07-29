import Head from 'next/head';

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
      <div {...divProps} className={`min-h-screen flex flex-col ${justify}`}>
        {/* <Header /> */}
        <main className="px-5">{children}</main>
        <div className="m-auto" />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default PageLayout;
