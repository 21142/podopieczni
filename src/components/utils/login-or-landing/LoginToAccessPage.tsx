import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { CvaButton } from '~/components/buttons/cva/ButtonCva';
import { api } from '~/utils/api';

const LoginToAccessPage: FC = ({}) => {
  const router = useRouter();
  const { data: sessionData } = api.auth.getSession.useQuery();
  return (
    <div className="grid h-[50vh] content-center">
      <p className="p-12 text-center">
        Please log in using an account associated with a shelter to see this
        view
      </p>
      <div className="flex justify-center gap-5">
        <CvaButton
          variant="primary"
          className="w-36 rounded-md px-4 py-2"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? 'Wyloguj się' : 'Zaloguj się'}
        </CvaButton>
        <CvaButton
          variant="secondary"
          className="w-36 rounded-md"
          onClick={() => void router.push('/')}
        >
          Strona główna
        </CvaButton>
      </div>
    </div>
  );
};

export default LoginToAccessPage;
