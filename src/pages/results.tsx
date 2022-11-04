import PageLayout from '../components/layouts/primary/PageLayout';
import { NextPageWithLayout } from './page';
import IAnimalData from 'src/components/utils/search-results/types';
import { GetServerSideProps } from 'next';
import SearchResults from 'src/components/utils/search-results/SearchResults';
import Search from 'src/components/inputs/search/Search';

export interface IResults {
  animals?: IAnimalData[];
  searchQuery: string;
}

const Results: NextPageWithLayout<IResults> = ({ animals, searchQuery }) => {
  return (
    <>
      <div className="flex text-center bg-primary-300 w-full items-center justify-center pt-4">
        <Search query={searchQuery} />
      </div>
      <div id="featured" className="aspect-[40/1] rotate-180">
        <svg
          id="visual"
          viewBox="0 0 3840 96"
          width="3840"
          height="96"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <path
            d="M0 26L40 26.7C80 27.3 160 28.7 240 33.8C320 39 400 48 480 50.7C560 53.3 640 49.7 720 45.3C800 41 880 36 960 33.8C1040 31.7 1120 32.3 1200 31C1280 29.7 1360 26.3 1440 28C1520 29.7 1600 36.3 1680 37.2C1760 38 1840 33 1920 33.2C2000 33.3 2080 38.7 2160 40.5C2240 42.3 2320 40.7 2400 40.2C2480 39.7 2560 40.3 2640 37.3C2720 34.3 2800 27.7 2880 27.5C2960 27.3 3040 33.7 3120 34.3C3200 35 3280 30 3360 32.7C3440 35.3 3520 45.7 3600 47.8C3680 50 3760 44 3800 41L3840 38L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#eebdf2"
          ></path>
          <path
            d="M0 63L40 61C80 59 160 55 240 56.2C320 57.3 400 63.7 480 66.8C560 70 640 70 720 68.3C800 66.7 880 63.3 960 59.3C1040 55.3 1120 50.7 1200 47.5C1280 44.3 1360 42.7 1440 44.2C1520 45.7 1600 50.3 1680 52.8C1760 55.3 1840 55.7 1920 57.3C2000 59 2080 62 2160 61.5C2240 61 2320 57 2400 53.3C2480 49.7 2560 46.3 2640 44.5C2720 42.7 2800 42.3 2880 42.2C2960 42 3040 42 3120 43.5C3200 45 3280 48 3360 52.2C3440 56.3 3520 61.7 3600 61.7C3680 61.7 3760 56.3 3800 53.7L3840 51L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#cc73d4"
          ></path>
          <path
            d="M0 79L40 79.7C80 80.3 160 81.7 240 79C320 76.3 400 69.7 480 69.5C560 69.3 640 75.7 720 76.2C800 76.7 880 71.3 960 71.2C1040 71 1120 76 1200 79.3C1280 82.7 1360 84.3 1440 83.5C1520 82.7 1600 79.3 1680 78.2C1760 77 1840 78 1920 76.5C2000 75 2080 71 2160 68.5C2240 66 2320 65 2400 66.8C2480 68.7 2560 73.3 2640 73.5C2720 73.7 2800 69.3 2880 68.5C2960 67.7 3040 70.3 3120 71.8C3200 73.3 3280 73.7 3360 72.7C3440 71.7 3520 69.3 3600 70.5C3680 71.7 3760 76.3 3800 78.7L3840 81L3840 97L3800 97C3760 97 3680 97 3600 97C3520 97 3440 97 3360 97C3280 97 3200 97 3120 97C3040 97 2960 97 2880 97C2800 97 2720 97 2640 97C2560 97 2480 97 2400 97C2320 97 2240 97 2160 97C2080 97 2000 97 1920 97C1840 97 1760 97 1680 97C1600 97 1520 97 1440 97C1360 97 1280 97 1200 97C1120 97 1040 97 960 97C880 97 800 97 720 97C640 97 560 97 480 97C400 97 320 97 240 97C160 97 80 97 40 97L0 97Z"
            fill="#a704b5"
          ></path>
        </svg>
      </div>
      <div className="flex text-center justify-center pt-10 mx-auto max-w-8xl">
        <div className="hidden md:inline-flex bg-gray-400 w-32">
          FILTER MENU PLACEHOLDER
        </div>
        <div className="flex flex-col">
          <div className="hidden md:inline-flex bg-neutral-200">
            FILTERS ROW PLACEHOLDER
          </div>
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
        animals: animals,
        searchQuery: search,
      },
    };
  } else {
    return {
      props: {
        animals: ['no animals found'],
        searchQuery: search,
      },
    };
  }
};
