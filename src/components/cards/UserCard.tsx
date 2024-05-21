import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { links } from '~/config/siteConfig';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../primitives/Card';

type IUserCard = {
  id: string;
  name: string;
  image?: string;
  role: string;
};

const UserCard: FC<IUserCard> = ({ id, name, image, role }) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(links.user(id))}
      className={`transform rounded-lg shadow transition duration-100 hover:scale-105 hover:cursor-pointer hover:ease-out`}
    >
      <CardHeader className="grid place-items-center px-2 py-6">
        <Image
          src={image ?? '/images/no-profile-picture.svg'}
          alt="card__image"
          className="h-48 w-48 rounded-full object-cover"
          width="320"
          height="320"
        />
        <CardTitle className="pb-1 pt-5">{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
