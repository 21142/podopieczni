import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddPersonForm from '~/components/forms/AddPersonForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import Spinner from '~/components/spinner/Spinner';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const RegisterUser: NextPage = () => {
  const { data: sessionData, isLoading, error } = useUserFromSessionQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || sessionData?.role === Roles.Adopter)
    return (
      <DashboardLayout>
        <UnauthorizedPage />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {sessionData && sessionData.role !== Roles.Adopter && <AddPersonForm />}
    </DashboardLayout>
  );
};

export default RegisterUser;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.user.getAllPeopleAssociatedWithShelter.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
