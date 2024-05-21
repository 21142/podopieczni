import { type FC } from 'react';
import Footer from '~/components/navigations/Footer';
import HeadMeta from '~/components/utility/HeadMeta';
import { env } from '~/env.mjs';
import Header from '../navigations/Header';

export interface IPageLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start' | 'items-end';
}

const PageLayout: FC<IPageLayout> = ({
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
        url={env.NEXT_PUBLIC_BASE_URL ?? 'https://podopieczni-dev.vercel.app'}
      />
      <div
        {...divProps}
        className={`mx-auto flex min-h-screen w-full flex-col ${justify}`}
      >
        <Header />
        <main className="flex w-full flex-grow flex-col font-sans">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PageLayout;
