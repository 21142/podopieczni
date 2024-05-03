import { TRPCError } from '@trpc/server';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next/types';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const UserProfilePage: NextPage<PageProps> = ({ userId }) => {
  const { data: user, isLoading } = api.user.getUserById.useQuery({
    id: userId,
  });

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
      {user && (
        <div className="grid h-full content-center justify-center">
          <Image
            src={user.image ?? '/images/no-profile-picture.svg'}
            alt="profile picture"
            className="rounded-md"
            width="600"
            height="400"
            priority={true}
          />
          <p>
            <strong>id:</strong> {userId}
          </p>
          <p>
            <strong>name:</strong> {user.title ?? ''} {user.name}
          </p>
          <p>
            <strong>email:</strong> {user.email}
          </p>
          <p>
            <strong>status:</strong> {user.role}
          </p>
        </div>
      )}
    </DashboardLayout>
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
