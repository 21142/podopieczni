import type { NextPage } from 'next';
import { DataTable } from '~/components/data-table/DataTable';
import { columns } from '~/components/data-table/DataTableColumns';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import Spinner from '~/components/spinners/Spinner';
import { api } from '~/lib/api';

const Pets: NextPage = () => {
  const { data, isLoading } = api.pet.getAllPetsDataForTable.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex max-h-screen flex-col items-center justify-center">
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
