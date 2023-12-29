import type { NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { DataTable } from '~/components/data-table/DataTable';
import { columns } from '~/components/data-table/DataTableColumns';
import { columnsInPolish } from '~/components/data-table/DataTableColumnsInPolish';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import { api } from '~/lib/api';
import { ssghelpers } from '~/lib/ssg';

const Pets: NextPage = () => {
  const { data } = api.pet.getAllPetsDataForTable.useQuery();
  const { locale } = useRouter();

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center p-3">
        <div className="container">
          {data && (
            <DataTable
              columns={locale === 'pl' ? columnsInPolish : columns}
              data={data}
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Pets;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.pet.getAllPetsDataForTable.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
