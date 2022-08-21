import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';
import IAnimalData from 'src/components/utils/search-results/types';
import { GetServerSideProps } from 'next';
import SearchResults from 'src/components/utils/search-results/SearchResults';

export interface IResults {
  animals?: IAnimalData[];
}

const Results: NextPageWithLayout<IResults> = ({ animals }) => {
  return (
    <>
      <div className="flex text-center justify-center mt-5 pt-12 mx-auto max-w-8xl">
        <div className="bg-gray-400 w-32">FILTER MENU PLACEHOLDER</div>
        <div className="flex flex-col">
          <div className="bg-neutral-200">FILTERS ROW PLACEHOLDER</div>
          <SearchResults results={animals} />
        </div>
      </div>
    </>
  );
};

Results.getLayout = (page) => {
  return <PageLayout>{page}</PageLayout>;
};

export default Results;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.search ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req ? `${protocol}://${host}` : '';
  const petfindetOauthData = await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json());
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    let url = 'https://api.petfinder.com/v2/animals?location=22152';
    if (search) {
      url = `https://api.petfinder.com/v2/animals?location=${search}`;
    }
    const petfindetData = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
    const animals: IAnimalData[] = petfindetData?.animals;
    return {
      props: {
        animals,
      },
    };
  } else {
    return {
      props: {
        animals: ['no animals found'],
      },
    };
  }
};
