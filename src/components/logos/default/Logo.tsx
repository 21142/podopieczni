import Image from 'next/image';
import logo from '/public/images/logo.svg';

const Logo: React.FC = () => {
  return (
    <Image
      src={logo as string}
      className="w-44 cursor-pointer object-contain"
      alt="podopieczni logo"
      height={176}
      width={176}
      priority
    />
  );
};

export default Logo;
