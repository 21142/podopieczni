import AnimalCard from 'src/components/cards/animal/AnimalCard';
import type IAnimalData from '../search-results/types';

export interface IPetsGrid {
  featuredAnimals: IAnimalData[];
}

const PetsGrid: React.FC<IPetsGrid> = ({ featuredAnimals }) => {
  return (
    <div className="grid max-w-7xl gap-3 p-5 md:grid-cols-2 lg:grid-cols-3 xl:w-3/4 2xl:w-2/3">
      {featuredAnimals?.map((animal: IAnimalData) => (
        <AnimalCard
          key={animal.id}
          id={animal.id}
          photo={animal.photos[0]?.large ?? '/no-profile-picture.svg'}
          tag={animal.status}
          title={animal.name}
          body={animal.description}
          avatar={animal.organization_id}
          author={animal.photos[0]?.small ?? '/no-profile-picture.svg'}
        />
      ))}
    </div>
  );
};

export default PetsGrid;
