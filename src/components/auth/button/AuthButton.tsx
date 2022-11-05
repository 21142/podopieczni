import { signIn, signOut, useSession } from 'next-auth/react';

const AuthButton: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
      <button
        className="text-primary-300 border border-primary-300 rounded-full py-1 px-4 text-sm lg:text-base hover:text-white hover:bg-primary-300 transition-colors duration-200 ease-in-out cursor-pointer"
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
