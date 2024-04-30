import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { buttonVariants } from 'src/components/primitives/Button';
import { links } from '~/config/siteConfig';
import { TypeOfResults } from '~/lib/constants';
import Search from '../inputs/Search';

const Hero: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="relative h-[19rem] w-full lg:h-[20rem] xl:h-[21rem] 2xl:h-[22rem]">
      <Image
        src="https://i.postimg.cc/7Y7Lk3S8/hero.png"
        fill
        sizes="100vw"
        quality={100}
        className="object-cover"
        alt="hero image section"
        loading="eager"
        priority
      />
      <div className="absolute left-1/2 top-[58%] flex h-[12.5rem] w-full -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-white/20 text-center shadow-lg backdrop-blur-sm dark:bg-white/10 xs:w-[90%] sm:max-w-[34rem] xl:top-[62%]">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-neutral-50 dark:text-foreground sm:text-2xl sm:tracking-normal">
          {t('hero_search_label')}:
        </h2>
        <Search
          query={''}
          typeOfResults={TypeOfResults.Animal}
        />
        <div className="flex w-[19.5rem] items-center justify-center gap-x-5 pt-3">
          <a
            href={links.results(TypeOfResults.Animal)}
            className={buttonVariants({ variant: 'roundedButton' })}
          >
            {t('hero_search_button_pets')}
          </a>
          <a
            href={links.results(TypeOfResults.Organization)}
            className={buttonVariants({ variant: 'roundedButton' })}
          >
            {t('hero_search_button_shelters')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
