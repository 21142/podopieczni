import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddPetForm from '~/components/forms/AddPetForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';

const Register: NextPage = () => {
  const { data: session } = useSession();

  if (!session)
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );

  return (
    <DashboardLayout>
      <AddPetForm />
    </DashboardLayout>
  );
};

export default Register;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
  },
});
