import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import UserDetailsForm from '~/components/forms/UserDetailsForm';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import Spinner from '~/components/spinner/Spinner';
import useMeQuery from '~/hooks/useMeQuery';

const UserSettings = () => {
  const { data: me, isLoading, error } = useMeQuery();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (error)
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );

  return <PageLayout>{me && <UserDetailsForm user={me} />}</PageLayout>;
};

export default UserSettings;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
