import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';
import HeaderLink from '../../links/header/HeaderLink';
import Button from '../../buttons/base/Button';
import { MenuAlt2Icon } from '@heroicons/react/outline';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> {}

const Header: React.FC<IHeader> = ({ className, ...headerProps }) => {
  return (
    <header
      {...headerProps}
      className={`flex flex-col h-20 w-full px-5 mx-auto ${className}`}
    >
      <div className="flex items-center justify-between space-x-10">
        <div className="flex">
          <Link href="/">
            <Image
              src={logo}
              className="cursor-pointer"
              objectFit="contain"
              alt="podopieczni logo"
            />
          </Link>
        </div>
        <div className="hidden md:inline-flex items-center space-x-10">
          <HeaderLink title="Główna" />
          <HeaderLink title="Adopcja" />
          <HeaderLink title="Edukacja" />
          <HeaderLink title="Kontakt" />
        </div>
        <div className="flex justify-between space-x-5 m-5">
          <div className="hidden sm:inline-flex items-center space-x-5">
            <Button text="Zaloguj się" />
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
