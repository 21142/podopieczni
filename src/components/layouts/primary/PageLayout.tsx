import Footer from 'src/components/navigation/footer/Footer';
import HeadMeta from 'src/components/utils/head-seo/HeadMeta';
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
    <div className="overflow-x-hidden">
      <HeadMeta
        title={
          'podopieczni - Pomoc w znalezieniu zwierząt gotowych do adopcji.'
        }
        description={
          'Szukaj podopiecznych gotowych do adopcji i pasujących do twoich preferencji.'
        }
        keywords={'psy, koty, adopcja zwierząt, schroniska'}
        type={'website'}
        url={
          process.env.NEXT_PUBLIC_BASE_URL ??
          'https://podopieczni-dev.vercel.app'
        }
      />
      <div
        {...divProps}
        className={`mx-auto flex min-h-screen w-full flex-col ${justify}`}
      >
        <div className="w-full">
          <Header />
        </div>
        <main className="flex w-full flex-grow flex-col font-sans">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
