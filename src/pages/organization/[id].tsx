import { useLoadScript } from '@react-google-maps/api';
import { TRPCError } from '@trpc/server';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'next-share';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next/types';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import Spinner from '~/components/spinner/Spinner';
import Map from '~/components/utility/Map';
import ShelterContactDetails from '~/components/utility/ShelterContactDetails';
import { links } from '~/config/siteConfig';
import { env } from '~/env.mjs';
import { useToast } from '~/hooks/useToast';
import { api } from '~/lib/api';
import { TypeOfResults } from '~/lib/constants';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const OrganizationProfilePage: NextPage<PageProps> = ({ shelterId }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { toast } = useToast();

  const { data: organization } = api.shelter.getShelterById.useQuery({
    id: shelterId,
  });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  if (!isLoaded)
    return (
      <PageLayout>
        <Spinner />
      </PageLayout>
    );

  if (!organization) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <h1 className="text-center text-2xl font-semibold">
            {t('organization_not_found')}
          </h1>
        </div>
      </PageLayout>
    );
  }

  const organizationAddress = `${organization.address?.address}, ${organization.address?.city}, ${organization.address?.state}, ${organization.address?.country}`;

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_BASE_URL}${links.organization(organization.id)}`
    );
    toast({
      description: t('copied_to_clipboard_toast'),
      variant: 'success',
    });
  };

  return (
    <PageLayout
      title={organization.name ?? undefined}
      name={organization.name ?? undefined}
      description={organization.description ?? undefined}
      image={
        organization.logo ??
        `${env.NEXT_PUBLIC_BASE_URL}/images/no-profile-picture.svg`
      }
      url={`${env.NEXT_PUBLIC_BASE_URL}/organization/${shelterId}`}
    >
      <>
        <div className="mx-auto flex min-h-screen flex-col">
          <div className="flex items-center justify-start px-6 py-8 sm:px-12 lg:px-48">
            <div className="flex flex-col justify-center gap-10 lg:flex-row lg:items-center">
              <Image
                alt="Shelter Logo"
                src={organization.logo ?? '/images/no-profile-picture.svg'}
                width={400}
                height={400}
                className="h-96 w-96 rounded-full object-cover"
              />
              <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-semibold">{organization.name}</h1>
                <Link
                  href={links.search(TypeOfResults.Animal, organization.name)}
                >
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
          {organization.description && (
            <section className="px-6 py-8 sm:px-12 lg:px-48">
              <h2 className="text-2xl font-bold">
                {t('organization_mission')}
              </h2>
              <p className="mt-2">{organization.description}</p>
            </section>
          )}
          <div className="px-6 py-8 sm:px-12 lg:px-48">
            <ShelterContactDetails
              organizationAddress={organizationAddress}
              organizationPhone={organization.phoneNumber}
              organizationEmail={organization.email}
            />
            <div className="flex flex-col justify-between pt-14">
              <h2 className="mb-2 text-xl font-bold">
                {t('pet_profile_page_help')}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-base md:text-lg">
                  {t('pet_profile_page_share')}
                </span>
                <FacebookShareButton
                  url={`${env.NEXT_PUBLIC_BASE_URL}/organization/${organization.id}`}
                >
                  <FacebookIcon
                    size={32}
                    round
                  />
                </FacebookShareButton>
                <LinkedinShareButton
                  url={`${env.NEXT_PUBLIC_BASE_URL}/organization/${organization.id}`}
                >
                  <LinkedinIcon
                    size={32}
                    round
                  />
                </LinkedinShareButton>
                <TwitterShareButton
                  url={`${env.NEXT_PUBLIC_BASE_URL}/organization/${organization.id}`}
                >
                  <TwitterIcon
                    size={32}
                    round
                  />
                </TwitterShareButton>
                <div
                  className="rounded-full p-2 hover:cursor-pointer"
                  onClick={copyUrlToClipboard}
                >
                  <Icons.copy className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
          <section className="mt-8">
            <h2 className="mb-4 px-6 py-8 text-2xl font-bold sm:px-12 lg:px-48">
              {t('organization_location')}
            </h2>
            <Map address={`${organization.name}, ${organizationAddress}`} />
          </section>
          <section className="mt-12">
            <div className="px-6 py-6 sm:px-12 lg:px-48">
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
      </>
    </PageLayout>
  );
};

export default OrganizationProfilePage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const shelterId = context.params?.id as string;
  const locale = context.locale ?? 'en';
  if (!shelterId)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Shelter not found for id: ${shelterId}`,
    });

  await ssghelpers.shelter.getShelterById.prefetch({ id: shelterId });
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      shelterId,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 60,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const shelters = await prisma.shelter.findMany({
    select: {
      id: true,
    },
  });

  if (!shelters) return { paths: [], fallback: 'blocking' };

  return {
    paths: shelters.map((shelter) => ({
      params: {
        id: shelter.id,
      },
    })),
    fallback: 'blocking',
  };
};
