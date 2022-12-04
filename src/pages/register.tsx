import type { NextPage } from 'next';
import Form from 'src/components/form/Form';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import { trpc } from 'src/utils/trpc';

const Register: NextPage = () => {
  const query = trpc.auth.getSession.useQuery();

  const sessionData = query.data;

  return (
    <>
      <PageLayout>
        {sessionData ? (
          <Form formAction="" />
        ) : (
          <p className="mt-20 text-center">Please log in to see this view</p>
        )}
      </PageLayout>
    </>
  );
};

export default Register;
