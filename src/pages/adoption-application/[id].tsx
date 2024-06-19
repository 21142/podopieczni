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
import AdoptionSurveyAnswers from '~/components/forms/AdoptionSurveyAnswers';
import DashboardLayout from '~/components/layouts/DashboardLayout';
import Spinner from '~/components/spinner/Spinner';
import { api } from '~/lib/api';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const AdoptionApplicationPage: NextPage<PageProps> = ({ applicationId }) => {
  const { data: session } = useSession();

  const { data: isUserAssociatedWithShelter, isLoading: isLoadingUser } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
    });

  const { data: application, isLoading } =
    api.adoptionApplication.getApplicationById.useQuery(applicationId);

  if (isLoading || isLoadingUser) {
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
      {application && isUserAssociatedWithShelter && (
        <AdoptionSurveyAnswers applicationId={applicationId} />
      )}
    </DashboardLayout>
  );
};

export default AdoptionApplicationPage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const applicationId = context.params?.id as string;
  const locale = context.locale ?? 'en';
  if (!applicationId)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Adoption application not found for id: ${applicationId}`,
    });

  await ssghelpers.adoptionApplication.getApplicationById.prefetch(
    applicationId
  );
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      applicationId,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 60,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const applications = await prisma.adoptionApplication.findMany({
    select: {
      id: true,
    },
  });

  if (!applications) return { paths: [], fallback: 'blocking' };

  return {
    paths: applications.map((application) => ({
      params: {
        id: application.id,
      },
    })),
    fallback: 'blocking',
  };
};
