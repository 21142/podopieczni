import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddPetForm from '~/components/forms/AddPetForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';

const Register: NextPage = () => {
  const { data: userFromSession } = useUserFromSessionQuery();

  if (!userFromSession)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );

  return <DashboardLayout>{userFromSession && <AddPetForm />}</DashboardLayout>;
};

export default Register;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
