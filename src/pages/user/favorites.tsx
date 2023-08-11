import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import NoFavoritesYet from '~/components/pages/NoFavoritesYet';

const Favorites: NextPage = () => {
  return (
    <PageLayout>
      <NoFavoritesYet />
    </PageLayout>
  );
};

export default Favorites;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
