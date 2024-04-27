import PetCard from '~/components/cards/PetCard';
import { Variant } from '~/lib/constants';
import { type Shelter } from '~/types';

export interface ISearchResults {
  results?: Shelter[];
}

const SearchSheltersResults: React.FC<ISearchResults> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-x-6 gap-y-10 text-center sm:grid-cols-2 md:grid-cols-3 lg:col-start-2 lg:col-end-5 lg:gap-x-4 xl:grid-cols-4">
      {results?.map((shelter) => (
        <PetCard
          key={shelter.id}
          id={shelter.id}
          photo={shelter.logo ?? '/images/no-profile-picture.svg'}
          title={shelter.name ?? ''}
          body={shelter.description ?? ''}
          variant={Variant.Organization}
          tag={shelter.address?.address ?? ''}
          author={shelter.address?.address ?? ''}
          avatar={''}
        />
      ))}
    </div>
  );
};

export default SearchSheltersResults;
