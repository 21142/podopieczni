import { useTranslation } from 'next-i18next';
import HeaderLink from '~/components/links/HeaderLink';
import { voivodships } from '~/lib/constants';

const SearchByState: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="mt-[22rem] min-h-screen 2xl:mt-[25rem]">
      <p className="mb-5 text-lg text-neutral-700 dark:text-muted-foreground md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {t('search_by_state_title')}{' '}
        <span className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text font-bold text-transparent">
          {t('state')}
        </span>
      </p>
      <div className="mx-auto grid grid-cols-2 gap-x-1 gap-y-10 pt-5 text-center sm:grid-cols-3 md:gap-14 md:pt-10 lg:gap-20">
        {voivodships.map((voivodeship, index) => (
          <HeaderLink
            key={index}
            href={`/pets?search=${voivodeship.name}`}
            title={voivodeship.name}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchByState;
