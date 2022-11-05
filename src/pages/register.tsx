import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Form from 'src/components/form/Form';
import PageLayout from 'src/components/layouts/primary/PageLayout';

const Register: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <PageLayout>
        {sessionData ? (
          <Form />
        ) : (
          <p className="text-center mt-20">Please log in to see this view</p>
        )}
      </PageLayout>
    </>
  );
};

export default Register;
