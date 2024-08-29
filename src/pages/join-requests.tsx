import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DataTable } from '~/components/data-table/DataTable';
import { joinRequestColumns } from '~/components/data-table/DataTableColumns';
import { joinRequestColumnsInPolish } from '~/components/data-table/DataTableColumnsInPolish';
import EmailInviteForm from '~/components/forms/EmailInviteForm';
import { Icons } from '~/components/icons/Icons';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import { Button, buttonVariants } from '~/components/primitives/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/primitives/Dialog';
import { links } from '~/config/siteConfig';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { ssghelpers } from '~/lib/ssg';

const JoinRequests: NextPage = () => {
  const { data } = api.shelter.getJoinRequests.useQuery();
  const { locale } = useRouter();
  const { t } = useTranslation('common');

  const { data: session } = useSession();

  if (!session || session.user.role === Roles.Adopter) {
    return (
      <PageLayout>
        <UnauthorizedPage />
      </PageLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="flex flex-col items-center justify-center p-3">
        <div className="container">
          <div className="mt-2 flex gap-2">
            <Link
              className={buttonVariants({ size: 'sm' })}
              href={links.dashboard}
            >
              <Icons.dashboard className="mr-2 h-4 w-4" />
              {t('dashboard')}
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
          </div>
          {data && (
            <DataTable
              columns={
                locale === 'pl'
                  ? joinRequestColumnsInPolish
                  : joinRequestColumns
              }
              data={data}
              variant="joinRequests"
            />
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default JoinRequests;

export async function getStaticProps({ locale }: { locale: string }) {
  await ssghelpers.shelter.getJoinRequests.prefetch();
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 60,
  };
}
