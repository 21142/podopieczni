import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Avatar from 'src/components/avatars/base/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/primitives/DropdownMenu';
import { api } from '~/utils/api';
import { Roles } from '~/utils/constants';

//TODO: Consider renaming to AuthDropdownMenu
const AuthButton: React.FC = () => {
  const { data: sessionData } = api.auth.getSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          src={sessionData?.image ?? '/no-profile-picture.svg'}
          size={'8'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sessionData && (
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {sessionData.name && (
                <p className="font-medium">{sessionData.name}</p>
              )}
              {sessionData.email && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {sessionData.email}
                </p>
              )}
            </div>
          </div>
        )}
        {sessionData && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          {(sessionData?.role === Roles.Shelter ||
            sessionData?.role === Roles.Admin) && (
            <Link href="/dashboard">Dashboard</Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {(sessionData?.role === Roles.Shelter ||
            sessionData?.role === Roles.Admin) && (
            <Link href="/pets">Pets</Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {sessionData && <Link href="/user/settings">Settings</Link>}
        </DropdownMenuItem>
        {sessionData && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            sessionData ? signOut() : signIn();
          }}
        >
          {sessionData ? 'Sign out' : 'Log in'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
