import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import NoFavoritesYet from '~/components/pages/NoFavoritesYet';
import Spinner from '~/components/spinner/Spinner';
import FavoritePets from '~/components/utility/FavoritePets';
import { api } from '~/lib/api';

const Favorites: NextPage = () => {
  const { t } = useTranslation('common');
  const { data: session } = useSession();

  const { data: favoritePets, isLoading } = api.user.getFavoritePets.useQuery(
    undefined,
    { enabled: session?.user !== undefined }
  );

  if (!session)
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (!favoritePets || favoritePets.length === 0)
    return (
      <PageLayout>
        <NoFavoritesYet />
      </PageLayout>
    );

  return (
    <PageLayout>
      <div className="p-11">
        <h1 className="max-w-[300px] text-3xl font-semibold tracking-tight sm:max-w-none sm:text-4xl">
          {t('favorite_pets_title')}
        </h1>
        <h2 className="pb-10 text-xl font-medium tracking-tighter text-muted-foreground">
          {t('favorite_pets_subtitle')}
        </h2>
        <FavoritePets favoritePets={favoritePets} />
      </div>
    </PageLayout>
  );
};

export default Favorites;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
