import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { links } from '~/config/siteConfig';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { Button } from '../primitives/Button';

const LoginToAccessPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: userFromSession } = useUserFromSessionQuery(session);
  const { t } = useTranslation('common');

  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">{t('login_to_access')}</p>
      <div className="flex justify-center gap-5">
        <Button
          variant="primary"
          size="lg"
          onClick={userFromSession ? () => signOut() : () => signIn()}
        >
          {userFromSession ? 'Wyloguj się' : 'Zaloguj się'}
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push(links.home)}
        >
          Strona główna
        </Button>
      </div>
    </div>
  );
};

export default LoginToAccessPage;
