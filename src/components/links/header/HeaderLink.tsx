import Link from 'next/link';

export interface IHeaderLink {
  href: string;
  title: string;
}

const HeaderLink: React.FC<IHeaderLink> = ({ href, title }) => {
  return (
    <Link href={href}>
      <a className="hover:text-primary-400 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110">
        {title}
      </a>
    </Link>
  );
};

export default HeaderLink;
