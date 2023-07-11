import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/primitives/Table';
import type IAnimalData from '~/lib/petfinderTypes';

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
          onClick={() => void router.push('/animal/register')}
        >
          Dodaj zwierzaka
        </CvaButton>
        <p>No animals added yet...</p>
        <div className="container">
          <Table>
            <TableCaption>222 dostępnych zwierząt</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Spieces</TableHead>
                <TableHead className="text-right">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">[LOGO]</TableCell>
                <TableCell>Loki</TableCell>
                <TableCell>czeka na nowy dom</TableCell>
                <TableCell>Dog</TableCell>
                <TableCell className="text-right">Paluch</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Pets;
