import { useTranslation } from 'next-i18next';
import { api } from '~/lib/api';

const GlobalStatistics = () => {
  const { data: adopted } = api.pet.getAdoptedPetsCount.useQuery();
  const { data: waiting } = api.pet.getPetsAvailableForAdoptionCount.useQuery();
  const { data: shelters } = api.shelter.getSheltersCount.useQuery();
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-[80%] items-center justify-center gap-[1rem] sm:gap-[3rem] md:gap-[5rem]">
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {adopted}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {t('global_statistics_adopted_count')}
        </p>
      </div>
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-600 to-primary-200 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {waiting}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {t('global_statistics_adoptable_count')}
        </p>
      </div>
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-lg font-semibold text-transparent sm:text-2xl md:text-4xl lg:text-8xl">
          {shelters}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {t('global_statistics_shelters_count')}
        </p>
      </div>
    </div>
  );
};

export default GlobalStatistics;
