import { TRPCError } from '@trpc/server';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next/types';
import PetDetailsForm from '~/components/forms/PetDetailsForm';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const AnimalProfilePage: NextPage<PageProps> = ({ animalId }) => {
  return <PetDetailsForm animalId={animalId} />;
};

export default AnimalProfilePage;

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
