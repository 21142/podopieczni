import { TRPCError } from '@trpc/server';
import { type GetStaticPaths, type GetStaticPropsContext } from 'next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageLayout from '~/components/layouts/PageLayout';
import WorkInProgress from '~/components/pages/WorkInProgressPage';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

const PetDonationPage = () => {
  return (
    <PageLayout>
      <WorkInProgress />
    </PageLayout>
  );
};

export default PetDonationPage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const animalId = context.params?.id as string;
  const locale = context.locale ?? 'en';
  if (!animalId)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Animal not found for id: ${animalId}`,
    });

  await ssghelpers.pet.getPetById.prefetch({ id: animalId });
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      animalId,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
    revalidate: 1,
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const animals = await prisma.pet.findMany({
    where: {
      availableForAdoption: true,
    },
    select: {
      id: true,
    },
  });

  if (!animals) return { paths: [], fallback: 'blocking' };

  return {
    paths: animals.map((animal) => ({
      params: {
        id: animal.id,
      },
    })),
    fallback: 'blocking',
  };
};
