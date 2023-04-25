import type { NextPage } from 'next';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import NewAnimalForm from '~/components/form/NewAnimalForm';
import LoginToAccessPage from '~/components/utils/login-or-landing/LoginToAccessPage';
import { api } from '~/utils/api';

const Register: NextPage = () => {
  const { data: sessionData } = api.auth.getSession.useQuery();

  if (!sessionData)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {sessionData && (
        <NewAnimalForm
          formAction=""
          title={'Your new pet'}
        />
      )}
    </DashboardLayout>
  );
};

export default Register;
