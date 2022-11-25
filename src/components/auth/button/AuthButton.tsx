import { signIn, signOut, useSession } from 'next-auth/react';

const AuthButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
      <button
        className="cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-sm text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-white lg:text-base"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData
          ? `Wyloguj się ${sessionData?.user?.name?.split(' ').at(0)}`
          : 'Zaloguj się'}
      </button>
    </div>
  );
};

export default AuthButton;
