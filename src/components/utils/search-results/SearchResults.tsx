import AnimalCard from 'src/components/cards/animal/AnimalCard';
import type IAnimalData from './types';

export interface ISearchResults {
  results?: IAnimalData[];
}

const SearchResults: React.FC<ISearchResults> = ({ results }) => {
  return (
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      {results?.map((animal) => (
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

export default SearchResults;
