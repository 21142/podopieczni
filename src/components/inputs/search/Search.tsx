import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export interface ISearch {
  query: string;
}

const Search: React.FC<ISearch> = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  return (
    <form
      className="flex p-2 w-[90%] max-w-[24rem] bg-neutral-50 items-center rounded-full border-2 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchQuery) {
          router.push('/results');
        } else {
          router.push(`/results?search=${searchQuery}`);
        }
      }}
    >
      <input
        className="flex-grow pl-3 pr-2 bg-transparent outline-none placeholder-neutral-400 text-neutral-400 focus:text-neutral-600 transition-colors duration-200 ease-in-out"
        type="text"
        placeholder="np. California lub 22-152"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">
        <SearchIcon className="h-8 p-1.5 rounded-full hover:scale-95 transition-transform duration-50 ease-in-out bg-primary-300 text-white cursor-pointer" />
      </button>
    </form>
  );
};

export default Search;
