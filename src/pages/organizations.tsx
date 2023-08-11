import type { GetServerSideProps, NextPage } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Search from '~/components/inputs/Search';
import PageLayout from '~/components/layouts/PageLayout';
import BackgroundWave from '~/components/utility/BackgroundWave';
import SearchResults from '~/components/utility/SearchResults';
import { type IOrganizationData } from '~/types/petfinderTypes';

export interface IResults {
  organizations?: IOrganizationData[];
  searchQuery: string;
}

export interface PetfinderOauth {
  access_token: string;
}

const Organizations: NextPage<IResults> = ({ organizations, searchQuery }) => {
  return (
    <PageLayout>
      <div
        id="scrollToPosition"
        className="flex w-full items-center justify-center bg-primary-300 pt-4 text-center"
      >
        <Search
          query={searchQuery}
          typeOfResults="organizations"
        />
      </div>
      <BackgroundWave />

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="justify-betweenpb-6 relative z-10 flex items-baseline">
          <SearchResults
            results={organizations}
            typeOfResults="organization"
          />
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

  const petfindetOauthData = (await fetch(
    `${baseUrl}/api/petfinder-oauth-token`
  ).then((res) => res.json())) as PetfinderOauth;
  const accessToken = petfindetOauthData.access_token;
  if (accessToken) {
    let url = 'https://api.petfinder.com/v2/organizations?location=22152';
    if (search) {
      url = `https://api.petfinder.com/v2/organizations?location=${search}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as IResults;
    const organizations = petfindetData?.organizations;
    return {
      props: {
        organizations: organizations,
        searchQuery: search,
        ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
      },
    };
  } else {
    return {
      props: {
        organizations: ['no organizations found'],
        searchQuery: search,
        ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
      },
    };
  }
};
