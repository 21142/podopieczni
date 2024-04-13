import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { links } from '~/config/siteConfig';
import { buttonVariants } from '../primitives/Button';

const Custom500Page = () => {
  const { t } = useTranslation('common');

  return (
    <main className="relative grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 2xl:mx-auto 2xl:w-[70vw]">
      <Image
        src="/images/cosmos.svg"
        alt="cosmos"
        className="top-6 right-0 hidden lg:absolute lg:block"
        width="455"
        height="692"
      />
      <div className="text-center">
        <p className="bg-gradient-to-r from-primary-200 to-primary-600 bg-clip-text text-base font-semibold text-transparent">
          500
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('500_title')}
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          {t('500_subtitle')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={links.home}
            className={buttonVariants({ variant: 'primary', size: 'lg' })}
          >
            {t('500_button')}
          </Link>
          <Link
            href={links.contact}
            className={buttonVariants({ variant: 'link' })}
          >
            {t('500_contact')}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Custom500Page;
