import type { NextPage } from 'next';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import ProfileForm from '~/components/form/ProfileForm';
import Spinner from '~/components/spinner/Spinner';
import LoginToAccessPage from '~/components/utils/login-or-landing/LoginToAccessPage';
import { api } from '~/utils/api';

const RegisterUser: React.FC<NextPage> = () => {
  const {
    data: sessionData,
    isLoading,
    error,
  } = api.auth.getSession.useQuery();

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {sessionData && (
        <ProfileForm
          formAction=""
          title={'Dodaj nową osobę'}
        />
      )}
    </DashboardLayout>
  );
};

export default RegisterUser;
