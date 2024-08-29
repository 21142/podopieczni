import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddPetForm from '~/components/forms/AddPetForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import { Roles } from '~/lib/constants';

const Register: NextPage = () => {
  const { data: session } = useSession();

  if (!session || session.user.role === Roles.Adopter)
    return (
      <PageLayout>
        <UnauthorizedPage />
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
