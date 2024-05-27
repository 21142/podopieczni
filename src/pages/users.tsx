import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { DataTable } from '~/components/data-table/DataTable';
import { usersColumns } from '~/components/data-table/DataTableColumns';
import { usersColumnsInPolish } from '~/components/data-table/DataTableColumnsInPolish';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import Spinner from '~/components/spinner/Spinner';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const People: NextPage = () => {
  const { locale } = useRouter();

  const { data: sessionData, isLoading, error } = useUserFromSessionQuery();

  const { data: users, error: errorFetchingUsers } =
    api.user.getAllPeopleAssociatedWithShelter.useQuery();

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
      <section className="flex flex-col items-center justify-center p-3">
        <div className="container">
          {users && (
            <DataTable
              columns={locale === 'pl' ? usersColumnsInPolish : usersColumns}
              data={users}
              variant="users"
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default People;

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
