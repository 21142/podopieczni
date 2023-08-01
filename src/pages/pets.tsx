import type { NextPage } from 'next';
import { DataTable } from '~/components/data-table/DataTable';
import { columns } from '~/components/data-table/DataTableColumns';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import { api } from '~/lib/api';
import { ssghelpers } from '~/lib/ssg';

const Pets: NextPage = () => {
  const { data } = api.pet.getAllPetsDataForTable.useQuery();

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center p-3">
        <div className="container">
          {data && (
            <DataTable
              columns={columns}
              data={data}
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Pets;

export async function getStaticProps() {
  await ssghelpers.pet.getAllPetsDataForTable.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
    },
    revalidate: 1,
  };
}
