import { useLoadScript } from '@react-google-maps/api';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type GetServerSideProps, type NextPage } from 'next/types';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import Spinner from '~/components/spinner/Spinner';
import Map from '~/components/utility/Map';
import { type IOrganizationData } from '~/types/petfinderTypes';
import { type PetfinderOauth } from '../results';

type IOrganizationProfilePage = {
  organization: IOrganizationData;
  message: string;
};

type PetfinderData = {
  organization: IOrganizationData;
};

const OrganizationProfilePage: NextPage<IOrganizationProfilePage> = ({
  organization,
  message,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  const organizationAddress = `${
    organization.address.address1 ? `${organization.address.address1}, ` : ''
  }${organization.address.city}, ${organization.address.state}, ${
    organization.address.country
  }`;
  if (!isLoaded)
    return (
      <PageLayout>
        <Spinner />
      </PageLayout>
    );

  return (
    <PageLayout>
      <>
        {organization === null ? (
          <p>{message}</p>
        ) : (
          <div className="mx-auto flex min-h-screen flex-col">
            <div className="flex items-center justify-start py-8 px-6 sm:px-12 lg:px-48">
              <div className="flex flex-col justify-center gap-10 lg:flex-row lg:items-center">
                <Image
                  alt="Shelter Logo"
                  src={
                    organization.photos[0]?.full ??
                    '/images/no-profile-picture.svg'
                  }
                  width={400}
                  height={400}
                  className="rounded-sm"
                />
                <div className="flex flex-col gap-6">
                  <h1 className="text-3xl font-semibold">
                    {organization.name}
                  </h1>
                  <Link href="#">
                    <Button
                      size="lg"
                      variant="primary"
                      className="underline underline-offset-1 sm:no-underline"
                    >
                      {t('organization_see_our_pets')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <section className="flex flex-col items-start justify-center gap-4 py-8 px-6 sm:px-12 lg:px-48">
              <div className="flex space-x-4">
                <Icons.map className="h-6 w-6" />
                <p>{organizationAddress}</p>
              </div>
              {organization.phone && (
                <div className="mt-2 flex items-center space-x-4">
                  <Icons.phone className="h-6 w-6" />
                  <a
                    className="bg-transparent text-neutral-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-neutral-100 dark:hover:bg-transparent"
                    href={`tel:${organization.phone}`}
                  >
                    {organization.phone}
                  </a>
                </div>
              )}
              {organization.email && (
                <div className="mt-2 flex items-center space-x-4">
                  <Icons.mail className="h-6 w-6" />
                  <a
                    href={`mailto:${organization.email}`}
                    className="bg-transparent text-neutral-900 underline-offset-4 hover:bg-transparent hover:underline dark:bg-transparent dark:text-neutral-100 dark:hover:bg-transparent"
                  >
                    {organization.email}
                  </a>
                </div>
              )}
            </section>
            {organization.mission_statement && (
              <section className="py-8 px-6 sm:px-12 lg:px-48">
                <h2 className="text-2xl font-bold">
                  {t('organization_mission')}
                </h2>
                <p className="mt-2">{organization.mission_statement}</p>
              </section>
            )}
            <section className="mt-8">
              <h2 className="mb-4 py-8 px-6 text-2xl font-bold sm:px-12 lg:px-48">
                {t('organization_location')}
              </h2>
              <Map address={`${organization.name}, ${organizationAddress}`} />
            </section>
            <section className="mt-12">
              <div className="py-6 px-6 sm:px-12 lg:px-48">
                <Button
                  onClick={() => router.back()}
                  className="hover:text-primary focus:text-primary text-md group flex items-center justify-center gap-x-0.5 font-sans text-gray-600 transition ease-out focus:outline-none"
                  variant="link"
                >
                  <Icons.chevronLeft className="h-5 w-5" />
                  {t('go_back')}
                </Button>
              </div>
            </section>
          </div>
        )}
      </>
    </PageLayout>
  );
};

export default OrganizationProfilePage;

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
