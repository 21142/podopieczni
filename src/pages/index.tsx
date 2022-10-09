import { GetServerSideProps } from 'next';
import Landing from 'src/components/pages/landing/Landing';
import IAnimalData from 'src/components/utils/search-results/types';
import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';

export interface IResults {
  featuredAnimals?: IAnimalData[];
}

const Home: NextPageWithLayout<IResults> = ({ featuredAnimals }) => {
  return (
    <>
      <Landing featuredAnimals={featuredAnimals} />
    </>
  );
};

Home.getLayout = (page) => {
  return <PageLayout>{page}</PageLayout>;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req ? `${protocol}://${host}` : '';
  const petfindetAnimalsData = await fetch(`${baseUrl}/api/get-animals`).then(
    (res) => res.json()
  );
  if (petfindetAnimalsData) {
    const featuredAnimals = petfindetAnimalsData.slice(10, 16);
    return {
      props: {
        featuredAnimals
      }
    };
  } else {
    return {
      props: {
        featuredAnimals: ['no animals found']
      }
    };
  }
};
