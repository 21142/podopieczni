import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import { UserAuthForm } from '../forms/UserAuthForm';

type Props = {
  error: string | null;
};

const AuthenticationPage: FC<Props> = ({ error }) => {
  const { t } = useTranslation('common');
  return (
    <div className="mx-auto mt-6 flex w-[80%] flex-col justify-center space-y-4 sm:-mb-20 sm:mt-14 sm:w-[500px]">
      {error && (
        <p className="text-center text-sm text-red-600">{t('signin_error')}</p>
      )}
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('signin_title')}
        </h1>
        <p className="text-sm text-muted-foreground">{t('signin_subtitle')}</p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        {t('signin_description')}
        <Link
          href={links.termsOfService}
          className="hover:text-primary underline underline-offset-4"
        >
          {t('footer_terms_of_service')}
        </Link>
        {t('signin_and')}
        <Link
          href={links.privacyPolicy}
          className="hover:text-primary underline underline-offset-4"
        >
          {t('footer_privacy_policy')}
        </Link>
        .
      </p>
    </div>
  );
};

export default AuthenticationPage;
