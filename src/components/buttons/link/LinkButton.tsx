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
      className={`lg:text-md flex cursor-pointer items-center justify-center gap-2 rounded-full border border-primary-300 py-1 px-4 text-sm text-primary-300 transition-all duration-200 ease-out hover:translate-y-1 hover:bg-primary-300 hover:text-white ${
        className as string
      }`}
    >
      {value}
    </button>
  );
};
