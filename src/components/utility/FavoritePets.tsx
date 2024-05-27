import { type FC } from 'react';
import PetCard from '~/components/cards/PetCard';
import { Variant } from '~/lib/constants';
import { type FavoritePet } from '~/types';

type IFavoritePets = {
  favoritePets?: FavoritePet[];
};

const FavoritePets: FC<IFavoritePets> = ({ favoritePets }) => {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 text-center sm:grid-cols-2 md:grid-cols-3 lg:col-start-2 lg:col-end-5 lg:gap-x-0 xl:grid-cols-4">
      {favoritePets?.map((pet) => (
        <PetCard
          key={pet.id}
          id={pet.id ?? ''}
          photo={pet.image ?? '/images/no-profile-picture.svg'}
          tag={pet.status ?? ''}
          title={pet.name ?? ''}
          body={pet.description ?? ''}
          avatar={pet.image ?? '/images/no-profile-picture.svg'}
          author={pet.image ?? '/images/no-profile-picture.svg'}
          variant={Variant.Animal}
          age={pet.age ?? ''}
          breed={pet.breed ?? ''}
          type={pet.species ?? ''}
          isLikedByUser={pet.isLikedByUser ?? false}
        />
      ))}
    </div>
  );
};

export default FavoritePets;
