import { MenuAlt2Icon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import AuthButton from 'src/components/buttons/auth/AuthButton';
import Logo from 'src/components/logos/default/Logo';
import { api } from '~/utils/api';
import { Roles } from '~/utils/constants';
import HeaderLink from '../../links/header/HeaderLink';

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

  return (
    <header
      {...headerProps}
      className={`sticky top-0 z-10 mx-auto flex h-20 w-full max-w-7xl flex-col px-5 2xl:max-w-8xl ${
        className ?? ''
      }`}
    >
      <div className="flex items-center justify-between md:space-x-10">
        <Link href="/">
          <div className="relative flex">
            <Logo />
          </div>
        </Link>
        <nav
          className={classNames(
            mobileMenuIsOpen
              ? 'fixed top-0 left-0 m-0 flex h-full w-full flex-col bg-neutral-0 pt-12 [&_a]:ml-5 [&_a]:flex [&_a]:h-16 [&_a]:items-center [&_a]:border-t [&_a]:border-neutral-50'
              : 'hidden items-center space-x-10 md:inline-flex'
          )}
        >
          <HeaderLink
            href="/"
            title="Główna"
          />
          {sessionData && sessionData.role !== Roles.Adopter ? (
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
              <HeaderLink
                href="/applications"
                title="Wnioski"
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
                title="Edukacja"
              />
              <HeaderLink
                href="/"
                title="Kontakt"
              />
            </>
          )}
          {mobileMenuIsOpen && (
            <div className="ml-5 mt-8 items-center space-x-5 sm:hidden">
              <AuthButton />
            </div>
          )}
        </nav>
        <div className="m-5 flex justify-between space-x-5">
          <div className="hidden items-center space-x-5 sm:inline-flex">
            <AuthButton />
          </div>
          <button
            className={classNames(
              mobileMenuIsOpen ? 'fixed top-5 right-10' : '',
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
