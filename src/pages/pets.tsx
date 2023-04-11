import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import type IAnimalData from '~/components/utils/search-results/types';

export interface IResults {
  //TODO: change to prisma generated type when Pet/Animal model is added to the db schema
  pets?: IAnimalData[];
}

const Pets: NextPage<IResults> = () => {
  const router = useRouter();
  return (
    <DashboardLayout>
      <section className="flex min-h-[80%] flex-col items-center justify-center gap-y-32">
        <CvaButton
          variant="primary"
          className="w-42 rounded-md"
          onClick={() => void router.push('/register')}
        >
          Dodaj zwierzaka
        </CvaButton>
        <p>No animals added yet...</p>
      </section>
    </DashboardLayout>
  );
};

export default Pets;
