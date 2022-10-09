import AnimalCard from 'src/components/cards/animal/AnimalCard';
import IAnimalData from '../search-results/types';

export interface IPetsGrid {
  featuredAnimals: IAnimalData[];
}

const PetsGrid: React.FC<IPetsGrid> = ({ featuredAnimals }) => {
  return (
    <div className="grid gap-3 p-5 max-w-7xl lg:grid-cols-3 md:grid-cols-2 xl:w-3/4 2xl:w-2/3">
      {featuredAnimals?.map((animal: IAnimalData) => (
        <AnimalCard
          key={animal.id}
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
