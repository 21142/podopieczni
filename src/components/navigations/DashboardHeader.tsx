import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import AuthButton from 'src/components/buttons/auth/AuthButton';
import { Icons } from '~/components/icons/Icons';
import Logo from '~/components/logos/Logo';
import LogoDark from '~/components/logos/LogoDark';
import { buttonVariants } from '~/components/primitives/Button';
import { ThemeToggle } from '~/components/utility/ThemeToggle';
import { api } from '~/lib/api';
import { Roles } from '~/lib/constants';
import HeaderLink from '../links/HeaderLink';

const DashboardHeader: React.FC<JSX.IntrinsicElements['header']> = ({
  className,
  ...headerProps
}) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const { data: sessionData } = api.auth.getSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <header
      {...headerProps}
      className={`sticky top-0 z-10 w-screen border-b border-b-accent py-[14px] px-8 ${
        className ?? ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-3 lg:gap-x-10 2xl:max-w-8xl">
        <Link href="/">
          <div className="relative flex">
            {currentTheme === 'light' ? <Logo /> : <LogoDark />}
          </div>
        </Link>
        <nav
          className={classNames(
            mobileMenuIsOpen
              ? 'fixed top-0 left-0 m-0 flex h-full w-full flex-col bg-background pt-16 [&_a]:flex [&_a]:h-16 [&_a]:items-center [&_a]:border-t [&_a]:border-neutral-50 [&_a]:pl-5'
              : 'hidden items-center gap-x-10 md:inline-flex'
          )}
        >
          <HeaderLink
            href="/"
            title="Główna"
          />
          {sessionData &&
          (sessionData.role === Roles.Shelter ||
            sessionData.role === Roles.Admin) ? (
            <>
              <HeaderLink
                href="/dashboard"
                title="Schronisko"
              />
              <HeaderLink
                href="/pets"
                title="Zwierzęta"
              />
              <HeaderLink
                href="/users"
                title="Użytkownicy"
              />
            </>
          ) : (
            <>
              <HeaderLink
                href="/"
                title="Adopcja"
              />
              <HeaderLink
                href="/"
                title="Kontakt"
              />
            </>
          )}
          {mobileMenuIsOpen && (
            <HeaderLink
              href="/user/favorites"
              title="Ulubione"
              className={buttonVariants({
                size: 'sm',
                variant: 'ghost',
              })}
            />
          )}
          {mobileMenuIsOpen && (
            <div className="flex items-center gap-x-5 border-t border-neutral-50 pl-4 pt-3 sm:hidden">
              <AuthButton />
              <ThemeToggle />
            </div>
          )}
        </nav>
        <div className="flex items-center justify-between gap-x-2 sm:gap-x-5">
          <div className="mr-12 hidden items-center gap-x-5 sm:mr-0 sm:inline-flex">
            <Link
              href="/user/favorites"
              className={buttonVariants({
                variant: 'ghost',
                size: 'sm',
                className: 'h-9 w-9 px-0',
              })}
            >
              <Icons.heart className="h-8 w-8" />
            </Link>
            <ThemeToggle />
            <AuthButton />
          </div>
          <button
            className={classNames(
              mobileMenuIsOpen ? 'fixed top-6 right-5' : '',
              'z-10 md:hidden'
            )}
            onClick={() => setMobileMenuIsOpen((currentState) => !currentState)}
          >
            <span className="sr-only">Toggle navigation menu</span>
            {mobileMenuIsOpen ? (
              <XIcon className="h-8 w-8 cursor-pointer" />
            ) : (
              <MenuAlt2Icon className="h-8 w-8 cursor-pointer" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
