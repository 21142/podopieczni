import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { type GetServerSideProps, type NextPage } from 'next/types';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { type IOrganizationData } from '~/types/petfinderTypes';
import { type PetfinderOauth } from '../results';

type IOrganizationProfilePage = {
  organization: IOrganizationData;
  message: string;
};

type PetfinderData = {
  organization: IOrganizationData;
};

const PetProfilePage: NextPage<IOrganizationProfilePage> = ({
  organization,
  message,
}) => {
  return (
    <PageLayout>
      <div className="grid h-full items-center justify-center">
        {organization === null ? (
          <p>{message}</p>
        ) : (
          <div className="flex min-h-screen flex-col">
            <div className="container mx-auto flex items-center justify-between px-6 py-8">
              <div className="flex items-center">
                <Image
                  alt="Shelter Logo"
                  src={
                    organization.photos[0]?.full ?? '/no-profile-picture.svg'
                  }
                  width={300}
                  height={300}
                />
                <h1 className="ml-4 text-3xl font-semibold">
                  {organization.name}
                </h1>
              </div>
            </div>
            <main className="container mx-auto flex-1 px-6">
              <section className="mt-8">
                <div className="flex items-center space-x-4">
                  <Icons.map className="h-6 w-6" />
                  <p>1234 Main St, Anytown, USA</p>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <Icons.phone className="h-6 w-6" />
                  <p>(123) 456-7890</p>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <Icons.mail className="h-6 w-6" />
                  <p>contact@sheltername.org</p>
                </div>
              </section>
              <section className="mt-12">
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-2 text-gray-600">
                  {organization.mission_statement}
                </p>
              </section>
            </main>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PetProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const id = query.id ?? '';
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
    if (id) {
      url = `https://api.petfinder.com/v2/organizations/${id}`;
    }
    const petfindetData = (await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json())) as PetfinderData;
    const organization = petfindetData?.organization;

    if (organization) {
      return {
        props: {
          organization: organization,
          message: 'success',
          ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
        },
      };
    } else {
      return {
        props: {
          organization: null,
          message: `no organization found for id: ${id}`,
          ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
        },
      };
    }
  } else {
    return {
      props: {
        organization: null,
        message: 'no access token',
        ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
      },
    };
  }
};
