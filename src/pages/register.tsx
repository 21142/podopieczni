import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import NewAnimalForm from '~/components/form/NewAnimalForm';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/utils/api';

const Register: NextPage = () => {
  const router = useRouter();

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
        <div className="grid h-[50vh] content-center">
          <p className="p-12 text-center">
            Please log in using an account associated with a shelter to see this
            view
          </p>
          <div className="flex justify-center gap-5">
            <CvaButton
              variant="primary"
              className="w-36 rounded-md px-4 py-2"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
              {sessionData ? 'Wyloguj się' : 'Zaloguj się'}
            </CvaButton>
            <CvaButton
              variant="secondary"
              className="w-36 rounded-md"
              onClick={() => void router.push('/')}
            >
              Strona główna
            </CvaButton>
          </div>
        </div>
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
