import { useSession } from 'next-auth/react';
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
import { api } from '~/lib/api';
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
  isLikedByUser?: boolean;
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
  isLikedByUser,
}) => {
  const { data: session } = useSession();
  const petContext = api.useContext().pet;
  const userContext = api.useContext().user;
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLikeClicked, setIsLikeClicked] = useState(isLikedByUser ?? false);
  const [isDonationClicked, setIsDonationClicked] = useState(false);

  const markPetAsFavoriteMutation = api.user.markPetAsFavorite.useMutation({
    onSuccess: () => {
      userContext.getFavoritePets.invalidate();
      petContext.getFeaturedAnimals.invalidate();
      petContext.queryPetsAvailableForAdoptionFulltextSearch.invalidate();
    },
  });
  const removePetFromFavoritesMutation =
    api.user.removePetFromFavorites.useMutation({
      onSuccess: () => {
        userContext.getFavoritePets.invalidate();
        petContext.getFeaturedAnimals.invalidate();
        petContext.queryPetsAvailableForAdoptionFulltextSearch.invalidate();
      },
    });

  const handleLikeClick = async () => {
    if (!session) {
      setTimeout(() => {
        router.push(links.favorites);
      }, 1000);
      return;
    }

    if (!isLikeClicked) {
      await markPetAsFavoriteMutation.mutateAsync(id);
      setTimeout(() => {
        router.push(links.favorites);
      }, 1000);
    } else {
      await removePetFromFavoritesMutation.mutateAsync(id);
    }
    setIsLikeClicked((prev) => !prev);
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
      className={`relative ${
        variant === Variant.Organization
          ? 'min-h-[600px] min-w-[300px]'
          : 'max-h-[600px]'
      } min-w-[239px] max-w-[350px] border-0 border-none shadow-md transition hover:cursor-pointer hover:ease-out`}
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
          <CardTitle className="flex justify-center pb-1 pt-5">
            {title}
          </CardTitle>
          <CardDescription className="flex justify-center">
            {variant === Variant.Organization
              ? t('organization_card_default_description')
              : `${age} • ${breed} ${type ? `• ${type}` : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent
          onClick={() => router.push(links.redirectTo(variant, id))}
          className="flex flex-col overflow-hidden pt-3"
        >
          <p className="h-12 text-center">
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
