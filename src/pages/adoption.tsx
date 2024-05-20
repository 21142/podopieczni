import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import WorkInProgress from '~/components/pages/WorkInProgressPage';

const Adoption = () => {
  return (
    <PageLayout>
      <WorkInProgress />
    </PageLayout>
  );
};

export default Adoption;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
