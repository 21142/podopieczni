import type { NextPage } from 'next';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';

const Home: NextPage = () => {
  return (
    <PageLayout>
      <UnauthorizedPage />
    </PageLayout>
  );
};

export default Home;
