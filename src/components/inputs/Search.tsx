import { SearchIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface ISearch {
  query: string;
  typeOfResults: string;
}

const Search: React.FC<ISearch> = ({ query, typeOfResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (query) {
      const encodedQuery = encodeURI(query);
      setSearchQuery(encodedQuery);
    }
  }, [query]);

  const onSearchEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      void router.push(`/${typeOfResults}#scrollToPosition`);
    } else {
      void router.push(
        `/${typeOfResults}?search=${searchQuery}#scrollToPosition`
      );
    }
  };

  return (
    <form
      className="flex w-[90%] max-w-[24rem] items-center rounded-full border-2 bg-neutral-50 p-2 shadow-sm dark:border-foreground dark:bg-transparent"
      onSubmit={onSearchEvent}
    >
      <input
        className="flex-grow border-none bg-transparent pl-3 pr-2 outline-none transition-colors duration-200 ease-in-out focus:ring-0 dark:placeholder-neutral-50"
        type="text"
        placeholder="California or 22-152"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        aria-label="Przycisk szukaj"
        type="submit"
      >
        <SearchIcon className="duration-50 h-14 cursor-pointer rounded-full bg-primary-300 p-2 text-white transition-transform ease-in-out hover:scale-95" />
      </button>
    </form>
  );
};

export default Search;
