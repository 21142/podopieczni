import { TRPCError } from '@trpc/server';
import { useSession } from 'next-auth/react';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next/types';
import UserDetailsForm from '~/components/forms/UserDetailsForm';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import PageLayout from '~/components/layouts/PageLayout';
import UnauthorizedPage from '~/components/pages/UnauthorizedPage';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const UserProfilePage: NextPage<PageProps> = ({ userId }) => {
  const { data: user, isLoading } = api.user.getUserById.useQuery({
    id: userId,
  });

  const { data: session } = useSession();

  if (!session || session.user.role === Roles.Adopter) {
    return (
      <PageLayout>
        <UnauthorizedPage />
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
    <DashboardLayout>{user && <UserDetailsForm user={user} />}</DashboardLayout>
  );
};

export default UserProfilePage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const userId = context.params?.id as string;
  const locale = context.locale ?? 'en';
  if (!userId)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `User not found for id: ${userId}`,
    });

  await ssghelpers.user.getUserById.prefetch({ id: userId });
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      userId,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (!users) return { paths: [], fallback: 'blocking' };

  return {
    paths: users.map((user) => ({
      params: {
        id: user.id,
      },
    })),
    fallback: 'blocking',
  };
};
