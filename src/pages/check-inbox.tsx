import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSearchParams } from 'next/navigation';
import PageLayout from '~/components/layouts/PageLayout';
import CheckInbox from '~/components/utility/CheckInbox';

const CheckInboxForMagicLinkPage = () => {
  const params = useSearchParams();
  const joinRequest =
    params.get('joinRequest') || params.get('adoptionApplication');

  return (
    <PageLayout>
      <CheckInbox joinRequest={joinRequest} />
    </PageLayout>
  );
};

export default CheckInboxForMagicLinkPage;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
