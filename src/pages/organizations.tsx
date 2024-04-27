import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchSheltersResults from '~/components/utility/SearchSheltersResults';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';

const Organizations: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ searchQuery }) => {
  const { data: organizations } =
    api.shelter.querySheltersFulltextSearch.useQuery({
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

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="justify-betweenpb-6 relative z-10 flex items-baseline">
          <SearchSheltersResults results={organizations} />
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

  const shelters = await fetch(`${baseUrl}/api/shelters?search=${search}`).then(
    (res) => res.json()
  );

  return {
    props: {
      organizations: shelters,
      searchQuery: search,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
};
