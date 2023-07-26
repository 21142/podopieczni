import PetCard from '~/components/cards/PetCard';
import type IAnimalData from '../../types/petfinderTypes';
import { type IOrganizationData } from '../../types/petfinderTypes';

export interface ISearchResults {
  results?: IAnimalData[] | IOrganizationData[];
  typeOfResults: string;
}

const SearchResults: React.FC<ISearchResults> = ({
  results,
  typeOfResults,
}) => {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 text-center md:grid-cols-2 lg:col-span-3 lg:grid-cols-3 lg:gap-x-4">
      {results?.map((animal) => (
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
          variant={typeOfResults}
          age={animal.age}
          breeds={animal.breeds}
          type={animal.type}
        />
      ))}
    </div>
  );
};

export default SearchResults;
