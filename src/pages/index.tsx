import type { NextPage } from 'next';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import Landing from 'src/components/pages/landing/Landing';

export interface IResults {}

const Home: NextPage<IResults> = () => {
  return (
    <>
      <PageLayout>
        <Landing />
      </PageLayout>
    </>
  );
};

export default Home;
