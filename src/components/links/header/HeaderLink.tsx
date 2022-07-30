import Link from 'next/link';

export interface IHeaderLink {
  title: string;
}

const HeaderLink: React.FC<IHeaderLink> = ({ title }) => {
  return (
    <Link href="/">
      <a className="text-gray-600 hover:text-primary-400 hover:underline">
        {title}
      </a>
    </Link>
  );
};

export default HeaderLink;
