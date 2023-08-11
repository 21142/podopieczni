import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';

const Unauthorized: NextPage = () => {
  return (
    <PageLayout>
      <UnauthorizedPage />
    </PageLayout>
  );
};

export default Unauthorized;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
