import Image from 'next/image';
import logoDark from '/public/images/logo-dark.svg';

const Logo: React.FC<{ className?: string }> = (className) => {
  return (
    <Image
      src={logoDark}
      className={`cursor-pointer object-contain ${className}`}
      alt="podopieczni logo"
      height={51}
      width={230}
      loading="eager"
    />
  );
};

export default Logo;
