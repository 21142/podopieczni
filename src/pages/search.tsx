import ChevronDoubleUpIcon from '@heroicons/react/solid/ChevronDoubleUpIcon';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchResults from '~/components/utility/SearchResults';
import type IAnimalData from '~/lib/petfinderTypes';
import { TypeOfResults } from '~/utils/constants';

export interface IResults {
  animals?: IAnimalData[];
  searchQuery: string;
}

export interface PetfinderOauth {
  access_token: string;
}

const SearchPage: NextPage<IResults> = ({ animals, searchQuery }) => {
  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery}
          typeOfResults={TypeOfResults.Animal}
        />
      </div>
      <BackgroundWave />

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 flex items-baseline justify-between border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            {searchQuery ? `Results for ${searchQuery}` : 'Our pets'}
          </h1>
        </div>

        <section
          aria-labelledby="pets-heading"
          className="pt-6 pb-24"
        >
          <h2
            id="products-heading"
            className="sr-only"
          >
            Pets
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <div className="bg-slate-600"></div>
            <SearchResults
              results={animals}
              typeOfResults="pet"
            />
          </div>
        </section>
        <Link
          href="#scrollToPosition"
          scroll={false}
          className="-mt-6 flex justify-center"
        >
          <ChevronDoubleUpIcon className="duration-50 h-12 cursor-pointer text-primary-300 transition-transform ease-in-out hover:scale-95" />
        </Link>
      </main>
    </PageLayout>
  );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.search ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const petfindetOauthData = (await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json())) as PetfinderOauth;
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    const petfinderAPIURL = 'https://api.petfinder.com/v2/';
    const fallbackURL = `${petfinderAPIURL}animals?location=22152`;
    let url = fallbackURL;
    if (search !== '') {
      url = `https://api.petfinder.com/v2/animals?type=${search}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as IResults;
    const animals = petfindetData?.animals;

    if (!animals)
      return {
        props: {
          animals: null,
          searchQuery: search,
        },
      };

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
