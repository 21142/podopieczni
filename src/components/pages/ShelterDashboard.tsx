import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import { type RecentlyAddedAnimals } from '~/types';
import ShelterStatisticsCard from '../cards/ShelterStatisticsCard';
import EmailInviteForm from '../forms/EmailInviteForm';
import { Icons } from '../icons/Icons';
import { Button, buttonVariants } from '../primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../primitives/Dialog';
import Chart from '../utility/Chart';
import RecentAdoptions from '../utility/RecentAdoptions';

type ShelterDashboardProps = {
  shelterName: string | undefined;
  shelterLogo: string | undefined | null;
  petsCount: number | undefined;
  petsCountChangeFromLastMonth: number | undefined;
  adoptedPetsCount: number | undefined;
  adoptedPetsCountChangeFromLastMonth: number | undefined;
  usersCount: number | undefined;
  usersCountChangeFromLastMonth: number | undefined;
  petsAddedLastMonthCount: number | undefined;
  recentlyAddedPets: RecentlyAddedAnimals | undefined;
  recentlyAddedPetsIsLoading: boolean;
  returnedPetsCount: number | undefined;
  returnedPetsCountChangeFromLastMonth: number | undefined;
};

const ShelterDashboard: FC<ShelterDashboardProps> = ({
  shelterName,
  shelterLogo,
  petsCount,
  petsCountChangeFromLastMonth,
  adoptedPetsCount,
  adoptedPetsCountChangeFromLastMonth,
  usersCount,
  usersCountChangeFromLastMonth,
  petsAddedLastMonthCount,
  recentlyAddedPets,
  recentlyAddedPetsIsLoading,
  returnedPetsCount,
  returnedPetsCountChangeFromLastMonth,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { data: adoptionRaportChartData } =
    api.pet.getDataForAdoptionRaportChart.useQuery(undefined, {
      retry: false,
    });

  return (
    <div className="container">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-x-2 space-y-2">
          <div className="flex items-center gap-3">
            {shelterLogo && (
              <Image
                src={shelterLogo}
                width={48}
                height={48}
                className="h-12"
                alt="Shelter logo"
              />
            )}
            <h2 className="text-3xl font-bold tracking-tight">{shelterName}</h2>
          </div>
          <div className="hidden items-center space-x-2 sm:flex">
            <Link
              href={links.organizationSettings}
              className={buttonVariants({ size: 'sm' })}
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              {t('dashboard_organization_settings')}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:flex-row">
          <Link
            className={buttonVariants({ size: 'sm' })}
            href={links.raports}
          >
            <Icons.charts className="mr-2 h-4 w-4" />
            {t('dashboard_raports')}
          </Link>
          <Link
            className={buttonVariants({ size: 'sm' })}
            href={links.joinRequests}
          >
            <Icons.joinRequests className="mr-2 h-4 w-4" />
            {t('join_requests')}
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Icons.mailPlus className="mr-2 h-4 w-4" />
                {t('invite_user')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('invite_user_title')}</DialogTitle>
                <DialogDescription>
                  <EmailInviteForm />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="flex items-center space-x-2 sm:hidden">
            <Link
              href={links.organizationSettings}
              className={buttonVariants({ size: 'sm' })}
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              {t('dashboard_organization_settings')}
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_admitted_title')}
            value={petsCount}
            difference={petsCountChangeFromLastMonth}
            onClick={() => router.push(links.animals)}
          >
            <Icons.dog className="h-6 w-6 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_adopted_title')}
            value={adoptedPetsCount}
            difference={adoptedPetsCountChangeFromLastMonth}
            onClick={() => router.push(links.animals)}
          >
            <Icons.home className="h-6 w-6 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_returned_title')}
            value={returnedPetsCount}
            difference={returnedPetsCountChangeFromLastMonth}
            onClick={() => router.push(links.animals)}
          >
            <Icons.returned className="h-6 w-6 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_users_title')}
            value={usersCount}
            difference={usersCountChangeFromLastMonth}
            onClick={() => router.push(links.users)}
          >
            <Icons.user className="h-6 w-6 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {t('dashboard_recent_adoptions_card_title')}
              </CardTitle>
              <CardDescription>
                {petsAddedLastMonthCount}
                {t('dashboard_recent_adoptions_card_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RecentAdoptions
                animals={recentlyAddedPets}
                isLoading={recentlyAddedPetsIsLoading}
              />
            </CardContent>
          </Card>
          <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
            <CardHeader>
              <CardTitle>
                {t('dashboard_adopted_animals_raport_card_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart
                height={390}
                data={adoptionRaportChartData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard;
