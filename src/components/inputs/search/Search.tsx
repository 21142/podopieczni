import { SearchIcon } from '@heroicons/react/outline';

export interface ISearch {}

const Search: React.FC<ISearch> = () => {
  return (
    <div className="flex p-2 w-[25rem] items-center rounded-full border-2 shadow-sm">
      <input
        className="flex-grow pl-3 pr-2 bg-transparent outline-none text-neutral-100 focus:text-neutral-50 transition-colors duration-200 ease-in-out"
        type="text"
        placeholder="Podaj ulicę, miejscowość lub kod pocztowy"
      />
      <SearchIcon className="h-8 p-1.5 rounded-full hover:scale-95 transition-transform duration-50 ease-in-out bg-primary-300 text-white cursor-pointer" />
    </div>
  );
};

export default Search;
