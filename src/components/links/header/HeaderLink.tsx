import Link from 'next/link';

export interface IHeaderLink {
  href: string;
  title: string;
}

const HeaderLink: React.FC<IHeaderLink> = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="cursor-pointer transition-transform duration-200 ease-in-out hover:text-primary-400 md:hover:scale-110"
    >
      {title}
    </Link>
  );
};

export default HeaderLink;
