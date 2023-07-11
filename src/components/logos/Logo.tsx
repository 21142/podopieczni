import Image from 'next/image';
import logo from '/public/images/logo.svg';

const Logo: React.FC = () => {
  return (
    <Image
      src={logo}
      className="cursor-pointer object-contain"
      alt="podopieczni logo"
      height={51}
      width={230}
      loading="eager"
    />
  );
};

export default Logo;
