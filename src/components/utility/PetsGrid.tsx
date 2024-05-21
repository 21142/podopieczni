import { type FC } from 'react';
import PetCard from '~/components/cards/PetCard';
import { Variant } from '~/lib/constants';
import { type FeaturedPet } from '~/types';

type IPetsGrid = {
  featuredAnimals: FeaturedPet[];
};

const PetsGrid: FC<IPetsGrid> = ({ featuredAnimals }) => {
  return (
    <div className="grid max-w-7xl gap-3 p-5 md:grid-cols-2 lg:grid-cols-3">
      {featuredAnimals?.map((animal: FeaturedPet) => (
        <PetCard
          key={animal.id}
          id={animal.id}
          photo={animal.image ?? '/images/no-profile-picture.svg'}
          tag={animal.status ?? 'Adoptable'}
          title={animal.name ?? 'Unkown'}
          body={animal.description ?? ''}
          avatar={animal.image ?? '/images/no-profile-picture.svg'}
          author={animal.shelterId}
          variant={Variant.Animal}
          type={animal.species ?? 'Unknown'}
          age={animal.age ?? 'Unknown'}
          breed={animal.breed ?? 'Unknown'}
          isLikedByUser={animal.isLikedByUser ?? false}
        />
      ))}
    </div>
  );
};

export default PetsGrid;
