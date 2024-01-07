import Image from 'next/image';

const LogoDark = () => {
  return (
    <Image
      src="/images/logo-dark.svg"
      className="cursor-pointer object-contain"
      alt="podopieczni logo"
      height={51}
      width={230}
      loading="eager"
      priority
    />
  );
};

export default LogoDark;
