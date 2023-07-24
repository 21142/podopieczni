import type { NextPage } from 'next';
import AddPetForm from '~/components/forms/AddPetForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import { api } from '~/lib/api';

const Register: NextPage = () => {
  const { data: sessionData } = api.auth.getSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (!sessionData)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );

  return <DashboardLayout>{sessionData && <AddPetForm />}</DashboardLayout>;
};

export default Register;
