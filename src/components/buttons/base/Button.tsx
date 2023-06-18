import Link from 'next/link';

export interface IButton {
  text: string;
  href?: string;
}

const Button: React.FC<IButton> = ({ text, href }) => {
  return (
    <Link
      href={href as string}
      className="cursor-pointer rounded-full border border-primary-300 py-1 px-4 text-primary-300 transition-colors duration-200 ease-in-out hover:bg-primary-300 hover:text-neutral-50 dark:bg-primary-300 dark:text-neutral-50 dark:hover:scale-95"
    >
      {text}
    </Link>
  );
};

export default Button;
