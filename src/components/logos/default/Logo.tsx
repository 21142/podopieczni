import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/logo.png';

export interface ILogo {}

const Logo: React.FC<ILogo> = () => {
  return (
    <Link href="/">
      <Image
        src={logo}
        className="cursor-pointer"
        objectFit="contain"
        alt="podopieczni logo"
      />
    </Link>
  );
};

export default Logo;
