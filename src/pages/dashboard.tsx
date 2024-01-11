import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import ShelterDashboard from '~/components/pages/ShelterDashboard';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();

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

  if (!session) return <LoginToAccessPage />;

  return (
    <DashboardLayout>
      {session &&
        (session.user.role === Roles.Shelter ||
          session.user.role === Roles.Admin) && (
          <ShelterDashboard
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
    </DashboardLayout>
  );
};

export default Dashboard;

export async function getStaticProps({ locale }: { locale: string }) {
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

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const session = await getServerAuthSession(ctx);
//   if (!session) {
//     return {
//       redirect: {
//         destination: `/api/auth/signin?callbackUrl=${env.NEXT_PUBLIC_BASE_URL}/dashboard&error=SessionRequired`,
//       },
//     };
//   }
//   if (session.user?.role === Roles.Adopter) {
//     return {
//       redirect: {
//         destination: `${env.NEXT_PUBLIC_BASE_URL}/unauthorized`,
//       },
//     };
//   }
//   return { props: {} };
// }
