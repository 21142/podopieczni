import { type FC } from 'react';
import Footer from '~/components/navigations/Footer';
import HeadMeta from '~/components/utility/HeadMeta';
import { env } from '~/env.mjs';
import { createFormattedForOgImageUrl, truncate } from '~/lib/utils';
import Header from '../navigations/Header';

export interface IPageLayout extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  description?: string;
  name?: string;
  image?: string;
  url?: string;
  justify?: 'items-center' | 'items-start' | 'items-end';
}

const PageLayout: FC<IPageLayout> = ({
  title,
  description,
  name,
  image,
  children,
  justify = 'items-center',
  ...divProps
}) => {
  const formattedForOgImageUrl = createFormattedForOgImageUrl({
    name,
    image,
    description,
  });

  return (
    <div className="overflow-x-hidden">
      <HeadMeta
        title={
          title ??
          'podopieczni - Pomoc w znalezieniu zwierząt gotowych do adopcji.'
        }
        description={
          description
            ? truncate(description)
            : 'Szukaj podopiecznych gotowych do adopcji i pasujących do twoich preferencji.'
        }
        keywords={'psy, koty, adopcja zwierząt, schroniska'}
        type={'website'}
        url={
          formattedForOgImageUrl ||
          env.NEXT_PUBLIC_BASE_URL ||
          'https://podopieczni-21142.vercel.app'
        }
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
