import type { NextPage } from 'next';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { Button } from '~/components/primitives/Button';

const Statistics: NextPage = () => {
  return (
    <DashboardLayout>
      <div className="grid h-full grid-cols-3 content-center gap-12 p-10">
        <Button variant="default">Dodaj wniosek</Button>
        <Button variant="subtle">Dodaj wniosek</Button>
        <Button variant="outline">Dodaj wniosek</Button>
        <Button variant="ghost">Dodaj wniosek</Button>
        <Button variant="destructive">Dodaj wniosek</Button>
        <Button variant="link">Dodaj wniosek</Button>
        <Button variant="primary">Dodaj wniosek</Button>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
