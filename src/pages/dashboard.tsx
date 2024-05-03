import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import ShelterDashboard from '~/components/pages/ShelterDashboard';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

  if (!session)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );
  const { data: usersCount } = api.user.getUsersCount.useQuery();
  const { data: usersCountChangeFromLastMonth } =
    api.user.getUsersCountChangeFromLastMonth.useQuery();

  const { data: petsCount } = api.pet.getPetsCount.useQuery();
  const { data: petsCountChangeFromLastMonth } =
    api.pet.getPetsCountChangeFromLastMonth.useQuery();

  const { data: recentlyAddedPets } =
    api.pet.getPetsAddedInTheLastMonth.useQuery();
  const { data: mostRecentlyAddedPets } =
    api.pet.getMostRecentlyAddedPets.useQuery();
  const { data: petsAddedLastMonthCount } =
    api.pet.getPetsCountChangeFromLastMonth.useQuery();

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery();

  const { data: shelterDetails } = api.shelter.getShelterDetails.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!session)
    return (
      <DashboardLayout>
        <LoginToAccessPage />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      {isUserAssociatedWithShelter &&
        session &&
        (session.user.role === Roles.Shelter ||
          session.user.role === Roles.Admin) && (
          <ShelterDashboard
            shelterName={shelterDetails?.name}
            shelterLogo={shelterDetails?.logo}
            petsCount={petsCount}
            petsCountChangeFromLastMonth={petsCountChangeFromLastMonth}
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
