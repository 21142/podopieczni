import Image from 'next/image';
import logo from '../../../../public/images/logo.png';

export interface ILogo { }

const Logo: React.FC<ILogo> = () => {
  return (
    <Image
      src={logo}
      className="cursor-pointer"
      objectFit="contain"
      alt="podopieczni logo"
      priority
    />
  );
};

export default Logo;
