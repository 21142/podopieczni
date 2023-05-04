import type { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import Blob from 'src/components/utils/blob/Blob';
import GlobalStatistics from '~/components/utils/statistics/GlobalStatistics';
import { mockGlobalStatisticsProps } from '~/components/utils/statistics/GlobalStatistics.mocks';
import { getServerAuthSession } from '~/server/auth';
import { getBaseUrl } from '~/utils/api';
import { Roles } from '~/utils/constants';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      {session && session.user.role !== Roles.Adopter && (
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

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${getBaseUrl()}/dashboard&error=SessionRequired`,
      },
    };
  }
  return { props: {} };
}
