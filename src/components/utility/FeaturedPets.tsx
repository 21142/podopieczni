import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/primitives/Card';
import { env } from '~/env.mjs';
import type IAnimalData from '../../types/petfinderTypes';
import { Skeleton } from '../primitives/Skeleton';
import BackgroundWavesFeaturedPets from './BackgroundWavesFeaturedPets';
import PetsGrid from './PetsGrid';

export interface IFeaturedPets {
  featuredAnimals?: IAnimalData[];
}

const animalFetcher = async () => {
  const petfindetAnimalsData = (await fetch(
    `${env.NEXT_PUBLIC_BASE_URL}/api/animals`
  ).then((res) => res.json())) as IAnimalData[] | undefined;

  if (!petfindetAnimalsData) return;
  const featuredAnimalsData = petfindetAnimalsData.slice(10, 16);
  return featuredAnimalsData;
};

const FeaturedPets: React.FC<IFeaturedPets> = () => {
  const { data: featuredAnimals, isLoading } = useQuery(
    ['animals'],
    animalFetcher
  );
  const { t } = useTranslation('common');

  return (
    <>
      <BackgroundWavesFeaturedPets className="aspect-[10/1]" />
      <div className="flex min-h-[84rem] w-full flex-col items-center justify-start bg-primary-200">
        <p
          id="featured"
          className="py-10 text-3xl font-bold text-neutral-50 sm:text-4xl md:py-10 md:text-5xl lg:text-6xl 2xl:text-7xl"
        >
          {t('featured_pets_title')}
        </p>
        {isLoading ? (
          <div className="grid max-w-7xl gap-3 p-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="w-[calc(20rem + 2vw)] relative min-h-[585px] border-0 shadow-md transition hover:cursor-pointer hover:ease-out dark:border-2 dark:shadow-primary-300/20 md:w-[352px]"
              >
                <CardHeader className="p-0">
                  <Image
                    src="/images/no-profile-picture.svg"
                    alt="card__image"
                    className="block h-96 max-w-full rounded-t-lg object-cover"
                    width="352"
                    height="384"
                    unoptimized
                  />
                  <CardTitle className="pt-5 pb-1"></CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col overflow-hidden">
                  <Skeleton className="mx-auto mb-2 h-[34px] w-[150px] rounded-full" />
                  <Skeleton className="mx-auto mb-2 h-[34px] w-[300px] rounded-full" />
                  <Skeleton className="mx-auto h-[35px] w-[250px] rounded-full" />
                </CardContent>
                <CardFooter className="flex justify-end gap-2"></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <PetsGrid featuredAnimals={featuredAnimals ?? []} />
        )}
      </div>
      <BackgroundWavesFeaturedPets className="aspect-[10/1] rotate-180" />
    </>
  );
};

export default FeaturedPets;
