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
import { api } from '~/lib/api';
import { Skeleton } from '../primitives/Skeleton';
import BackgroundWavesFeaturedPets from './BackgroundWavesFeaturedPets';
import PetsGrid from './PetsGrid';

const FeaturedPets = () => {
  const { data: featuredAnimals, isLoading } =
    api.pet.getFeaturedAnimals.useQuery();

  const { t } = useTranslation('common');

  return (
    <>
      <BackgroundWavesFeaturedPets className="aspect-[10/1]" />
      <div className="flex min-h-[84rem] w-full flex-col items-center justify-start bg-primary-200">
        <p
          id="featured"
          className="p-2 py-10 text-3xl font-extrabold leading-[1.25] text-neutral-50 sm:text-4xl md:py-10 md:text-5xl lg:text-[3rem] xl:text-[3.5rem] 2xl:text-[4.5rem]"
        >
          {t('featured_pets_title')}
        </p>
        {isLoading ? (
          <div className="grid max-w-7xl gap-3 p-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="w-[calc(20rem + 2vw)] relative min-h-[585px] border-0 shadow-md transition hover:cursor-pointer hover:ease-out dark:shadow-primary-300/20 md:w-[352px]"
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
                  <CardTitle className="pb-1 pt-5"></CardTitle>
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
