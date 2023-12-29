import Link from 'next/link';

export interface IHeaderLink {
  href: string;
  title: string;
  className?: string;
}

const HeaderLink: React.FC<IHeaderLink> = ({ href, title, className }) => {
  return (
    <Link
      href={href}
      className={`cursor-pointer transition-transform duration-200 ease-in-out hover:text-primary-400 md:hover:scale-105 ${className}`}
    >
      {title}
    </Link>
  );
};

export default HeaderLink;
