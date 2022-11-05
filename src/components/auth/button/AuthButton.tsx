import { trpc } from 'src/utils/trpc';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthButton: React.FC = () => {
  //   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
      {sessionData && (
        <p className="text-lg text-primary-300">
          Witaj {sessionData?.user?.name?.split(' ').at(0)}
        </p>
      )}
      {/* {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )} */}
      <button
        className="text-primary-300 border border-primary-300 rounded-full py-1 px-4 hover:text-white hover:bg-primary-300 transition-colors duration-200 ease-in-out cursor-pointer"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? 'Wyloguj się' : 'Zaloguj się'}
      </button>
    </div>
  );
};

export default AuthButton;
