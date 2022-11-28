import { signIn, signOut } from 'next-auth/react';
import { trpc } from 'src/utils/trpc';

const AuthButton: React.FC = () => {
  const query = trpc.auth.getSession.useQuery(undefined);

  const sessionData = query.data;

  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <button
        className="cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-sm text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-white lg:text-base"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData
          ? `Wyloguj się ${sessionData?.name?.split(' ').at(0)}`
          : 'Zaloguj się'}
      </button>
    </div>
  );
};

export default AuthButton;
