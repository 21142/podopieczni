import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/primitives/Card';
import { Icons } from '../icons/Icons';

export interface IAnimalCard {
  id: number;
  tag: string;
  title: string;
  body?: string;
  author: string;
  avatar: string;
  photo?: string;
  variant: string;
  age?: string;
  type?: string;
  breeds?: {
    primary?: string;
  };
}

const PetCard: React.FC<IAnimalCard> = ({
  id,
  title,
  body,
  photo,
  variant,
  age,
  breeds,
  type,
}) => {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`${variant}/${id}`)}
      className="w-[calc(20rem + 2vw)] relative min-w-[20rem] max-w-[22rem] border-0 border-none shadow-md transition hover:cursor-pointer hover:ease-out"
    >
      <CardHeader className="p-0">
        <Image
          src={photo ?? '/no-profile-picture.svg'}
          alt="card__image"
          className="block h-96 max-w-full rounded-t-lg object-cover"
          width="360"
          height="400"
        />
        <CardTitle className="pt-5 pb-1">{title}</CardTitle>
        <CardDescription>
          {variant === 'organization'
            ? 'Zobacz podopiecznych organizacji'
            : `${age} • ${breeds?.primary} ${type ? `• ${type}` : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col overflow-hidden pt-3">
        <p className="h-12">
          {body
            ? `${body}`
            : variant === 'organization'
            ? ''
            : 'Podopieczny poszukujący kochającego opiekuna i bezpiecznego domu.'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 pb-3">
        <Icons.heart className="hover:scale-110" />
        <Icons.heartDonate className="hover:scale-110" />
      </CardFooter>
    </Card>
  );
};

export default PetCard;
