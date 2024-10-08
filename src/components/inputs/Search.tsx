import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FC } from 'react';
import { links } from '~/config/siteConfig';
import { Icons } from '../icons/Icons';

type ISearch = {
  query: string;
  typeOfResults: string;
};

const Search: FC<ISearch> = ({ query, typeOfResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const onSearchEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      router.push(links.results(typeOfResults));
    } else {
      router.push(links.search(typeOfResults, searchQuery));
    }
  };

  return (
    <form
      className="flex w-[90%] max-w-[24rem] items-center rounded-full border-2 bg-neutral-50 p-2 shadow-sm dark:border-foreground dark:bg-transparent"
      onSubmit={onSearchEvent}
    >
      <input
        className="flex-grow border-none bg-transparent pl-3 pr-2 outline-none transition-colors duration-200 ease-in-out placeholder:text-[0.6rem] focus:ring-0 dark:placeholder-neutral-50/80 sm:placeholder:text-sm"
        type="text"
        placeholder={t('hero_search_placeholder')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        aria-label="Search button"
        type="submit"
      >
        <Icons.search className="duration-50 h-11 w-11 cursor-pointer rounded-full bg-primary-300 p-2 text-white transition-transform ease-in-out hover:scale-95" />
      </button>
    </form>
  );
};

export default Search;
