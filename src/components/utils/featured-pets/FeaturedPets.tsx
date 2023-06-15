import { useQuery } from '@tanstack/react-query';
import Spinner from 'src/components/spinner/Spinner';
import BackgroundWavesFeaturedPets from '../BackgroundWavesFeaturedPets';
import PetsGrid from '../pets-grid/PetsGrid';
import type IAnimalData from '../search-results/types';

export interface IFeaturedPets {
  featuredAnimals?: IAnimalData[];
}

const animalFetcher = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const petfindetAnimalsData = (await fetch(`${baseUrl}/api/animals`).then(
    (res) => res.json()
  )) as IAnimalData[] | undefined;

  if (!petfindetAnimalsData) return;
  const featuredAnimalsData = petfindetAnimalsData.slice(10, 16);
  return featuredAnimalsData;
};

const FeaturedPets: React.FC<IFeaturedPets> = () => {
  const { data: featuredAnimals, isLoading } = useQuery(
    ['animals'],
    animalFetcher
  );

  return (
    <>
      <BackgroundWavesFeaturedPets className="aspect-[10/1]" />
      <div className="flex min-h-[84rem] w-full flex-col items-center justify-start bg-primary-200">
        <p className="py-10 text-3xl font-bold text-neutral-50 sm:text-4xl md:py-10 md:text-5xl lg:text-6xl 2xl:text-7xl">
          Podopieczni szukający domu
        </p>
        {isLoading ? (
          <Spinner />
        ) : (
          <PetsGrid featuredAnimals={featuredAnimals ?? []} />
        )}
      </div>
      <BackgroundWavesFeaturedPets className="aspect-[10/1] rotate-180" />
    </>
  );
};

export default FeaturedPets;
