import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/navigation';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import ShelterDashboard from '~/components/pages/ShelterDashboard';
import Spinner from '~/components/spinner/Spinner';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import { ssghelpers } from '~/lib/ssg';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: usersCount } = api.user.getUsersCount.useQuery(undefined, {
    enabled: session?.user !== undefined,
    retry: false,
  });

  const { data: usersCountChangeFromLastMonth } =
    api.user.getUsersCountChangeFromLastMonth.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: petsCount } = api.pet.getPetsCount.useQuery(undefined, {
    enabled: session?.user !== undefined,
    retry: false,
  });

  const { data: petsCountChangeFromLastMonth } =
    api.pet.getPetsCountChangeFromLastMonth.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: adoptedPetsCount } = api.pet.getAdoptedPetsCount.useQuery(
    undefined,
    {
      enabled: session?.user !== undefined,
      retry: false,
    }
  );

  const { data: adoptedPetsCountChangeFromLastMonth } =
    api.pet.getAdoptedPetsCountChangeFromLastMonth.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: recentlyAddedPets } =
    api.pet.getPetsAddedInTheLastMonth.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: mostRecentlyAddedPets } =
    api.pet.getMostRecentlyAddedPets.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: petsAddedLastMonthCount } =
    api.pet.getPetsCountChangeFromLastMonth.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: shelterDetails } = api.shelter.getShelterDetails.useQuery(
    undefined,
    { enabled: session?.user !== undefined, retry: false }
  );

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (!session) {
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );
  }

  if (!isUserAssociatedWithShelter) {
    router.push(links.associateShelter);
  }

  return (
    <DashboardLayout>
      {isUserAssociatedWithShelter && (
        <ShelterDashboard
          shelterName={shelterDetails?.name}
          shelterLogo={shelterDetails?.logo}
          petsCount={petsCount}
          petsCountChangeFromLastMonth={petsCountChangeFromLastMonth}
          adoptedPetsCount={adoptedPetsCount}
          adoptedPetsCountChangeFromLastMonth={
            adoptedPetsCountChangeFromLastMonth
          }
          usersCount={usersCount}
          usersCountChangeFromLastMonth={usersCountChangeFromLastMonth}
          petsAddedLastMonthCount={petsAddedLastMonthCount}
          recentlyAddedPets={
            recentlyAddedPets && recentlyAddedPets?.length > 0
              ? recentlyAddedPets
              : mostRecentlyAddedPets
          }
        />
      )}
      {!isUserAssociatedWithShelter && (
        <div className="grid h-[50vh] content-center">
          <h1 className="text-center text-2xl font-semibold">
            You are not associated with any shelter
          </h1>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.shelter.getShelterDetails.prefetch();
  await ssghelpers.user.isUserAssociatedWithShelter.prefetch();
  await ssghelpers.user.getUsersCount.prefetch();
  await ssghelpers.user.getUsersCountChangeFromLastMonth.prefetch();
  await ssghelpers.pet.getPetsCount.prefetch();
  await ssghelpers.pet.getPetsCountChangeFromLastMonth.prefetch();
  await ssghelpers.pet.getPetsAddedInTheLastMonth.prefetch();
  await ssghelpers.pet.getPetsAddedInTheLastMonthCount.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
