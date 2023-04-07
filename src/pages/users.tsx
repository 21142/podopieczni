import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import Spinner from '~/components/spinner/Spinner';
import UnauthorizedPage from '~/components/utils/unauthorized/UnauthorizedPage';
import { api } from '~/utils/api';
import { Roles } from '~/utils/constants';

const Users: NextPage = () => {
  const router = useRouter();
  const {
    data: sessionData,
    isLoading,
    error,
  } = api.auth.getSession.useQuery();

  const {
    data: users,
    isLoading: isLoadingUsers,
    error: errorFetchingUsers,
  } = api.user.getAllUsers.useQuery();

  const allUsers = JSON.stringify(users, null, 2);

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );

  if (error || sessionData.role !== Roles.Admin)
    return (
      <DashboardLayout>
        <UnauthorizedPage />
      </DashboardLayout>
    );

  if (isLoadingUsers) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (errorFetchingUsers) {
    return (
      <DashboardLayout>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          <p>Fetching users form the database failed</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center pt-12">
        <CvaButton
          variant="primary"
          className="w-42 rounded-md"
          onClick={() => void router.push('/user/new')}
        >
          Dodaj osobę
        </CvaButton>
        <div className="mx-auto w-full max-w-7xl pt-5 2xl:max-w-8xl">
          {allUsers && <pre>{allUsers}</pre>}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Users;
