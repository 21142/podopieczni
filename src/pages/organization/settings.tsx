import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShelterSettings from '~/components/forms/ShelterDetailsForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const OrganizationSettings: NextPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
    });

  const { data: shelterDetails } = api.shelter.getShelterDetails.useQuery(
    undefined,
    { enabled: session?.user !== undefined }
  );

  if (!session || session.user.role === Roles.Adopter) {
    return (
      <PageLayout>
        <UnauthorizedPage />
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (!shelterDetails)
    return <p>No shelter details retrieved from our database.</p>;

  return (
    <DashboardLayout>
      {isUserAssociatedWithShelter && (
        <ShelterSettings shelterDetails={shelterDetails} />
      )}
      {!isUserAssociatedWithShelter && (
        <div className="grid h-[50vh] content-center">
          <h1 className="text-center text-2xl font-semibold">
            {t('shelter_associate_title')}
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
