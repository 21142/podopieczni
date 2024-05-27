import { useTranslation } from 'next-i18next';
import HeaderLink from '~/components/links/HeaderLink';
import { links } from '~/config/siteConfig';
import { TypeOfResults, voivodships } from '~/lib/constants';

const SearchByState = () => {
  const { t } = useTranslation('common');
  return (
    <div className="relative mt-[22rem] min-h-screen text-sm sm:text-base 2xl:mt-[25rem]">
      <div
        id="searchByState"
        className="absolute -top-32"
      />
      <p className="mb-10 text-base text-neutral-700 dark:text-muted-foreground sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {t('search_by_state_title')}{' '}
        <span className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text font-bold text-transparent">
          {t('state')}
        </span>
      </p>
      <div className="mx-auto grid grid-cols-2 gap-x-1 gap-y-10 pt-5 text-center sm:grid-cols-3 md:gap-14 md:pt-10 lg:gap-20">
        {voivodships.map((voivodeship, index) => (
          <HeaderLink
            key={index}
            href={links.search(TypeOfResults.Animal, voivodeship.name)}
            title={voivodeship.name}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchByState;
