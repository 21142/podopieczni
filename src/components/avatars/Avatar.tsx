import Image from 'next/image';

const Avatar = ({
  className,
  size,
  src,
  alt,
}: {
  className?: string;
  size: string;
  src: string;
  alt?: string;
}) => {
  return (
    <div className="flex -space-x-1 overflow-hidden">
      <Image
        className={`inline-block h-${size} w-${size} rounded-full ${className}`}
        src={`${src}`}
        alt={alt ? `${alt}` : 'Avatar image'}
        height={32}
        width={32}
      />
    </div>
  );
};

export default Avatar;
