import { useTranslation } from 'next-i18next';
import HeaderLink from '~/components/links/HeaderLink';

const SearchByState: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="mt-[22rem] min-h-screen 2xl:mt-[25rem]">
      <p className="mb-5 text-lg text-neutral-700 dark:text-muted-foreground md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {t('search_by_state_title')}{' '}
        <span className="bg-gradient-to-r from-primary-200 to-indigo-600 bg-clip-text font-bold text-transparent">
          {t('state')}
        </span>
      </p>
      <div className="grid grid-cols-2 content-center gap-10 pt-5 text-center sm:grid-cols-3 md:gap-14 md:pt-10 lg:w-full lg:gap-20">
        <HeaderLink
          href="/search/breed/bulldog"
          title="Bulldog"
        />
        <HeaderLink
          href="/search/breed/pudel"
          title="Pudel"
        />
        <HeaderLink
          href="/search/breed/cockerspaniel"
          title="Cocker spaniel"
        />
        <HeaderLink
          href="/search/breed/labrador"
          title="Labrador"
        />
        <HeaderLink
          href="/search/breed/goldenretriever"
          title="Golden Retriever"
        />
        <HeaderLink
          href="/search/breed/chihuahua"
          title="Chihuahua"
        />
        <HeaderLink
          href="/search/breed/owczarekniemiecki"
          title="Owczarek niemiecki"
        />
        <HeaderLink
          href="/search/breed/yorkshireterrier"
          title="Yorkshire Terrier"
        />
        <HeaderLink
          href="/search/breed/doberman"
          title="Doberman"
        />
        <HeaderLink
          href="/search/breed/owczarekniemiecki"
          title="Owczarek niemiecki"
        />
        <HeaderLink
          href="/search/breed/yorkshireterrier"
          title="Yorkshire Terrier"
        />
        <HeaderLink
          href="/search/breed/doberman"
          title="Doberman"
        />
      </div>
    </div>
  );
};

export default SearchByState;
