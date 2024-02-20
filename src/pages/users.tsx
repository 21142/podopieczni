import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AddPersonForm from '~/components/forms/AddPersonForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import Spinner from '~/components/spinner/Spinner';
import Grid from '~/components/utility/Grid';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const Users: NextPage = () => {
  const { data: sessionData, isLoading, error } = useUserFromSessionQuery();

  const { data: users, error: errorFetchingUsers } =
    api.user.getAllUsers.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error || sessionData.role === Roles.Adopter)
    return (
      <DashboardLayout>
        <UnauthorizedPage />
      </DashboardLayout>
    );

  if (errorFetchingUsers) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          <p>Fetching users form the database failed</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {sessionData && (
        <>
          {sessionData.role === Roles.Admin && <AddPersonForm />}
          {users && <Grid items={users} />}
        </>
      )}
    </DashboardLayout>
  );
};

export default Users;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.user.getAllUsers.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
