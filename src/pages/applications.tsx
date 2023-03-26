import type { NextPage } from 'next';
import DashboardLayout from 'src/components/layouts/dashboard/DashboardLayout';
import GlobalStatistics from '~/components/utils/statistics/GlobalStatistics';
import { mockGlobalStatisticsProps } from '~/components/utils/statistics/GlobalStatistics.mocks';

const Statistics: NextPage = () => {
  return (
    <DashboardLayout>
      <GlobalStatistics {...mockGlobalStatisticsProps.base} />
    </DashboardLayout>
  );
};

export default Statistics;
