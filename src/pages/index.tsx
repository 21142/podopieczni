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
      <Landing featuredAnimals={featuredAnimals}/>
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
  const petfindetOauthData = await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json());
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    const petfindetData = await fetch(
      'https://api.petfinder.com/v2/animals?location=22152',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((res) => res.json());
    const allAnimals: IAnimalData[] = petfindetData.animals;
    const featuredAnimals = allAnimals.slice(10, 16);
    return {
      props: {
        featuredAnimals,
      },
    };
  } else {
    return {
      props: {
        featuredAnimals: ['no animals found'],
      },
    };
  }
};
