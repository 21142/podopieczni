import AnimalCard from 'src/components/cards/animal/AnimalCard';
import IAnimalData from '../search-results/types';

export interface IFeaturedPets {
  featuredAnimals?: IAnimalData[];
}

const FeaturedPets: React.FC<IFeaturedPets> = ({ featuredAnimals }) => {
  return (
    <>
      <div
        id="featured"
        className="aspect-[3/1] w-full bg-cover bg-no-repeat bg-center bg-opacity-80 bg-[url('/images/footer-wave.svg')]"
      ></div>
      <div className="bg-primary-200 w-full flex flex-col items-center justify-center">
        <p className="text-neutral-50 text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl py-5 md:py-10 font-bold">
          Podopieczni szukający domu
        </p>
        <div className="grid gap-3 p-5 max-w-7xl lg:grid-cols-3 md:grid-cols-2 xl:w-3/4 2xl:w-2/3">
          {featuredAnimals?.map((animal) => (
            <AnimalCard
              key={animal.id}
              photo={animal.photos[0]?.large ?? '/time-cat.jpeg'}
              tag={animal.status}
              title={animal.name}
              body={animal.description}
              avatar={animal.organization_id}
              author={animal.photos[0]?.small ?? '/time-cat.jpeg'}
            />
          ))}
        </div>
      </div>
      <div className="aspect-[3/1] rotate-180 w-full bg-cover bg-no-repeat bg-center bg-[url('/images/footer-wave.svg')]"></div>
    </>
  );
};

export default FeaturedPets;
