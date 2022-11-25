import HeaderLink from '../../links/header/HeaderLink';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import Logo from 'src/components/logos/default/Logo';
import Link from 'next/link';
import AuthButton from 'src/components/auth/button/AuthButton';
import { useSession } from 'next-auth/react';

const Header: React.FC<JSX.IntrinsicElements['header']> = ({
  className,
  ...headerProps
}) => {
  const { data: sessionData } = useSession();

  return (
    <header
      {...headerProps}
      className={`sticky top-0 z-10 mx-auto flex h-20 w-full max-w-7xl flex-col px-5 2xl:max-w-8xl ${className}`}
    >
      <div className="flex items-center justify-between space-x-10">
        <Link href="/">
          <div className="relative flex">
            <Logo />
          </div>
        </Link>
        <div className="hidden items-center space-x-10 pr-14 md:inline-flex">
          <HeaderLink
            href="/"
            title="Główna"
          />
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
          {sessionData && (
            <HeaderLink
              href="/register"
              title="Dodaj"
            />
          )}
        </div>
        <div className="m-5 flex justify-between space-x-5">
          <div className="hidden items-center space-x-5 sm:inline-flex">
            <AuthButton />
          </div>
          <div className="md:hidden">
            <MenuAlt2Icon className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
