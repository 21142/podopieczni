import HeaderLink from '../../links/header/HeaderLink';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import Logo from 'src/components/logos/default/Logo';
import Link from 'next/link';
import AuthButton from 'src/components/auth/button/AuthButton';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> {}

const Header: React.FC<IHeader> = ({ className, ...headerProps }) => {
  return (
    <header
      {...headerProps}
      className={`sticky top-0 z-10 flex flex-col h-20 w-full px-5 mx-auto max-w-7xl 2xl:max-w-8xl ${className}`}
    >
      <div className="flex items-center justify-between space-x-10">
        <Link href="/">
          <div className="relative flex">
            <Logo />
          </div>
        </Link>
        <div className="hidden md:inline-flex pr-14 items-center space-x-10">
          <HeaderLink href="/" title="Główna" />
          <HeaderLink href="/" title="Adopcja" />
          <HeaderLink href="/" title="Edukacja" />
          <HeaderLink href="/" title="Kontakt" />
        </div>
        <div className="flex justify-between space-x-5 m-5">
          <div className="hidden sm:inline-flex items-center space-x-5">
            <AuthButton />
          </div>
          <div className="md:hidden">
            <MenuAlt2Icon className="w-8 h-8 cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
