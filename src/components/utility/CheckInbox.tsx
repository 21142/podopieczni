import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { buttonVariants } from '../primitives/Button';

type Props = {
  joinRequest?: string | null;
};

const CheckInbox: FC<Props> = ({ joinRequest }) => {
  const { t } = useTranslation('common');

  return (
    <div className="relative h-[20rem] w-full lg:h-[22rem] xl:h-[23rem] 2xl:h-[24rem]">
      <div className="absolute left-1/2 top-[25%] flex h-[17rem] w-full -translate-x-1/2 flex-col items-center justify-center rounded-2xl bg-white/20 px-5 text-center shadow-lg backdrop-blur-sm dark:bg-white/10 xs:w-[90%] sm:top-[30%] sm:max-w-[34rem] xl:top-[35%]">
        <Image
          src="/images/no-profile-picture.svg"
          width={120}
          height={120}
          quality={100}
          className="-translate-y-20 rounded-2xl shadow-lg backdrop-blur-sm"
          alt="podopieczni logo"
          loading="eager"
          priority
        />
        <h1 className="-mt-16 mb-3 text-lg font-bold tracking-tight text-foreground sm:text-xl sm:tracking-normal">
          {t('check_email_title')}
        </h1>
        <h2 className="mb-6 text-base font-medium tracking-tight text-foreground sm:text-lg sm:tracking-normal">
          {joinRequest
            ? t('check_email_for_invite_decision')
            : t('check_email_subtitle')}
        </h2>
        <Link
          href={links.home}
          className={buttonVariants({ variant: 'default', size: 'lg' })}
        >
          {t('button_navigate_home')}
        </Link>
      </div>
    </div>
  );
};

export default CheckInbox;
