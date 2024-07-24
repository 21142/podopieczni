import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icons } from '~/components/icons/Icons';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import { Button, buttonVariants } from '~/components/primitives/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/primitives/Card';
import Spinner from '~/components/spinner/Spinner';
import Chart from '~/components/utility/Chart';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import generateCombinedCSVReport from '~/lib/generateRaport';
import { ssghelpers } from '~/lib/ssg';

const Raports: NextPage = () => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');

  const { data: isUserAssociatedWithShelter, isLoading } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: shelterDetails } = api.shelter.getShelterDetails.useQuery(
    undefined,
    { enabled: session?.user !== undefined, retry: false }
  );

  const { data: admittedAnimalsRaportData, isSuccess: isAdmittedSuccess } =
    api.pet.getDataForAdmittedAnimalsRaportChart.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: adoptedAnimalsRaportData, isSuccess: isAdoptedSuccess } =
    api.pet.getDataForAdoptionRaportChart.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: animalsReturnRateRaportData, isSuccess: isEuthanizedSuccess } =
    api.pet.getDataForAnimalsReturnRateChart.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const { data: euthanizedAnimalsRaportData, isSuccess: isReturnRateSuccess } =
    api.pet.getDataForEuthanizedAnimalsChart.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const [isRaportDataReady, setIsRaportDataReady] = useState(false);

  useEffect(() => {
    if (
      isAdmittedSuccess &&
      isAdoptedSuccess &&
      isEuthanizedSuccess &&
      isReturnRateSuccess
    ) {
      setIsRaportDataReady(true);
    }
  }, [
    isAdmittedSuccess,
    isAdoptedSuccess,
    isEuthanizedSuccess,
    isReturnRateSuccess,
  ]);

  const downloadReport = () => {
    if (!isRaportDataReady) return;

    const combinedData = [
      { section: 'Przyjęte zwierzęta', data: admittedAnimalsRaportData },
      { section: 'Adoptowane zwierzęta', data: adoptedAnimalsRaportData },
      { section: 'Uśpione zwierzęta', data: euthanizedAnimalsRaportData },
      { section: 'Zwrócone zwierzęta', data: animalsReturnRateRaportData },
    ];

    generateCombinedCSVReport(combinedData);
  };

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

  return (
    <DashboardLayout>
      {isUserAssociatedWithShelter && (
        <div className="container">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex items-center gap-3">
                {shelterDetails?.logo && (
                  <Image
                    src={shelterDetails.logo}
                    width={48}
                    height={48}
                    className="h-12 rounded-full"
                    alt="Shelter logo"
                  />
                )}
                <h2 className="text-3xl font-bold tracking-tight">
                  {shelterDetails?.name}
                </h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                className={buttonVariants({ size: 'sm' })}
                href={links.dashboard}
              >
                <Icons.dashboard className="mr-2 h-4 w-4" />
                {t('dashboard')}
              </Link>
              <Button
                size="sm"
                onClick={downloadReport}
                disabled={!isRaportDataReady}
              >
                <Icons.download className="mr-2 h-4 w-4" />
                {t('dashboard_download_raport')}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
              <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
                <CardHeader>
                  <CardTitle>
                    {t('dashboard_admitted_animals_raport_card_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Chart data={admittedAnimalsRaportData} />
                </CardContent>
              </Card>
              <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
                <CardHeader>
                  <CardTitle>
                    {t('dashboard_adopted_animals_raport_card_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Chart data={adoptedAnimalsRaportData} />
                </CardContent>
              </Card>
              <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
                <CardHeader>
                  <CardTitle>
                    {t('dashboard_animals_return_rate_raport_card_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Chart data={animalsReturnRateRaportData} />
                </CardContent>
              </Card>
              <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
                <CardHeader>
                  <CardTitle>
                    {t('dashboard_euthanized_animals_raport_card_title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Chart data={euthanizedAnimalsRaportData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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

export default Raports;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}
