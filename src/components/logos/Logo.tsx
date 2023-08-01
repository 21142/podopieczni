import Image from 'next/image';

const Logo: React.FC = () => {
  return (
    <Image
      src="/images/logo.svg"
      className="cursor-pointer object-contain"
      alt="podopieczni logo"
      height={51}
      width={230}
      loading="eager"
    />
  );
};

export default Logo;
