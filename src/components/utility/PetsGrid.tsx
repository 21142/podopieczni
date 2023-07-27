import PetCard from '~/components/cards/PetCard';
import { Variant } from '~/lib/constants';
import type IAnimalData from '../../types/petfinderTypes';

export interface IPetsGrid {
  featuredAnimals: IAnimalData[];
}

const PetsGrid: React.FC<IPetsGrid> = ({ featuredAnimals }) => {
  return (
    <div className="grid max-w-7xl gap-3 p-5 md:grid-cols-2 lg:grid-cols-3">
      {featuredAnimals?.map((animal: IAnimalData) => (
        <PetCard
          key={animal.id}
          id={animal.id}
          photo={
            animal.photos[0]?.large ??
            animal.photos[0]?.medium ??
            animal.photos[0]?.small ??
            '/no-profile-picture.svg'
          }
          tag={animal.status}
          title={animal.name}
          body={animal.description}
          avatar={animal.organization_id}
          author={animal.photos[0]?.small ?? '/no-profile-picture.svg'}
          variant={Variant.Animal}
          age={animal.age}
          breeds={animal.breeds}
        />
      ))}
    </div>
  );
};

export default PetsGrid;
