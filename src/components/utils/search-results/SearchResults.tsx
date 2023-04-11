import AnimalCard from 'src/components/cards/animal/AnimalCard';
import type IAnimalData from './types';
import type IOrganizationData from './types';

export interface ISearchResults {
  results?: IAnimalData[] | IOrganizationData[];
  typeOfResults: string;
}

const SearchResults: React.FC<ISearchResults> = ({
  results,
  typeOfResults,
}) => {
  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:col-span-3 lg:gap-x-4 xl:grid-cols-3">
      {results?.map((animal) => (
        <AnimalCard
          key={animal.id}
          id={animal.id}
          photo={animal.photos[0]?.large ?? '/no-profile-picture.svg'}
          tag={animal.status}
          title={animal.name}
          body={animal.description}
          avatar={animal.organization_id}
          author={animal.photos[0]?.small ?? '/no-profile-picture.svg'}
          variant={typeOfResults}
        />
      ))}
    </div>
  );
};

export default SearchResults;
