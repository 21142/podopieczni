import Image from 'next/image';
import logo from '/public/images/logo.svg';

const Logo: React.FC = () => {
  return (
    <Image
      src={logo as string}
      className="cursor-pointer w-44 object-contain"
      alt="podopieczni logo"
      priority
    />
  );
};

export default Logo;
