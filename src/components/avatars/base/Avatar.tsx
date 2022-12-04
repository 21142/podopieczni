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
      <img
        className={`inline-block h-${size} w-${size} rounded-full ${className}`}
        src={`${src}`}
        alt={alt ? `${alt}` : 'Avatar image'}
      />
    </div>
  );
};

export default Avatar;
