import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Icons } from '~/components/icons/Icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/components/primitives/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/primitives/DropdownMenu';
import { links } from '~/config/siteConfig';
import { useToast } from '~/hooks/useToast';
import useUserFromSessionQuery from '~/hooks/useUserFromSessionQuery';
import { api } from '~/lib/api';

const AuthDropdownMenu = () => {
  const { data: session } = useSession();
  const { data: userFromSession } = useUserFromSessionQuery(session);
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const { data: isUserAssociatedWithShelter } =
    api.user.isUserAssociatedWithShelter.useQuery(undefined, {
      enabled: session?.user !== undefined,
      retry: false,
    });

  const handleButtonClick = async () => {
    if (userFromSession) {
      await signOut();
      toast({
        description: t('nav_signout_toast_success'),
        variant: 'success',
      });
    } else {
      await signIn();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={userFromSession?.image as string}
            alt={userFromSession?.name ?? 'User avatar'}
          />
          <AvatarFallback>
            <span className="sr-only">Log in dropdown</span>
            <Icons.user className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userFromSession && (
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {userFromSession.name && (
                <p className="pb-0.5 font-medium">{userFromSession.name}</p>
              )}
              {userFromSession.email && (
                <p className="w-[200px] truncate pb-0.5 text-sm text-muted-foreground">
                  {userFromSession.email}
                </p>
              )}
            </div>
          </div>
        )}
        {userFromSession && <DropdownMenuSeparator />}
        <DropdownMenuItem asChild>
          {isUserAssociatedWithShelter && (
            <Link href={links.dashboard}>{t('nav_shelter')}</Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {isUserAssociatedWithShelter && (
            <Link href={links.animals}>{t('nav_animals')}</Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {userFromSession && (
            <Link href={links.userSettings}>{t('settings')}</Link>
          )}
        </DropdownMenuItem>
        {userFromSession && <DropdownMenuSeparator />}
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={async (event) => {
            event.preventDefault();
            await handleButtonClick();
          }}
        >
          {userFromSession ? `${t('nav_signout')}` : `${t('nav_login')}`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropdownMenu;
