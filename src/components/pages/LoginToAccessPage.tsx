import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { Button } from '../primitives/Button';

const LoginToAccessPage: FC = ({}) => {
  const router = useRouter();
  const { data: userFromSession } = useUserFromSessionQuery();

  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">
        Please log in using an account associated with a shelter to see this
        view
      </p>
      <div className="flex justify-center gap-5">
        <Button
          variant="primary"
          size="lg"
          onClick={userFromSession ? () => void signOut() : () => void signIn()}
        >
          {userFromSession ? 'Wyloguj się' : 'Zaloguj się'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => void router.push('/')}
        >
          Strona główna
        </Button>
      </div>
    </div>
  );
};

export default LoginToAccessPage;
