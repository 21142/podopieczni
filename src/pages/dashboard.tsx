import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import Blob from 'src/components/utils/blob/Blob';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import { api } from '~/utils/api';
import { Roles } from '~/utils/constants';
import Spinner from '~/components/spinner/Spinner';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const {
    data: sessionData,
    isLoading,
    error,
  } = api.auth.getSession.useQuery();

  if (isLoading)
    return (
      <DashboardLayout>
        <Spinner />
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
      {sessionData && sessionData.role !== Roles.Shelter && (
        <div className="mx-auto w-full max-w-7xl pt-80 2xl:max-w-8xl">
          <div className="relative">
            <Blob
              bgColor={'bg-purple-300'}
              positionX={'top-0'}
              positionY={'-left-4'}
            />
            <Blob
              bgColor={'bg-primary-50'}
              positionX={'top-0'}
              positionY={'-right-4'}
              animationDelay={'animation-delay-2'}
            />
            <Blob
              bgColor={'bg-primary-300/40'}
              positionX={'-bottom-8'}
              positionY={'left-20'}
              animationDelay={'animation-delay-4'}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
