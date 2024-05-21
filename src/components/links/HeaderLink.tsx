import Link from 'next/link';
import { type FC } from 'react';

type IHeaderLink = {
  href: string;
  title: string;
  className?: string;
};

const HeaderLink: FC<IHeaderLink> = ({ href, title, className }) => {
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
