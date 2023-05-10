import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface IUserCard {
  id: string;
  name: string;
  image?: string;
  role: string;
}

const UserCard: React.FC<IUserCard> = ({ id, name, image, role }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`user/${id}`)}
      className={`transform rounded-lg shadow transition duration-100 hover:scale-105 hover:cursor-pointer hover:ease-out`}
    >
      <div className="">
        <div className="grid h-64 place-items-center">
          <Image
            src={image ?? '/no-profile-picture.svg'}
            alt="card__image"
            className="h-48 w-48 rounded-full object-cover"
            width="320"
            height="320"
          />
        </div>
        <div className="px-4 md:px-6 h-16">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-neutral-600 ">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
