import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { DataTable } from '~/components/data-table/DataTable';
import { adoptionApplicationColumns } from '~/components/data-table/DataTableColumns';
import { adoptionApplicationColumnsInPolish } from '~/components/data-table/DataTableColumnsInPolish';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const Adoptions: NextPage = () => {
  const { data } = api.adoptionApplication.getAllForShelter.useQuery();
  const { locale } = useRouter();

  const { data: session } = useSession();

  if (!session || session.user.role === Roles.Adopter) {
    return (
      <PageLayout>
        <UnauthorizedPage />
      </PageLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center p-3">
        <div className="container">
          {data && (
            <DataTable
              columns={
                locale === 'pl'
                  ? adoptionApplicationColumnsInPolish
                  : adoptionApplicationColumns
              }
              data={data}
              variant="adoptions"
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Adoptions;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.shelter.getJoinRequests.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 60,
  };
}
