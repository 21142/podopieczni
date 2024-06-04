import { useLoadScript } from '@react-google-maps/api';
import { TRPCError } from '@trpc/server';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import i18nConfig from 'next-i18next.config.mjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'next-share';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  type GetStaticPaths,
  type GetStaticPropsContext,
  type InferGetStaticPropsType,
  type NextPage,
} from 'next/types';
import React from 'react';
import { Icons } from '~/components/icons/Icons';
import PageLayout from '~/components/layouts/PageLayout';
import { Button } from '~/components/primitives/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/primitives/Card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/primitives/Carousel';
import { Separator } from '~/components/primitives/Separator';
import Spinner from '~/components/spinner/Spinner';
import Map from '~/components/utility/Map';
import ShelterContactDetails from '~/components/utility/ShelterContactDetails';
import { links } from '~/config/siteConfig';
import { env } from '~/env.mjs';
import { useLoginToast } from '~/hooks/useLoginToast';
import { api } from '~/lib/api';
import dayjs from '~/lib/dayjs';
import { prisma } from '~/lib/db';
import { ssghelpers } from '~/lib/ssg';

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PetProfilePage: NextPage<PageProps> = ({ animalId }) => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const { loginToast } = useLoginToast();
  const router = useRouter();
  const { locale } = router;
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries: ['places'],
  });

  dayjs.locale(locale);

  const { data: pet } = api.pet.getPetById.useQuery({ id: animalId });
  const [isLikeClicked, setIsLikeClicked] = React.useState(
    pet?.isLikedByUser ?? false
  );

  const markPetAsFavoriteMutation = api.user.markPetAsFavorite.useMutation();
  const removePetFromFavoritesMutation =
    api.user.removePetFromFavorites.useMutation();

  React.useEffect(() => {
    setIsLikeClicked(pet?.isLikedByUser ?? false);
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on('select', () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi, pet]);

  if (!pet) {
    return <p>{t('pet_profile_page_no_pet_found')}</p>;
  }

  if (!isLoaded)
    return (
      <PageLayout>
        <Spinner />
      </PageLayout>
    );

  const handleLikeClick = async () => {
    if (!session) {
      loginToast();
      return;
    }

    if (!isLikeClicked) {
      await markPetAsFavoriteMutation.mutateAsync(pet.id);
      setTimeout(async () => {
        await router.push(links.favorites);
      }, 1000);
    } else {
      await removePetFromFavoritesMutation.mutateAsync(pet.id);
    }
    setIsLikeClicked((prev) => !prev);
  };

  interface IconAndText {
    icon: JSX.Element;
    text: string;
  }

  const iconsAndText: IconAndText[] = [
    pet.friendlyWithChildren && {
      icon: (
        <Icons.baby
          key="baby"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_children'),
    },
    pet.friendlyWithDogs && {
      icon: (
        <Icons.dog
          key="dog"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_dogs'),
    },
    pet.friendlyWithCats && {
      icon: (
        <Icons.cat
          key="cat"
          className="h-6 w-6"
        />
      ),
      text: t('pet_profile_page_good_with_cats'),
    },
  ].filter((item): item is IconAndText => !!item);

  return (
    <PageLayout
      name={pet.name ?? undefined}
      description={pet.description ?? undefined}
      image={
        pet.image ?? `${env.NEXT_PUBLIC_BASE_URL}/images/no-profile-picture.svg`
      }
      url={pet.url ?? `${env.NEXT_PUBLIC_BASE_URL}/pet/${pet.id}`}
    >
      <div className="mx-auto w-full max-w-8xl p-6">
        <div className="flex h-full flex-col items-center justify-center">
          <Carousel
            className="w-full max-w-[15rem] md:max-w-xs lg:max-w-lg xl:max-w-xl"
            setApi={setCarouselApi}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="lg:max-h-[70vh]">
              {pet.photos?.map((photo, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={photo.url ?? '/images/no-profile-picture.svg'}
                    alt={`Pet photo ${index + 1}`}
                    className="h-full w-full rounded-sm object-cover"
                    width={600}
                    height={600}
                    priority={true}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {pet.photos?.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
          {pet.photos?.length > 0 && (
            <div className="py-2 text-sm text-muted-foreground">
              {t('carousel_slide')} {current} {t('carousel_slide_of')} {count}
            </div>
          )}
          <div className="flex w-full flex-col gap-6 lg:flex-row">
            <Card className="rounded-lg bg-transparent lg:flex-1 lg:self-start lg:p-6">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <h1 className="text-4xl font-bold">{pet.name}</h1>
                    <span className="ml-4">
                      <Icons.heart
                        onClick={handleLikeClick}
                        className={`cursor-pointer text-primary-400 transition-all ease-in-out hover:scale-110 ${
                          isLikeClicked ? 'fill-primary-300' : ''
                        }`}
                      />
                    </span>
                  </div>
                  <p className="space-y-2 pt-4 text-lg sm:flex sm:flex-row sm:space-y-0">
                    <span className="mb-2 mr-2 inline-block sm:mb-0 sm:mr-4">
                      {pet.species}
                    </span>
                    <span className="mb-2 mr-2 inline-block sm:mb-0 sm:mr-4">
                      •
                    </span>
                    <span className="mb-2 mr-2 inline-block sm:mb-0 sm:mr-4">
                      {pet.breed}
                    </span>
                    <span className="mb-2 mr-2 inline-block sm:mb-0 sm:mr-4">
                      •
                    </span>
                    <span className="mb-2 mr-2 inline-block sm:mb-0 sm:mr-4">
                      {pet.shelter.address?.city}, {pet.shelter.address?.state}
                    </span>
                  </p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                <ul className="flex flex-col items-start space-y-4 text-lg md:flex-row md:space-x-4 md:space-y-0">
                  <li className="flex items-center">
                    <span className="mr-2">{t('pet_profile_page_age')}</span>
                    <span className="font-bold text-primary-300">
                      {pet.age}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">{t('pet_profile_page_gender')}</span>
                    <span className="font-bold text-primary-300">
                      {pet.gender}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">{t('pet_profile_page_size')}</span>
                    <span className="font-bold text-primary-300">
                      {pet.size}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">{t('pet_profile_page_color')}</span>
                    <span className="font-bold text-primary-300">
                      {pet.color ?? 'Unknown'}
                    </span>
                  </li>
                </ul>

                {pet.description && (
                  <>
                    <Separator className="mt-6" />
                    <div className="mt-6">
                      <h2 className="mb-2 text-2xl font-bold">
                        {t('pet_profile_page_pet_description', {
                          name: pet.name,
                        })}
                      </h2>
                      <p className="">{pet.description}</p>
                    </div>
                  </>
                )}

                {iconsAndText.length > 0 && (
                  <>
                    <Separator className="mt-6" />
                    <div className="mt-6">
                      <h2 className="mb-4 text-2xl font-bold">
                        {t('pet_profile_page_good_with')}
                      </h2>
                      <div className="flex flex-wrap">
                        {iconsAndText.map((item, index) => (
                          <div
                            className="mr-4 flex flex-col items-center"
                            key={index}
                          >
                            {typeof item !== 'boolean' && item?.icon}
                            {typeof item !== 'boolean' && item?.text && (
                              <span className="text-base">{item.text}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator className="mt-6" />
                <div className="flex flex-col justify-between pt-6">
                  <h2 className="mb-2 text-xl font-bold">
                    {t('pet_profile_page_how_long', { name: pet.name })}
                  </h2>
                  <div className="flex items-end gap-4">
                    <p className="text-lg">
                      {dayjs(pet.createdAt).fromNow(true)}
                    </p>
                  </div>
                </div>
                <Separator className="mt-6" />
                <div className="flex flex-col justify-between pt-6">
                  <h2 className="mb-2 text-xl font-bold">
                    {t('pet_profile_page_help')}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-base md:text-lg">
                      {t('pet_profile_page_share')}
                    </span>
                    <FacebookShareButton url={pet.url}>
                      <FacebookIcon
                        size={32}
                        round
                      />
                    </FacebookShareButton>
                    <LinkedinShareButton url={pet.url}>
                      <LinkedinIcon
                        size={32}
                        round
                      />
                    </LinkedinShareButton>
                    <TwitterShareButton url={pet.url}>
                      <TwitterIcon
                        size={32}
                        round
                      />
                    </TwitterShareButton>
                    <WhatsappShareButton url={pet.url}>
                      <WhatsappIcon
                        size={32}
                        round
                      />
                    </WhatsappShareButton>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:flex-2 rounded-lg bg-transparent p-0 lg:self-start">
              <div>
                <CardHeader>
                  <CardTitle className="mb-4 pt-4 text-2xl font-bold lg:text-3xl">
                    {t('pet_profile_want_to_adopt', { name: pet.name })}
                  </CardTitle>
                  <Button
                    className="w-fit rounded-full px-5 md:px-12"
                    variant="primary"
                    onClick={() => console.log(pet.id)}
                  >
                    {t('pet_profile_inquire_about_adoption')}
                  </Button>
                </CardHeader>
              </div>
              <CardContent className="p-0">
                <div className="px-6">
                  <Separator className="my-3" />
                  <div className="flex flex-col">
                    <div className="mt-4 w-full">
                      <h2 className="mb-2 text-2xl font-bold">
                        {t('pet_profile_shelter')}
                      </h2>
                      <div className="mt-4 flex items-center gap-4">
                        {pet.shelter.logo && (
                          <Image
                            src={pet.shelter.logo}
                            width={48}
                            height={48}
                            className="h-16 w-16"
                            alt="Shelter logo"
                          />
                        )}
                        <div>
                          <p className="text-lg font-medium lg:text-xl">
                            {pet.shelter.name}
                          </p>
                          <p className="w-fit text-base decoration-primary-300 underline-offset-4 transition hover:text-primary-300 hover:underline">
                            <Link href={links.organization(pet.shelterId)}>
                              {t('pet_profile_shelter_link')}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2 mt-6">
                  <Map
                    className="h-48"
                    address={`${pet.shelter.address?.address} ${pet.shelter.address?.city} ${pet.shelter.address?.state}`}
                    exactAddress={true}
                  />
                </div>
                <div className="p-6">
                  <ShelterContactDetails
                    organizationAddress={`${pet.shelter.address?.address}, ${pet.shelter.address?.city}, ${pet.shelter.address?.state}`}
                    organizationPhone={pet.shelter.phoneNumber}
                    organizationEmail={pet.shelter.email}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="px-6 py-6 sm:px-12 lg:px-48">
            <Button
              onClick={() => router.back()}
              className="hover:text-primary focus:text-primary text-md group flex items-center justify-center gap-x-0.5 font-sans text-gray-600 transition ease-out focus:outline-none"
              variant="link"
            >
              <Icons.chevronLeft className="h-5 w-5" />
              {t('go_back')}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PetProfilePage;

export async function getStaticProps(context: GetStaticPropsContext) {
  const animalId = context.params?.id as string;
  const locale = context.locale ?? 'en';
  if (!animalId)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `Animal not found for id: ${animalId}`,
    });

  await ssghelpers.pet.getPetById.prefetch({ id: animalId });
  return {
    props: {
      trpcState: ssghelpers.dehydrate(),
      animalId,
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const animals = await prisma.pet.findMany({
    where: {
      availableForAdoption: true,
    },
    select: {
      id: true,
    },
  });

  if (!animals) return { paths: [], fallback: false };

  return {
    paths: animals.map((animal) => ({
      params: {
        id: animal.id,
      },
    })),
    fallback: false,
  };
};
