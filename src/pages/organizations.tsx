/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import AdoptionFormCard from '~/components/cards/AdoptionFormCard';
import FilterSheltersResults from '~/components/forms/FilterSheltersResultsForm';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchCategory from '~/components/utility/SearchCategory';
import SearchSheltersResults from '~/components/utility/SearchSheltersResults';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { type Shelter } from '~/types';

const Organizations: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ searchQuery }) => {
  const { t } = useTranslation('common');
  const { data: organizations } = api.shelter.queryAvailableShelters.useQuery({
    searchQuery,
  });

  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery}
          typeOfResults={TypeOfResults.Organization}
        />
      </div>
      <BackgroundWave />

      <main className="container mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <h1 className="max-w-[300px] pb-6 text-2xl font-semibold tracking-tight sm:max-w-none sm:text-4xl">
          {t('organizations_title')}
        </h1>
        <div className="relative z-10 flex items-baseline justify-between pb-6">
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-[250px_minmax(700px,_1fr)]">
            <AdoptionFormCard />
            <div className="hidden lg:row-start-2 lg:row-end-3 lg:block">
              <FilterSheltersResults />
            </div>

            <SearchCategory />
            <SearchSheltersResults results={organizations} />
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Organizations;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const search = query.search ?? '';
  const { host } = context.req.headers;
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = context.req
    ? `${protocol as string}://${host as string}`
    : '';
  const locale = context.locale ?? 'en';

  const shelters: Shelter[] = await fetch(
    `${baseUrl}/api/shelters?search=${search}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error fetching shelters: ${res.toString()}`);
      }
      return res.json();
    })
    .then((data): Shelter[] => {
      return data;
    });

  return {
    props: {
      organizations: shelters,
      searchQuery: search,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
};
