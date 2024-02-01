import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import Custom404Page from '~/components/pages/Custom404Page';

const CustomNotFoundPage = () => {
  return (
    <PageLayout>
      <Custom404Page />
    </PageLayout>
  );
};

export default CustomNotFoundPage;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
