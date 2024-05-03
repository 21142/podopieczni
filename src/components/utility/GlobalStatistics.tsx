import { useTranslation } from 'next-i18next';
import { api } from '~/lib/api';

const GlobalStatistics = () => {
  const { data: adopted } = api.pet.getAdoptedPetsCount.useQuery();
  const { data: waiting } = api.pet.getPetsAvailableForAdoptionCount.useQuery();
  const { data: shelters } = api.shelter.getSheltersCount.useQuery();
  const { t } = useTranslation('common');

  const getSheltersCountText = (count: number | undefined) => {
    if (!count || count === 0) {
      return t('global_statistics_shelters_count');
    }
    let translationKey;
    if (count === 1) {
      translationKey = 'global_statistics_shelters_one';
    } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
      translationKey = 'global_statistics_shelters_few';
    } else {
      translationKey = 'global_statistics_shelters_count';
    }
    return t(translationKey);
  };

  const getAdoptedCountText = (count: number | undefined) => {
    if (!count || count === 0) {
      return t('global_statistics_adopted_count');
    }
    let translationKey;
    if (count === 1) {
      translationKey = 'global_statistics_adopted_one';
    } else {
      translationKey = 'global_statistics_adopted_count';
    }
    return t(translationKey);
  };

  const getAdoptableCountText = (count: number | undefined) => {
    if (!count || count === 0) {
      return t('global_statistics_adoptable_count');
    }
    let translationKey;
    if (count === 1) {
      translationKey = 'global_statistics_adoptable_one';
    } else {
      translationKey = 'global_statistics_adoptable_count';
    }
    return t(translationKey);
  };

  return (
    <div className="flex min-h-[80%] items-center justify-center gap-[1rem] sm:gap-[3rem] md:gap-[5rem]">
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {adopted}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {getAdoptedCountText(adopted)}
        </p>
      </div>
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-600 to-primary-200 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {waiting}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {getAdoptableCountText(waiting)}
        </p>
      </div>
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {shelters}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {getSheltersCountText(shelters)}
        </p>
      </div>
    </div>
  );
};

export default GlobalStatistics;
