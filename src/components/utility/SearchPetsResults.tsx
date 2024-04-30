import PetCard from '~/components/cards/PetCard';
import { Variant } from '~/lib/constants';
import { type PetAvailableForAdoption } from '~/types';
import Spinner from '../spinner/Spinner';

export interface ISearchResults {
  results?: PetAvailableForAdoption[];
  isLoading?: boolean;
}

const SearchPetsResults: React.FC<ISearchResults> = ({
  results,
  isLoading,
}) => {
  if (results?.length === 0)
    return (
      <p>
        No results found, sorry but you need to try another search query or
        filter selection
      </p>
    );

  if (isLoading) {
    return (
      <div className="grid h-[50vh] content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 text-center sm:grid-cols-2 md:grid-cols-3 lg:col-start-2 lg:col-end-5 lg:gap-x-4 xl:grid-cols-4">
      {results?.map((animal) => (
        <PetCard
          key={animal.id}
          id={animal.id}
          photo={animal.image ?? '/images/no-profile-picture.svg'}
          tag={animal.status ?? ''}
          title={animal.name ?? ''}
          body={animal.description ?? ''}
          avatar={animal.image ?? '/images/no-profile-picture.svg'}
          author={animal.image ?? '/images/no-profile-picture.svg'}
          variant={Variant.Animal}
          age={animal.age ?? ''}
          breed={animal.breed ?? ''}
          type={animal.species ?? ''}
          isLikedByUser={animal.isLikedByUser ?? false}
        />
      ))}
    </div>
  );
};

export default SearchPetsResults;
