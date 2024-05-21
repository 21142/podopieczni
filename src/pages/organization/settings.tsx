import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import Spinner from '~/components/spinner/Spinner';
import ShelterSettings from '~/components/utility/ShelterSettings';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const OrganizationSettings: NextPage = () => {
  const { data: session } = useSession();

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
    });

  const { data: shelterDetails } = api.shelter.getShelterDetails.useQuery(
    undefined,
    { enabled: session?.user !== undefined }
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!session) return <LoginToAccessPage />;

  if (!shelterDetails)
    return <p>No shelter details retrieved from our database.</p>;

  return (
    <DashboardLayout>
      {isUserAssociatedWithShelter &&
        session &&
        (session.user.role === Roles.Shelter ||
          session.user.role === Roles.Admin) && (
          <ShelterSettings shelterDetails={shelterDetails} />
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

export default OrganizationSettings;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.shelter.getShelterDetails.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
