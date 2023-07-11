import type { NextPage } from 'next';
import PageLayout from '~/components/layouts/PageLayout';
import Landing from '~/components/pages/Landing';

const Home: NextPage = () => {
  return (
    <PageLayout>
      <Landing />
    </PageLayout>
  );
};

export default Home;
