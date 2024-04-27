import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/primitives/Card';
import { links } from '~/config/siteConfig';
import { Variant } from '~/lib/constants';
import { Icons } from '../icons/Icons';

export interface IAnimalCard {
  id: string;
  tag: string;
  title: string;
  body?: string;
  author: string;
  avatar: string;
  photo?: string;
  variant: string;
  age?: string;
  type?: string;
  breed?: string;
}

const PetCard: React.FC<IAnimalCard> = ({
  id,
  title,
  body,
  photo,
  variant,
  age,
  breed,
  type,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const [isDonationClicked, setIsDonationClicked] = useState(false);

  const handleLikeClick = () => {
    if (!isLikeClicked) {
      console.log('TODO: add mutation to tag as favorite pet with id: ', id);
    } else {
      console.log(
        'TODO: add mutation to remove from favorites pet with id: ',
        id
      );
    }
    setIsLikeClicked((prev) => !prev);
    setTimeout(() => {
      router.push(links.favorites);
    }, 1000);
  };

  const handleDonationClick = () => {
    console.log('TODO: add mutation to donate for a pet with id: ', id);
    setIsDonationClicked((prev) => !prev);
    setTimeout(() => {
      router.push(links.donate(id));
    }, 1000);
  };

  return (
    <Card
      key={id}
      className="relative min-w-[239px] max-w-[22rem] border-0 border-none shadow-md transition hover:cursor-pointer hover:ease-out"
    >
      <>
        <CardHeader
          onClick={() => router.push(links.redirectTo(variant, id))}
          className="p-0"
        >
          <Image
            src={photo ?? '/images/no-profile-picture.svg'}
            alt="card__image"
            className="block h-96 max-w-full rounded-t-lg object-cover"
            width="360"
            height="400"
          />
          <CardTitle className="pb-1 pt-5">{title}</CardTitle>
          <CardDescription>
            {variant === Variant.Organization
              ? t('organization_card_default_description')
              : `${age} • ${breed} ${type ? `• ${type}` : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent
          onClick={() => router.push(links.redirectTo(variant, id))}
          className="flex flex-col overflow-hidden pt-3"
        >
          <p className="h-12">
            {body
              ? `${body}`
              : variant === Variant.Organization
              ? ''
              : 'Podopieczny poszukujący kochającego opiekuna i bezpiecznego domu.'}
          </p>
        </CardContent>
        {variant === Variant.Animal && (
          <CardFooter className="flex justify-end gap-2 pb-3 pt-2">
            <Icons.heart
              onClick={handleLikeClick}
              className={`transition-all ease-in-out hover:scale-110 ${
                isLikeClicked ? 'fill-primary-300 text-primary-300' : ''
              }`}
            />
            <Icons.heartDonate
              onClick={handleDonationClick}
              className={`transition-all ease-in-out hover:scale-110 ${
                isDonationClicked ? 'fill-success-200 text-success-400' : ''
              }`}
            />
          </CardFooter>
        )}
      </>
    </Card>
  );
};

export default PetCard;
