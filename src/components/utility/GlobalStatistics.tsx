import { useTranslation } from 'next-i18next';

export interface IGlobalStatistics {
  adopted: number;
  waiting: number;
  shelters: number;
}

const GlobalStatistics: React.FC<IGlobalStatistics> = (mock) => {
  const { adopted, waiting, shelters } = mock;
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-[80%] items-center justify-center gap-[1rem] sm:gap-[3rem] md:gap-[5rem]">
      <div className="text-center">
        <p className="text-lg font-semibold dark:text-muted-foreground sm:text-2xl md:text-4xl">
          {adopted}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {t('global_statistics_adopted_count')}
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold dark:text-muted-foreground sm:text-2xl md:text-4xl">
          {waiting}
        </p>
        <p className="text-md font-light text-foreground sm:text-lg md:text-2xl">
          {t('global_statistics_adoptable_count')}
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold dark:text-muted-foreground sm:text-2xl md:text-4xl">
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
