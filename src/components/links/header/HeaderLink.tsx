import Link from 'next/link';

export interface IHeaderLink {
  title: string;
}

const HeaderLink: React.FC<IHeaderLink> = ({ title }) => {
  return (
    <Link href="/">
      <h3 className="hover:text-primary-400 cursor-pointer transition duration-100 ease-in-out hover:scale-110">
        {title}
      </h3>
    </Link>
  );
};

export default HeaderLink;
