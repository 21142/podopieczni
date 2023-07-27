import type { GetServerSidePropsContext, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import EmailInviteForm from '~/components/forms/EmailInviteForm';
import { Icons } from '~/components/icons/Icons';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import { Button } from '~/components/primitives/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/primitives/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/primitives/Dialog';
import { Chart } from '~/components/utility/Chart';
import { RecentAdoptions } from '~/components/utility/RecentAdoptions';
import { env } from '~/env.mjs';
import { useLoginToast } from '~/hooks/use-login-toast';
import { api } from '~/lib/api';
import { getServerAuthSession } from '~/lib/auth';
import { Roles } from '~/lib/constants';

const Dashboard: NextPage = () => {
  const { data: session } = useSession();
  const { loginToast } = useLoginToast();

  const { data: usersCount } = api.user.getUsersCount.useQuery();
  const { data: usersCountChangeFromLastMonth } =
    api.user.getUsersCountChangeFromLastMonth.useQuery();

  const { data: petsCount } = api.pet.getPetsCount.useQuery();
  const { data: petsCountChangeFromLastMonth } =
    api.pet.getPetsCountChangeFromLastMonth.useQuery();

  return (
    <DashboardLayout>
      {session &&
        (session.user.role === Roles.Shelter ||
          session.user.role === Roles.Admin) && (
          <div className="container mx-auto w-full">
            <div className="flex-1 space-y-4 p-8 pt-6">
              <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Schronisko na paluchu
                </h2>
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <Icons.settings className="mr-2 h-4 w-4" />
                    Organizacja
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Icons.mail className="mr-2 h-4 w-4" />
                      Zaproś użytkownika
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite people via email</DialogTitle>
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
                  Pobierz raport
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Przyjętych zwierząt
                    </CardTitle>
                    <Icons.dog className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{petsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {petsCountChangeFromLastMonth &&
                        (petsCountChangeFromLastMonth > 0
                          ? '+'
                          : petsCountChangeFromLastMonth < 0
                          ? '-'
                          : '')}
                      {!!petsCountChangeFromLastMonth &&
                        petsCountChangeFromLastMonth}{' '}
                      from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Szczęśliwie adoptowanych
                    </CardTitle>
                    <Icons.home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">
                      +1 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Użytkowników
                    </CardTitle>
                    <Icons.user className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{usersCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {usersCountChangeFromLastMonth &&
                        (usersCountChangeFromLastMonth > 0
                          ? '+'
                          : usersCountChangeFromLastMonth < 0
                          ? '-'
                          : '')}
                      {!!usersCountChangeFromLastMonth &&
                        usersCountChangeFromLastMonth}{' '}
                      from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Dotacje
                    </CardTitle>
                    <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1 231.89 zł</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Raport adopcji</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Chart />
                  </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Ostatnio przyjęte zwierzęta</CardTitle>
                    <CardDescription>
                      5 zwierząt przyjętych w ostatnim miesiącu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAdoptions />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${env.NEXT_PUBLIC_BASE_URL}/dashboard&error=SessionRequired`,
      },
    };
  }
  if (session.user?.role === Roles.Adopter) {
    return {
      redirect: {
        destination: `${env.NEXT_PUBLIC_BASE_URL}/unauthorized`,
      },
    };
  }
  return { props: {} };
}
