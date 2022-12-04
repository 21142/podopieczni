import { signIn, signOut } from 'next-auth/react';
import Avatar from 'src/components/avatars/base/Avatar';
import { trpc } from 'src/utils/trpc';

const AuthButton: React.FC = () => {
  const query = trpc.auth.getSession.useQuery();
  const sessionData = query.data;

  return (
    <button
      className="duration-50 lg:text-md min-w-[8rem] cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-sm font-medium text-primary-300 duration-300 ease-in-out hover:scale-95 hover:bg-primary-300 hover:font-semibold hover:text-white xl:text-base"
      onClick={sessionData ? () => signOut() : () => signIn()}
    >
      {sessionData ? (
        <div className="flex min-w-[7.5rem] items-center justify-between xl:gap-2">
          Wyloguj się{' '}
          <Avatar
            src={sessionData?.image ?? '/no-profile-picture.svg'}
            size={'8'}
          />
        </div>
      ) : (
        'Zaloguj się'
      )}
    </button>
  );
};

export default AuthButton;
