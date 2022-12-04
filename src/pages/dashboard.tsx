import type { NextPage } from 'next';
import Form from 'src/components/form/Form';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import { trpc } from 'src/utils/trpc';

const Dashboard: NextPage = () => {
  const getAllUsers = trpc.user.getAllUsers.useQuery();

  const allUsers = JSON.stringify(getAllUsers.data, null, 2);

  return (
    <>
      <PageLayout>
        <pre>{allUsers}</pre>
        <div className="grid place-items-center">
          <Form formAction="" />
        </div>
      </PageLayout>
    </>
  );
};

export default Dashboard;
