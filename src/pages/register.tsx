import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Form from 'src/components/form/Form';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import { api } from '~/utils/api';

const Register: NextPage = () => {
  const router = useRouter();

  const { data: sessionData } = api.auth.getSession.useQuery();

  return (
    <DashboardLayout>
      {sessionData ? (
        <Form formAction="" />
      ) : (
        <div className="grid h-[50vh] content-center">
          <p className="p-12 text-center">Please log in to see this view</p>
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
      )}
    </DashboardLayout>
  );
};

export default Register;
