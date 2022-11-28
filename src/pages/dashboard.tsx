import type { NextPage } from 'next';
import Form from 'src/components/form/Form';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import { trpc } from 'src/utils/trpc';

const Dashboard: NextPage = () => {
  const query = trpc.auth.getSecretMessage.useQuery();

  const loggedInTestMsg = query.data;

  return (
    <>
      <PageLayout>
        <div className="grid place-items-center">
          <div className="">{loggedInTestMsg}</div>
          <Form formAction="" />
        </div>
      </PageLayout>
    </>
  );
};

export default Dashboard;
