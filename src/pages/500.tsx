import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import Custom500Page from '~/components/pages/Custom500Page';

const CustomServerErrorPage = () => {
  return (
    <PageLayout>
      <Custom500Page />
    </PageLayout>
  );
};

export default CustomServerErrorPage;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
