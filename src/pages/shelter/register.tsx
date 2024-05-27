import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShelterDetailsForm from '~/components/forms/ShelterDetailsForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { ssghelpers } from '~/lib/ssg';

const RegisterShelter: NextPage = () => {
  const { data: session } = useSession();

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: (failureCount) => {
        return failureCount === 1;
      },
    });

  if (!session) {
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {session && !isUserAssociatedWithShelter && (
        <ShelterDetailsForm shelterDetails={null} />
      )}
      {isUserAssociatedWithShelter && (
        <div className="grid h-[50vh] content-center">
          <h1 className="text-center text-2xl font-semibold">
            You have already registered your shelter!
          </h1>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RegisterShelter;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.user.isUserAssociatedWithShelter.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
