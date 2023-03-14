import type { NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import Blob from 'src/components/utils/blob/Blob';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/utils/api';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = api.auth.getSession.useQuery();

  const { data: users, status } = api.user.getAllUsers.useQuery();

  const allUsers = JSON.stringify(users, null, 2);

  return (
    <DashboardLayout>
      {sessionData ? (
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          {status === 'success' ? (
            <pre>{allUsers}</pre>
          ) : status === 'loading' ? (
            <Spinner />
          ) : (
            <p>Fetching users form the database failed</p>
          )}
          <div className="relative">
            <Blob
              bgColor={'bg-primary-50'}
              positionX={'top-0'}
              positionY={'-left-4'}
            />
            <Blob
              bgColor={'bg-purple-300'}
              positionX={'top-0'}
              positionY={'-right-4'}
              animationDelay={'animation-delay-2'}
            />
            <Blob
              bgColor={'bg-indigo-300'}
              positionX={'-bottom-8'}
              positionY={'left-20'}
              animationDelay={'animation-delay-4'}
            />
          </div>
        </div>
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

export default Dashboard;
