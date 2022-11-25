import Image from 'next/image';
import logo from '../../../../public/images/logo.svg';

const Logo: React.FC = () => {
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
