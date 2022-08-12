import AnimalCard from 'src/components/cards/animal/AnimalCard';
import AnimalData from './types';

export interface ISearchResults {
  results?: AnimalData[];
}

const SearchResults: React.FC<ISearchResults> = ({ results }) => {
  console.log(results);
  return (
    <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-2">
      {results?.map((animal) => (
        <AnimalCard
          key={animal.id}
          photo={animal.photos[0]?.large ?? '/time-cat.jpeg'}
          tag={animal.status}
          title={animal.name}
          body={animal.description}
          avatar={animal.organization_id}
          author={animal.photos[0]?.small ?? '/time-cat.jpeg'}
        />
      ))}
    </div>
  );
};

export default SearchResults;
