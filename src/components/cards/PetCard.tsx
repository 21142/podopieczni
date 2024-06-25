import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from 'src/components/primitives/Card';
import { links } from '~/config/siteConfig';
import { useLoginToast } from '~/hooks/useLoginToast';
import { api } from '~/lib/api';
import { Variant } from '~/lib/constants';
import { truncate } from '~/lib/utils';
import { Icons } from '../icons/Icons';

type IAnimalCard = {
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
};

const PetCard: FC<IAnimalCard> = ({
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
  const trpcContextUtils = api.useUtils();
  const { t } = useTranslation('common');
  const { loginToast } = useLoginToast();
  const router = useRouter();
  const [isLikeClicked, setIsLikeClicked] = useState(isLikedByUser ?? false);
  const [isDonationClicked, setIsDonationClicked] = useState(false);

  const markPetAsFavoriteMutation = api.user.markPetAsFavorite.useMutation({
    onSuccess: async () => {
      await trpcContextUtils.user.getFavoritePets.invalidate();
      await trpcContextUtils.pet.getFeaturedAnimals.invalidate();
      await trpcContextUtils.pet.queryPetsAvailableForAdoption.invalidate();
    },
  });

  const removePetFromFavoritesMutation =
    api.user.removePetFromFavorites.useMutation({
      onSuccess: async () => {
        await trpcContextUtils.user.getFavoritePets.invalidate();
        await trpcContextUtils.pet.getFeaturedAnimals.invalidate();
        await trpcContextUtils.pet.queryPetsAvailableForAdoption.invalidate();
      },
    });

  const handleLikeClick = async () => {
    if (!session) {
      loginToast();
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
    if (!session) {
      loginToast();
      return;
    }
    console.log('TODO: add mutation to donate for a pet with id: ', id);
    setIsDonationClicked((prev) => !prev);
    setTimeout(() => {
      router.push(links.donate(id));
    }, 1000);
  };

  return (
    <Card
      id="card"
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
          <CardTitle className="mx-auto flex max-w-[90%] justify-center pb-1 pt-5">
            {title}
          </CardTitle>
          <CardDescription className="mx-auto flex max-w-[90%] justify-center">
            {variant === Variant.Organization
              ? t('organization_card_default_description')
              : `${age ? `${age} ` : ''} ${breed ? `• ${breed}` : ''} ${
                  type ? `• ${type}` : ''
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent
          onClick={() => router.push(links.redirectTo(variant, id))}
          className="flex flex-col overflow-hidden pt-3"
        >
          <p className="h-12 text-center">
            {body && body !== '-'
              ? truncate(body)
              : variant === Variant.Organization
              ? ''
              : t('pet_card_default_description')}
          </p>
        </CardContent>
        {variant === Variant.Animal && (
          <CardFooter className="flex cursor-default justify-end gap-2 pb-3 pt-2">
            <Icons.heart
              onClick={handleLikeClick}
              className={`cursor-pointer transition-all ease-in-out hover:scale-110 ${
                isLikeClicked ? 'fill-primary-300 text-primary-300' : ''
              }`}
            />
            <Icons.heartDonate
              onClick={handleDonationClick}
              className={`hidden transition-all ease-in-out hover:scale-110 ${
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
