import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import CheckInbox from '~/components/utility/CheckInbox';

const CheckInboxForMagicLinkPage = () => {
  return (
    <PageLayout>
      <CheckInbox />
    </PageLayout>
  );
};

export default CheckInboxForMagicLinkPage;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
