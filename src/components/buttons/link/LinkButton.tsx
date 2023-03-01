export const LinkButton = ({
  value,
  className,
  onClick,
}: {
  value: string;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`lg:text-md border-primary-300 text-primary-300 hover:bg-primary-300 flex cursor-pointer items-center justify-center gap-2 rounded-full border py-1 px-4 text-sm transition-colors duration-200 ease-in-out hover:text-white ${
        className as string
      }`}
    >
      {value}
    </button>
  );
};
