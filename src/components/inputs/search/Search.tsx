import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export interface ISearch {
  query: string;
}

const Search: React.FC<ISearch> = ({ query }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  return (
    <form
      className="flex w-[90%] max-w-[24rem] items-center rounded-full border-2 bg-neutral-50 p-2 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!searchQuery) {
          void router.push("/results");
        } else {
          void router.push(`/results?search=${searchQuery}`);
        }
      }}
    >
      <input
        className="flex-grow border-none bg-transparent pl-3 pr-2 text-neutral-400 placeholder-neutral-400 outline-none transition-colors duration-200 ease-in-out focus:text-neutral-600 focus:ring-0"
        type="text"
        placeholder="np. California lub 22-152"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button aria-label="Przycisk szukaj" type="submit">
        <SearchIcon className="duration-50 bg-primary-300 h-14 cursor-pointer rounded-full p-2 text-white transition-transform ease-in-out hover:scale-95" />
      </button>
    </form>
  );
};

export default Search;
