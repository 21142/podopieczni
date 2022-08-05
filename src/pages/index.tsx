import Landing from 'src/components/pages/landing/Landing';
import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Landing />
    </>
  );
};

Home.getLayout = (page) => {
  return <PageLayout>{page}</PageLayout>;
};

export default Home;
