import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { useLoginToast } from '~/hooks/useLoginToast';
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
import { Chart } from '../utility/Chart';
import RecentAdoptions from '../utility/RecentAdoptions';

type ShelterDashboardProps = {
  shelterName: string | undefined;
  shelterLogo: string | undefined | null;
  petsCount: number | undefined;
  petsCountChangeFromLastMonth: number | undefined;
  usersCount: number | undefined;
  usersCountChangeFromLastMonth: number | undefined;
  petsAddedLastMonthCount: number | undefined;
  recentlyAddedPets: RecentlyAddedAnimals | undefined;
};

const ShelterDashboard: FC<ShelterDashboardProps> = ({
  shelterName,
  shelterLogo,
  petsCount,
  petsCountChangeFromLastMonth,
  usersCount,
  usersCountChangeFromLastMonth,
  petsAddedLastMonthCount,
  recentlyAddedPets,
}) => {
  const { t } = useTranslation('common');
  const { loginToast } = useLoginToast();
  const router = useRouter();

  return (
    <div className="container">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
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
          <div className="flex items-center space-x-2">
            <Link
              href={links.organizationSettings}
              className={buttonVariants({ size: 'sm' })}
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              {t('dashboard_organization_settings')}
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Icons.mail className="mr-2 h-4 w-4" />
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
          <Button
            size="sm"
            onClick={loginToast}
          >
            <Icons.download className="mr-2 h-4 w-4" />
            {t('dashboard_download_raport')}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_admitted_title')}
            value={petsCount}
            difference={petsCountChangeFromLastMonth}
            onClick={() => router.push(links.animals)}
          >
            <Icons.dog className="h-4 w-4 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_adopted_title')}
            value={42}
            difference={1}
            onClick={() => router.push(links.animals)}
          >
            <Icons.home className="h-4 w-4 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_users_title')}
            value={usersCount}
            difference={usersCountChangeFromLastMonth}
            onClick={() => router.push(links.users)}
          >
            <Icons.user className="h-4 w-4 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
          <ShelterStatisticsCard
            title={t('dashboard_statistics_card_donations_title')}
            value={1231.89}
            currency="zł"
            difference={20.1}
            onClick={() => router.push(links.donations)}
          >
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground dark:text-foreground" />
          </ShelterStatisticsCard>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 transition-colors hover:border-border/60 hover:bg-transparent">
            <CardHeader>
              <CardTitle>
                {t('dashboard_adoptions_raport_card_title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Chart />
            </CardContent>
          </Card>
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
            <CardContent>
              <RecentAdoptions animals={recentlyAddedPets} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard;
