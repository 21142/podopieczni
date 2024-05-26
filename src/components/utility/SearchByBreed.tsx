import { useTranslation } from 'next-i18next';
import HeaderLink from '~/components/links/HeaderLink';
import { links } from '~/config/siteConfig';
import { TypeOfResults } from '~/lib/constants';
import { dogBreeds } from '~/static/breeds';

const SearchByBreed = () => {
  const { t, i18n } = useTranslation('common');

  const breedsToDisplay = dogBreeds.slice(0, 12);
  return (
    <div className="mt-[10rem] md:mt-[15rem] lg:mt-[18rem] xl:mt-[22rem] 2xl:mt-[25rem]">
      <p className="mb-5 text-lg text-neutral-700 dark:text-muted-foreground md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {t('search_by_breed_title')}{' '}
        <span className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-transparent">
          {t('breed')}
        </span>
      </p>
      <div className="grid grid-cols-2 content-center gap-10 pt-5 text-center sm:grid-cols-3 md:gap-14 md:pt-10 lg:w-full xl:gap-20">
        {breedsToDisplay.map((breed, index) => (
          <HeaderLink
            key={index}
            href={links.search(
              TypeOfResults.Animal,
              breed[i18n.language as 'en' | 'pl']
            )}
            title={t(breed[i18n.language as 'en' | 'pl'])}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchByBreed;
