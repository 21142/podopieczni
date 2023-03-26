import type { NextPage } from 'next';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import Blob from 'src/components/utils/blob/Blob';
import { api } from '~/utils/api';
import { Roles } from '~/utils/constants';
import Spinner from '~/components/spinner/Spinner';
import GlobalStatistics from '~/components/utils/statistics/GlobalStatistics';
import { mockGlobalStatisticsProps } from '~/components/utils/statistics/GlobalStatistics.mocks';
import LoginToAccessPage from '~/components/utils/login-or-landing/LoginToAccessPage';

const Dashboard: NextPage = () => {
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
        <LoginToAccessPage />
      </DashboardLayout>
    );
  return (
    <DashboardLayout>
      {sessionData && sessionData.role !== Roles.Shelter && (
        <div className="mx-auto w-full max-w-7xl pt-80 2xl:max-w-8xl">
          <GlobalStatistics {...mockGlobalStatisticsProps.base} />
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
