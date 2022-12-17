import type { NextPage } from 'next';
import Form from 'src/components/form/Form';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { trpc } from 'src/utils/trpc';

const Register: NextPage = () => {
  const query = trpc.auth.getSession.useQuery();

  const sessionData = query.data;

  return (
    <DashboardLayout>
      {sessionData ? (
        <Form formAction="" />
      ) : (
        <p className="mt-20 text-center">Please log in to see this view</p>
      )}
    </DashboardLayout>
  );
};

export default Register;
